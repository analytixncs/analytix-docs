---
id: analytix-salesflash-developerguide
title: Salesflash Developer Guide
sidebar_label: Salesflash Developer Guide
---

[Optional Header]: # "Salesflash Developer Guide"



---

- [SalesFlash Overview](#salesflash-overview)
- [Foreign Currency / Exchange Rate](#foreign-currency-/-exchange-rate)
- [Installment Billing](#installment_billing)
- [Advertising Sheet](#advertising-sheet)
  - [Churn Button](#churn-button)
  - [Dynamic YTD Button](#dynamic-ytd-button)

---

<div style="page-break-after: always;"></div>
## SalesFlash Overview

The SalesFlash application's focus is on bringing together invoices, adjustments and booked but not yet invoiced ads.  The data's primary grain is the GL Account associated with the transaction.  

There are tools in SalesFlash that will allow sites to further summarize their data by creating GL Groupings based on the GL Account numbers.

---

## Foreign Currency / Exchange Rate

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

```javascript
NUM(SUM(AMOUNT), ForeignCurrency_String & '#,##0.00;(' & ForeignCurrency_String & '#,##0.00)')
```

Notice that we are using the `AMOUNT` field as this is the NON Converted field.

Get more details in [Analytix Exchange Rate](./anlaytix-exchange-rate) Document.

---



## Installment Billing

The idea with installment billing is to allow the site to bill a customer a certain amount over time but recognize the revenue over a different schedule.

The billing side is handled by creating Debits and the revenue recognition is handled with a transtype of 6 and transaction numbers starting with IB.

The only way to distinguish Debits that are the counterparts of the **IB*** transactions, is to look at the **aoCreditDebit.subDetail** field.  If the value is **23**, it is a **IB*** counterpart.

Since this field is not in BI, we will need to load it manually into Analytix.  The query below will be used to do this by creating a Qlikview mapping object and mapping based on the **fn.transnum** to the **transactionnumber** in the **RevenueTable**.

```sql
SELECT
  fn.transnum,
  c.transnumber,
  c.subdetail
FROM fntransactions fn, aocreditdebit c
WHERE transnum = 'MD10668-05112018'
      AND fn.refnumber = c.transnumber
      AND fn.transtype = 3
```



### Debit Issue

The debit issue is the fact that there will exist in Analytix a debit for any ads that are set to be Installment Billing ads.  The issue with this is that the debits will cause double-dipping to happen as they are the AR side of Installment Billing.  

We could exclude them totally from Analytix, however these debits are needed to properly balance Analytix to the Balance Forward report.  

If these debits are in Analytix, then every single report will need to exclude them.  This is tedious, error-prone and increases the complexity of every expression.

#### Debit Issue Solution

Since excluding these debits from Analytix would cause issues with balancing, that will not be an option.

Currently, the **AMOUNT** field contains the Sum of all transaction amounts (Invoice, Debit and Credit) and the **~DEBIT_AMOUNT** field contains just the Debit transaction amounts.

To leave Installment Billing debits in, we need to remove the debit's dollar values that are associated with an Installment Billing transaction from the **AMOUNT** and **~DEBIT_AMOUNT** fields and store them in a new field **~IB_DEBIT_AMOUNT**.

Then in the chart we use to balance to the Balance Forward report, I will add in the **~IB_DEBIT_AMOUNT** to the Debit expression.

### Changes in Analytix

#### QVD_ALL.qvw - CombinedRevenue.QVD

##### [~IB_RECEIVABLE_AMOUNT]

In creating the ~IB_RECEIVABLE_AMOUNT, the TRANSAMOUNT and ~DEBIT_AMOUNT field need to be modified to exclude the installment billing receivable amounts.

```javascript
//- Now must check if this is an Installment Billing Debit Receivable.  If so, DON'T include in AMOUNT
IF(ApplyMap('IB_Map', TRANSACTIONNUMBER, 'FALSE') = 'FALSE', (TRANSAMOUNT * -1),0) as TRANSAMOUNT,
//--For Debits, we must check if debt is the receivabe of an Installment Billing ad
//--If so we exclude it from the DEBIT amount 
if(MAPPED_GLTRANSTYPE='DEBIT',
  IF(ApplyMap('IB_Map', TRANSACTIONNUMBER, 'FALSE')= 'FALSE', (TRANSAMOUNT * -1),0),0) AS 	[~DEBIT_AMOUNT],     
//--We now create a special field for just Installment Billing receivables
IF(ApplyMap('IB_Map', TRANSACTIONNUMBER, 'FALSE') = 'TRUE', (TRANSAMOUNT * -1),0) as [~IB_RECEIVABLE_AMOUNT],
```

##### Flag_IsInstallmentBillingDebit

Flag created with below code.  

```sql
//===========================================================
//---------------------------------------------------------
//--This mapping if for Installment Billing ads (IB*)
//--It is how we are going to mark MD* invoices ... the receivable in
//--an Installment Billing ad.
//=========================================================================
IB_Map:
MAPPING LOAD
  TRANSNUM,
  'TRUE' as Flag_IsInstallmentBillingDebit;
SELECT
  FN.TRANSNUM, //- This will be the MD Invoice Number
  C.SUBDETAIL
FROM FNTRANSACTIONS FN, AOCREDITDEBIT C
WHERE FN.REFNUMBER = C.TRANSNUMBER
      AND FN.TRANSTYPE = 3
      AND C.SUBDETAIL = 23;
```



#### SOURCE_SalesFlash.qvw

In SOURCE_SalesFlash, the `[~IB_RECEIVABLE_AMOUNT]` and `Flag_IsInstallmentBillingDebit` fields will be added to the RevenueTable.  Also, the `AMOUNT` and `[~DEBIT_AMOUNT]` fields will reflect the changes made in the QVD_ALL.qvw file.

#### SalesFlash.qvw

The only change needed in SalesFlash is on the *Reference Charts* tab > *GL Balance* Button.  The GL Balance chart shows Invoices, Debit and Credits and their balances.  We use the following expression to define what transaction types to show:

```javascript
=IF(TRANSTYPE = 'ADJUSTMENT INV', 'INVOICE',
	IF(REALIZED='Y' AND TRANSTYPE<>'INSTALLMENT INV' AND TRANSTYPE<>'INSTALLMENT CR', TRANSTYPE, Null())
	)
```

The basic use of the above is to first lump any ADJUSTMENT INV transactions in with the INVOICE transactions and then to exclude any "non" invoiced transactions and also exclude the INSTALLMENT INV and INSTALLMENT CR transactions.

Then when calculating the Revenue amount we need to add the IB Amount back into the debit amount:

```javascript
IF(TRANSTYPE='DEBIT', 
	Sum($(NetRevenue) + [~IB_RECEIVABLE_AMOUNT]), 
	Sum($(NetRevenue)))
```

#### What about INSTALLMENT CR

These credits correspond to the IB Invoice.  Hence they are included in revenue recognition reports but NOT in the Balance Forward.

Below is from Anna Carson:

>  If you query aocreditdebit.transtype=5 – this the corresponding entry to the IB invoice but for credits.
>
> We care about transtype=5 in Analytix as they are credits of the actual revenue. They do not credit the debit but the IB invoice.
>
> IB invoice AND these credits do NOT affect again OR Balance Forward. Currently the credits they do against an IB invoice/order are included in aging and BF and the really should not be.
>
> They should not be included as the invoice it’s crediting off is the IB invoice which is not included. The GL for both of these is what they care about.
>
> I think everywhere in your doc where you refer to Analytix and installment billing, I think you are referring to revenue based on GL? If so – that’s the only place these IB invoices and credits trantype=5 should show up.

---

## Advertising Sheet

The Advertising sheet contains a number of reports focused on what we thought Sales Reps and Advertising Managers would want to see.  However, these groupings are just a way to separate reports and it doesn't mean that others won't find these reports useful.

### Churn Button

The Churn reports offer users either a yearly or monthly churn.  These definitions are strict and would be difficult to modify on a site by site basis.

1. Yearly Churn - Compares data on a Year over Year basis, using the *Select A Year* field to determine the "Current" Year and the "Previous" Year
2. Monthly Churn - Compares data from the selected Month to the month previous to it.  Note this is not a YOY month compare.  As an example, a monthly churn could be compare August 2018 to July 2018.

#### Yearly Churn

To create churn type expression for Analytix we need to be able to compare revenue by AccountNumber for each year.

In the end we will have four expressions as defined below:

1. **Inactive:** Current Year Revenue=0 AND Previous Year Revenue = 0.
2. **Active:** Current Year Revenue<>0 AND Previous Year Revenue< >0.

2. **Lost:** Current Year Revenue=0 AND Previous Year Revenue <> 0.

3. **New:** Current Year Revenue<>0 AND Previous Year Revenue = 0.

**New**:

```
COUNT(DISTINCT //We only want to count distinct Accounts
//This will find all accounts in the current year whose sum of revenue is NOT equal to zero 
{<ACCOUNTNUMBER_ADBASE=({"=SUM({$<Posting_CalendarYear={$(=$(SelectYear))}>} $(NetRevenue))<>0"}) 

//This is the intersection operator.  It will take the result sets from the set above and below and intersect them.
//We cannot say =0 here since this will not count those accounts that had NO ad orders. So we take All Accounts and use the Minus (-) operator to remove those accounts that had revenue in the previous year from the list.

(ACCOUNTNUMBER_ADBASE-{"=SUM({$<Posting_CalendarYear={$(=$(SelectYear)-1)}>} $(NetRevenue))<>0"})

>} ACCOUNTNUMBER_ADBASE)
```

**Inactive:**

```
COUNT(DISTINCT {<ACCOUNTNUMBER_ADBASE=(ACCOUNTNUMBER_ADBASE -{"=SUM({$<Posting_CalendarYear={$(=$(SelectYear))}>} $(NetRevenue))<>0"}) *                                                                (ACCOUNTNUMBER_ADBASE-{"=SUM({$<Posting_CalendarYear={$(=$(SelectYear)-1)}>} $(NetRevenue))<>0"})

>} ACCOUNTNUMBER_ADBASE)
```

**Active:**

```
COUNT(DISTINCT {<ACCOUNTNUMBER_ADBASE={"=SUM({$<Posting_CalendarYear={$(=$(SelectYear))}>} $(NetRevenue))<>0"}*                                       {"=SUM({$<Posting_CalendarYear={$(=$(SelectYear)-1)}>} $(NetRevenue))<>0"}>} ACCOUNTNUMBER_ADBASE)
```

**Lost:**

```
COUNT(DISTINCT {<ACCOUNTNUMBER_ADBASE=(ACCOUNTNUMBER_ADBASE-{"=SUM({$<Posting_CalendarYear={$(=$(SelectYear))}>} $(NetRevenue))<>0"}) *

({"=SUM({$<Posting_CalendarYear={$(=$(SelectYear)-1)}>} $(NetRevenue))<>0"})

>} ACCOUNTNUMBER_ADBASE)
```

To make all of this easier to reason about in the calculated dimension, we use two variables to encapsulate the Current Year (`$(vChurnCurrYear)`) and Previous Year (`$(vChurnPrevYear)`) Revenue

```
=IF( ($(vChurnCurrYear) > 0 ) AND ( $(vChurnPrevYear) = 0), 'New Customers',
	IF( ($(vChurnCurrYear) = 0 ) AND ( $(vChurnPrevYear) = 0 ), 'Inactive Customers',
		IF( ($(vChurnCurrYear) = 0 ) AND ( $(vChurnPrevYear) > 0 ),  'Lost Customers',
			IF( ($(vChurnCurrYea
			r) - $(vChurnPrevYear)) / $(vChurnPrevYear) > 0, 'Increased Rev Customers',
				IF( ( ($(vChurnCurrYear) - $(vChurnPrevYear)) / $(vChurnPrevYear) < 0 ) AND ( ($(vChurnCurrYear) - $(vChurnPrevYear)) / $(vChurnPrevYear) > -1 ), 'Reduced Rev Customers', 'OTHER')
				)
			)
		)
	)
```



#### Monthly Churn

Churn by month allows the end user to select the “current” month to start the churn comparison.

So, if the month chosen is Nov. 2018, the churn calculations will look at Nov. 2018 and Oct. 2018.

The first thing we need is a Month/Year table that is not associated with any other tables.  Add the following code to the QVW Script:

```
//===========================================================//
//-- Create fields for use with the Monthly Churn charts on 
//-- the Advertising tab -> Churn
//-- NOTE: it doesn't matter that we are pulling this info from the
//--   insert date table
//-- It is only important in the variables. In the variables we will be using
//-- posting or insert date to compare based on user selection.
//===========================================================//

MonthYearSelection:
LOAD 
	Dual(QVD_Month & '-' & QVD_Calendar_Year, (QVD_Calendar_Year*100) + QVD_Month_OfYear_Number) as DynamicMonthYear%,
	Dual(Month(AddMonths(QVD_CalendarDate, -1)) & '-' & Year(AddMonths(QVD_CalendarDate, -1)), (Year(AddMonths(QVD_CalendarDate, -1))*100) + Month(AddMonths(QVD_CalendarDate, -1))) as DynamicMonthYearPrev%
FROM ..\QVD\dmDate.qvd (qvd)
Where QVD_Calendar_Year >= Year(Today())-1 AND QVD_Calendar_Year <= Year(Today())+1;

Let SelectMonthYear = '=NUM([DynamicMonthYear%])';
Let SelectMonthYearPrev = '=NUM([DynamicMonthYearPrev%])';
```

I have chosen to only load three years for the user to select from – “Prev, Curr and Curr + 1”

Notice that I am creating two variables to hold the information:

**SelectMonthYear** – Actual Month/Year selected
**SelectMonthYearPrev** – Previous Month/Year based on the selected Month/Year

Note that in these variables I am storing the number equivalent which is YYYYMM.

#### Other Variables needed for Monthly Churn

These are other variables that are used in the Monthly Churn charts.

**vChurnDynCurrMonth**

```
IF(IsNull(
AGGR(SUM({$<Insert_MonthOfYearNumber=
	{$(=Mid('$(SelectMonthYear)',5,2))},
	Insert_CalendarYear={$(=Mid('$(SelectMonthYear)',1,4))}>} $(NetRevenue)), AccountNumber_AdBase)),
	0,
AGGR(SUM({$
	<Insert_MonthOfYearNumber={$(=Mid('$(SelectMonthYear)',5,2))},
	Insert_CalendarYear={$(=Mid('$(SelectMonthYear)',1,4))}>
	} 
	$(NetRevenue)), 
AccountNumber_AdBase))
```

**vChurnDynPrevMonth**

```
IF(IsNull(
AGGR(SUM({$<Insert_MonthOfYearNumber=
	{$(=Mid('$(SelectMonthYearPrev)',5,2))},
	Insert_CalendarYear={$(=Mid('$(SelectMonthYearPrev)',1,4))}>} $(NetRevenue)), AccountNumber_AdBase)),
	0,
AGGR(SUM({$
	<Insert_MonthOfYearNumber={$(=Mid('$(SelectMonthYearPrev)',5,2))},
	Insert_CalendarYear={$(=Mid('$(SelectMonthYearPrev)',1,4))}>
	} 
	$(NetRevenue)), 
AccountNumber_AdBase))

```

You can then use the above two variables in your chart's dimension field.  Here is an example:

```
=
IF(($(vChurnDynCurrMonth) - $(vChurnDynPrevMonth))/$(vChurnDynPrevMonth) = -1, 
'Lost Customers',
	IF(	($(vChurnDynCurrMonth) - $(vChurnDynPrevMonth))	/ $(vChurnDynPrevMonth) > 0,
	'Increased Rev Customers',
		IF(($(vChurnDynCurrMonth) - $(vChurnDynPrevMonth))/$(vChurnDynPrevMonth) < 0
		AND ($(vChurnDynCurrMonth) - $(vChurnDynPrevMonth))/$(vChurnDynPrevMonth) > -1, 
		'Reduced Rev Customers',
			IF(($(vChurnDynCurrMonth) > 0 AND $(vChurnDynPrevMonth) = 0), 
			'New Customers',
				IF(($(vChurnDynCurrMonth) = 0 AND $(vChurnDynPrevMonth) = 0), 
				'Inactive Customers','OTHER')
				)
			)
		)
	)
```



---





### Dynamic YTD Button

Be sure to review the SalesFlash User Guide to understand what the Dynamic YTD Chart is designed to do as this document will explain how it accomplishes those goals.

The idea behind the Dynamic YTD chart is to break you out of the constraints of the typical YTD which is determined by the current date.  

There were a few obstacles that needed to be overcome.

1. The user could be either in Fiscal Or Calendar year.  Each of these modes required a different field to be used as the predictor of the final month/period in the YTD calculation.
2. The user could be in either Posting/Insert/Create date mode.  The calculation needs to take this into account.
3. Multiple months or periods could be selected, however, the calculation only needed a single value.  The greatest month/period is the value that was needed.
4. Selections on Months would return **MMM** style months.  A number for month is needed for the calculation.

To make this calculation easier to reuse, it is implemented as a series of Qlikview Variables.

| Variable Name                  | Variable Contents                                            | Expected Output                             |
| ------------------------------ | ------------------------------------------------------------ | ------------------------------------------- |
| vdynTYD_MonthPeriodFinalCalc   | IF(vFiscalOrCalendarFlag, <br />$(vdynYTD_getGreatestMonthPeriod), Num(Month(Date#($(vdynYTD_getGreatestMonthPeriod), 'MMM')))) | Single Month Number or Period Number        |
| vdynYTD_getGreatestMonthPeriod | Mid(GetFieldSelections(<br />$(=$(vFiscalOrCalendarMonthPeriod)), ';',13),<br />	Index(GetFieldSelections(<br />$(=$(vFiscalOrCalendarMonthPeriod)),';',13),';', -1)+1) | Single Month in MMM format or single period |
| vFiscalOrCalendarFlag          | Set to 0 or 1 via the **Switch to Fiscal Year** switch on the *Main* sheet. | 0 (Calendar) or <br />1 (Fiscal)            |

NOTE: if a variable isn't enclosed with a **$()**, that means that we want the text that is in the variable OR that the variable itself is already evaluating itself.  If you see the **$(vVarName)** around a variable name, Qlikview is evaluating the contents of the variable and returning the value to the expression.  You will also sometimes see **$(=$(vVarName))**.  Depending on the complexity of the expression in a variable and where that variable is used, you may need this syntax.  It is used often in Set Analysis when we want to force evaluation inside other expressions.

```javascript
//-- Dynamic YTD based on Posting/Insert/Create_Month Selection.
//-- It will be either Posting/Insert/Create based on which mode you are in
//-- Note, that the year is controlled by the "Select A Year" variable
//-- First, designate what Year this YTD column is for
//-- vFiscalOrCalendarYear returns either 
//--      "Posting/Insert/Create"_"Calendar/FiscalYear"
//-- $(SeletYear) returns the currently selected YOY value.
SUM({$<$(=$(vFiscalOrCalendarYear))={$(=$(SelectYear))}, 
//-- Clear out any selections in Posting/Insert/Create_Month/Period for our 
//-- calculation of YTD
$(=$(vFiscalOrCalendarMonthPeriod))=,
//-- I am using the Posting/Insert/Create_Month/PeriodOfYearNumber to select the 
//-- months I want included in the dynamic YTD.
//-- Basically, GetFieldSelections is used to get any selections in the 
//-- Posting/Insert/Create_Month/Period field
//-- Since the user could have selected more than one, the last month returned by 
//-- the GetFieldSelections function is used.
//-- So, if 'May;Jun' was selected, the Index function is used to find the last 
//-- semicolon, adding 1 to that location and using that result as the starting 
//-- point for the Mid() function.  
//-- The result would be 'Jun'
//-- A month number is needed, so the month 'MMM' value is converted to a number by 
//-- first converting it to a Date using the Date#('', 'MMM').  The 'MMM' designates
//-- a three character month.  Then the result can be converted into a Month, which 
//-- is dual field, allowing for the use of the Num() function on that result which 
//-- will convert it to the month number.
//-- All this produces a single number which is the greatest month selected.  
//-- If period number is needed, less needs to be done.  Simply getting the last 
//-- period number and returning it suffices.
//-- The last modify is simply taking this result and getting transactions
//-- where the Posting/Insert/Create_Month/PeriodOfYearNumber is <= said number.
$(=$(vFiscalOrCalendarMonthPeriodNum))={"<=$(=Num(Month(Date#(
Mid(GetFieldSelections($(=$(vFiscalOrCalendarMonthPeriod)), ';',13), Index(GetFieldSelections($(=$(vFiscalOrCalendarMonthPeriod)),';',13),';', -1)+1)
, 'MMM'))))"}>} $(NetRevenue))
```





