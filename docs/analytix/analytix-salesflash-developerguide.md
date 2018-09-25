---
id: analytix-salesflash-developerguide
title: Salesflash Developer Guide
sidebar_label: Salesflash Developer Guide
---

[Optional Header]: # "Salesflash Developer Guide"



<div style="page-break-after: always;"></div>

## Salesflash Overview

## Foreign Currency / Exchange Rate

In SalesFlash we will now have two fields to represent the Amount (Cost) of a transaction.  The one that is the default for all reports is `AMOUNT`.  

`AMOUNT` - This field represents the amount of the transaction in the currency the ad was placed in.  So, if an ad was placed with USD as it's currency, then AMOUNT is in USD.  If an ad is placed with GBP as the currency, then the AMOUNT field would represent GBP.  

`CONVERTEDAMOUNT` - This field is just what is says, it is the `AMOUNT` converted into the native currency.  If native currency is USD, then an ad placed in GBP would be converted, based on the exchange rate, to USD.

There are a few other fields that are available pertaining to Foreign Currency.

- **EXCHANGERATEID_ADBASE**
- **Flag_IsCurrencyNative** - "TRUE" - native currency, "FALSE" - NOT native currency
- **ForeignCurrency_ExchangeRate **- Currency Exchange rate from the fnExcahngeRate table.
- **ForeignCurrency_Name** - Currency Name from the fnCurrency table in Core.
- **ForeignCurrency_String** - the currency symbol

### Sample Expressions

Here is a sample expression that will insert the Currency string when formatting the output revenue:

```
NUM(SUM(AMOUNT), ForeignCurrency_String & '#,##0.00;(' & ForeignCurrency_String & '#,##0.00)')
```

Notice that we are using the `AMOUNT`field as this is the NON Converted field.

Get more details in [Analytix Exchange Rate](./anlaytix-exchange-rate) Document.

---

## Advertising Sheet

The Advertising sheet contains a number of reports focused on what we thought Sales Reps and Advertising Managers would want to see.  However, these groupings are just a way to separate reports and it doesn't mean that others won't find these reports useful.

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





