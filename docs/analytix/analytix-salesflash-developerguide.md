---
id: analytix-salesflash-developerguide
title: Salesflash Developer Guide
sidebar_label: Salesflash Developer Guide
---

[Optional Header]: # "Salesflash Developer Guide"



---

- [SalesFlash Overview](#salesflash-overview)
- [Foreign Currency / Exchange Rate](#foreign-currency-/-exchange-rate)
- [Advertising Sheet](#advertising-sheet)
  - [Churn Button](#churn-button)
  - [Dynamic YTD Button](#dynamic-ytd-button)
- []

---

<div style="page-break-after: always;"></div>

## SalesFlash Overview

The SalesFlash application's focus is on bringing together invoices, adjustments and booked but not yet invoiced ads.  The data's primary grain is the GL Account associated with the transaction.  

There are tools in SalesFlash that will allow sites to further summarize their data by create GL Groupings based on the GL Account numbers.

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

```
NUM(SUM(AMOUNT), ForeignCurrency_String & '#,##0.00;(' & ForeignCurrency_String & '#,##0.00)')
```

Notice that we are using the `AMOUNT`field as this is the NON Converted field.

Get more details in [Analytix Exchange Rate](./anlaytix-exchange-rate) Document.

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





