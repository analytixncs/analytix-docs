---
id: analytix-exchange-rate 
title: Exchange Rate / Foreign Currency in Analytix
sidebar_label: Exchange Rate / Foreign Currency in Analytix
---

[Optional Header]: # "Exchange Rate / Foreign Currency in Analytix"

## SalesFlash.qvw

In SalesFlash we will now have two fields to represent the Amount (Cost) of a transaction.  The one that is the default for all reports is `AMOUNT`.  

`AMOUNT` - This field represents the amount of the transaction in the currency the ad was placed in.  So, if an ad was placed with USD as it's currency, then AMOUNT is in USD.  If an ad is placed with GBP as the currency, then the AMOUNT field would represent GBP.  

`CONVERTEDAMOUNT` - This field is just what is says, it is the `AMOUNT` converted into the native currency.  If native currency is USD, then an ad placed in GBP would be converted, based on the exchange rate, to USD.

There are a few other fields that are available pertaining to Foreign Currency.

- **EXCHANGERATEID_ADBASE**
- **Flag_IsCurrencyNative** - "TRUE" - native currency, "FALSE" - NOT native currency
- **ForeignCurrency_ExchangeRate**- Currency Exchange rate from the fnExcahngeRate table.
- **ForeignCurrency_Name** - Currency Name from the fnCurrency table in Core.
- **ForeignCurrency_String** - the currency symbol

### Sample Expressions

Here is a sample expression that will insert the Currency string when formatting the output revenue:

```
NUM(SUM(AMOUNT), ForeignCurrency_String & '#,##0.00;(' & ForeignCurrency_String & '#,##0.00)')
```

Notice that we are using the `AMOUNT`field as this is the NON Converted field.

## Development Details

### QVD_ALL

In the CombinedRevenue load in QVD_ALL, we are simply adding the ExchangeRateID from the FNExchangeRate Table to every transaction loaded.

The mapping tables are constructed as follows:

```sql
//=======================================
//-- Foreign Currency/Exchange Rate Maps
//=======================================
OrdersERMap:
MAPPING LOAD
  ADORDERID_ADBASE,
  EXCHANGERATEID_ADBASE;
SELECT
  LINKID AS ADORDERID_ADBASE,
  EXCHANGERATEID AS EXCHANGERATEID_ADBASE
FROM AOCREDITDEBIT CD, FNEXCHANGERATE E
WHERE CD.EXCHANGERATEID = E.ID
  AND TRANSTYPE = 0;
  

AdjustmentsERMap:
MAPPING LOAD
  AOCREDITDEBITID_ADBASE,
  EXCHANGERATEID_ADBASE;
SELECT
  CD.ID AS AOCREDITDEBITID_ADBASE,
  EXCHANGERATEID AS EXCHANGERATEID_ADBASE
FROM AOCREDITDEBIT CD, FNEXCHANGERATE E
WHERE CD.EXCHANGERATEID = E.ID
AND CD.TRANSTYPE = 3;
```

The **OrdersERMap** will take all orders and give them their ExchangeRateID and the **AdjustmentsERMap** will do the same for Credits and Debits.

### Source_SalesFlash

In Source_SalesFlash, we get the main currency information from Core:

```sql
//=======================================
//-- Exchange Rate table info from Core
//=======================================
ForeignCurrencyTable:
LOAD
	EXCHANGERATEID_ADBASE,
	EXCHANGERATE as ForeignCurrency_ExchangeRate,
	CURRENCYNAME as ForeignCurrency_Name,
	CURRENCYSTRING as ForeignCurrency_String,
	If(ISNATIVE=1, 'TRUE', 'FALSE') as Flag_IsCurrencyNative;
SELECT E.ID AS EXCHANGERATEID_ADBASE,
  E.EXCHANGERATE,
  C.NAME AS CURRENCYNAME,
  C.CURRENCYSTRING,
  C.ISNATIVE
FROM FNEXCHANGERATE E, FNCURRENCY C
WHERE E.FOREIGNCURENCYID = C.ID;
```

This will allow the ExchangeRate_ID in the RevenueTable to link to its currency details.

We also want to create a field that will be the converted amount.  We do this by building a mapping table that will link to the exchange rate and return a conversion factor that we can multiply by the AMOUNT field to get a new field that is in the Native Currency.

```sql
//--------------------------------
//--Loading mapping for Rows in dmExchangeRate
//--Do not load the null row (id=1) as it's exchange rate
//--is 0 and for our purposes we want it to be 1
//--By excluding the null row, it will fail when mapping
//--and we can return the default of 1
//--------------------------------
ExchangeRateMap:
MAPPING LOAD 
	EXCHANGERATEID_ADBASE,
	1 / ForeignCurrency_ExchangeRate as ForeignCurrencyToNative
Resident ForeignCurrencyTable;
```

Then in the RevenueTable build, the CONVERTEDAMOUNT field is created using the ForeignCurrencyToNative mapping:

```sql
RevenueTable:
...
	EXCHANGERATEID_ADBASE,
	AMOUNT * ApplyMap('ExchangeRateMap', EXCHANGERATEID_ADBASE, 1) as CONVERTEDAMOUNT,
...
```

