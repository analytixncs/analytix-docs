---
id: informer-basics
title: Informer Basics
sidebar_label: Informer Basics
---



## Informer Support Links

- [Advanced Filters](https://informer5.zendesk.com/hc/en-us/articles/360001162923-6-7-Advanced-Filters)
- [Why Datasets vs AdHoc Report](https://informer5.zendesk.com/hc/en-us/articles/360001210986-Why-Use-Datasets-vs-Ad-Hoc-Queries-)

## Entrinsik Training

**Wildcard for UniData** is `...`

**Filtering - Variables**.  You can setup certain variables that are unique for each user.  For example, *Department* could be a variable that would be each users department so when they ran the filter it would automatically filter by their department.

**Date Keywords** - WEEK_BEGIN, WEEK_END are keywords not listed in box, but are available.

**How are sales people doing against budget** - Where is the budget data and how does it link to other data.

**Codes** Can be used in a Datasource mapping and apply the code to the field.

**Datasource - Workspaces** - allows you to create a virtual database from csv files.

## Creating a Dataset from an Ad-Hoc Report

A dataset and an Ad-Hoc report  have many of the same features, however the dataset is the preferred format if you plan on scheduling the query to run at certain intervals and what multiple users to be able to use reports built from the dataset.

For example, if you had 10 users who needed the data from a query and it was built as an Ad-Hoc report, the database would be hit 10 times to produce the data.  Once for each user running the report.  

However, if the query was build as a Dataset and was scheduled to be reloaded every 6 hours, then those 10 users could access the data with just a single run of the query against the DB every 6 hours.

This is a change from Informer 4, so you will see that all of the base reports and imported reports come into Informer 5 as Ad-Hoc reports.  Luckily, it is very easy to convert these Ad-Hoc reports into Datasets.

### Step 1

Find the report you want to covert to a Dataset, open it and run it.

![image-20200227150927583](./informer_tips_dataset_001.png)

This is very important, as the report must have data in it for you to get the "Create Dataset" option.

### Step 2

Click on the vertical 3 dots in the right corner and choose "Create Dataset"

![image-20200227151705836](../assets/informer_tips_dataset_002.png)

This will bring up a dialog where you can name your Dataset and give it a description.

Once done with that you will be taken to the Dataset view of the report you converted.

![image-20200227151858789](../assets/informer_tips_dataset_003.png)

## Informer Tips

### Current Month - YOY Using Criteria

To pull data for the current month from both this year and last year from a dataset, you can use the following **Criteria**

![1573242474960](../assets/informer_tips_002.png)

This is accomplished by creating a Group in the Criteria section of a query.

Since you want to get data from both the current month and the current month from the previous year, make sure to mark the group as "Match one of"

![img](../assets/informer_tips_001.PNG)

Next, add criteria and choose the date field you want to filter on.  The first criteria will be using the *inclusive between* comparison.  This will allow you to choose two values for the between to match on.  

To make this dynamic, so that you do not need to change the criteria every month, you can use informer *keywords* to populate our between values.  You can access a list of the keywords from within Informer as well:

![1573243161315](../assets/informer_tips_003.png)

You will populate the two values with **MONTH_BEGIN** and **MONTH_END**.  This will instruct informer to look at today's date to determine what is the starting and ending of the month.

This will give us the current month's data, but we also want last years data for the same month.

Add a new Criteria row and using the same date field as the other criteria do another *inclusive between* comparison, but this time instruct informer to pull last years data.  Using Informer's keywords **MONTH_BEGIN-1Y** and **MONTH_END-1Y**.  

Notice all that was needed was using the Years modifier and specifying how many years to subtract.

### Current Month - YOY Using a Calculated Field

A calculated field won't limit your dataset, but you can use it to create a field using JavaScript to pull only specific data.

This field doesn't make sense, but, create a Flow Step -> Calculated Field:

![img](../assets/informer_tips_005.png)

If you want to have a field that only contains priceActAmout for rows with a startDate of 2018, do this:

```javascript
if(moment(startDate).year() === moment().year()-1) {
    priceActAmt
} else {
    0
}
```



### Viewing a Dataset Query

When creating complex criteria, it is sometimes nice to be able to see the query that Informer constructs.  This will allow you to verify that your criteria is actually doing what you want it to.

The following can be done when *editing* a **Dataset** or **Report**.

Just click on the ellipses near the Query title and choose **View code**

![1573243670998](../assets/informer_tips_004.png)

This will pop up a window called **Query code**. It won't look pretty, but you will be able to see how Informer has interpreted how you built your criteria.

Here is an example:

```sql
SELECT INET.CAMPAIGNS WITH (EVAL "OCONV(CAMPAIGN.TYPE,'MCU')" = "M" AND EVAL "OCONV(STATUS.CODE,'MCU')" NE "AC" AND EVAL "OCONV(STATUS.CODE,'MCU')" NE "DE" AND EVAL "OCONV(STATUS.CODE,'MCU')" NE "KI" AND EVAL "OCONV(STATUS.CODE,'MCU')" UNLIKE "Q..." AND ((START.DATE >= "11/01/2019" AND START.DATE <= "11/30/2019") OR (START.DATE >= "11/01/2018" AND START.DATE <= "11/30/2018")))
LIST INET.CAMPAIGNS EVAL "CHAR(244):CHAR(171):CONVERT(CHAR(253),CHAR(250),CONVERT(CHAR(252),CHAR(249),CONVERT(CHAR(251),CHAR(248),CONVERT(CHAR(32),CHAR(7),CONVERT(CHAR(4),CHAR(245),CONVERT(CHAR(13),CHAR(247),CONVERT(CHAR(10),CHAR(246),SUBR('-OCONVS',CAMPAIGN.ID,'MD00'):CHAR(166):ADV.NAME:CHAR(166):AGENCY.NAME:CHAR(166):WEB.GROUP:CHAR(166):STATUS.CODE:CHAR(166):SUBR('-OCONVS',START.DATE,'D4/'):CHAR(166):SUBR('-OCONVS',END.DATE,'D4/'):CHAR(166):SUBR('-OCONVS',COST,'MD22'):CHAR(166):SUBR('-OCONVS',COMMISSION,'MD22'):CHAR(166):SUBR('ESC.AT.V5',WEB.SITE):CHAR(166):SUBR('ESC.AT.V5',PRICE.DESC):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.START.DATE,'D4/')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.END.DATE,'D4/')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.PER.UNIT,'MD55')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.QTY,'MD00')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.EXT,'MD22')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.ACTUAL.IMPS,'MD00')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.ACT.AMT,'MD22')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',TRANS('INF_INET.ORDERS',PRICE.LINEID,'ACT.AMT','X'),'MD22')):CHAR(166):STATUS.DESC:CHAR(166):WEB.GROUP.NAME))))))):CHAR(187)" CNV "" FMT "80L" ID.SUP COUNT.SUP COL.SPCS 0 HDR.SUP COL.SUP REQUIRE.SELECT
```

You can go to [Instant SQL Formatter](http://www.dpriver.com/pp/sqlformat.htm) to clean up the above query ... a little.

If you look at the [Current Month - YOY Example](#current-month---yoy_using_criteria), we create a group and did two *inclusive between* comparisons on Start Date.  If you look at the SQL below, you will see that part of the code start at line 6.

```sql
SELECT inet.campaigns with (eval "OCONV(CAMPAIGN.TYPE,'MCU')" = "M" 
AND    eval "OCONV(STATUS.CODE,'MCU')" ne "AC" 
AND    eval "OCONV(STATUS.CODE,'MCU')" ne "DE" 
AND    eval "OCONV(STATUS.CODE,'MCU')" ne "KI" 
AND    eval "OCONV(STATUS.CODE,'MCU')" unlike "Q..." 
AND    (( 
                     start.date >= "11/01/2019" 
              AND    start.date <= "11/30/2019") 
       OR     ( 
                     start.date >= "11/01/2018" 
              AND    start.date <= "11/30/2018"))) list inet.campaigns eval "CHAR(244):CHAR(171):CONVERT(CHAR(253),CHAR(250),CONVERT(CHAR(252),CHAR(249),CONVERT(CHAR(251),CHAR(248),CONVERT(CHAR(32),CHAR(7),CONVERT(CHAR(4),CHAR(245),CONVERT(CHAR(13),CHAR(247),CONVERT(CHAR(10),CHAR(246),SUBR('-OCONVS',CAMPAIGN.ID,'MD00'):CHAR(166):ADV.NAME:CHAR(166):AGENCY.NAME:CHAR(166):WEB.GROUP:CHAR(166):STATUS.CODE:CHAR(166):SUBR('-OCONVS',START.DATE,'D4/'):CHAR(166):SUBR('-OCONVS',END.DATE,'D4/'):CHAR(166):SUBR('-OCONVS',COST,'MD22'):CHAR(166):SUBR('-OCONVS',COMMISSION,'MD22'):CHAR(166):SUBR('ESC.AT.V5',WEB.SITE):CHAR(166):SUBR('ESC.AT.V5',PRICE.DESC):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.START.DATE,'D4/')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.END.DATE,'D4/')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.PER.UNIT,'MD55')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.QTY,'MD00')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.EXT,'MD22')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.ACTUAL.IMPS,'MD00')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',PRICE.ACT.AMT,'MD22')):CHAR(166):SUBR('ESC.AT.V5',SUBR('-OCONVS',TRANS('INF_INET.ORDERS',PRICE.LINEID,'ACT.AMT','X'),'MD22')):CHAR(166):STATUS.DESC:CHAR(166):WEB.GROUP.NAME))))))):CHAR(187)" cnv "" fmt "80L" id.sup count.sup col.spcs 0 hdr.sup col.sup require.SELECT
```

## JavaScript Calculated Field



## Loading External Attribute Data

If you have external attribute data (Excel, CSV, etc) you can load this into a dataset in Informer and than "add" this data to another dataset via a Flow Step.

One example of external data that would work would be extra customer attributes that are not in the main database, old account number, other name, etc.

Until I research it more, I'm don't think this would be a way you could bring in Goal or Budget data, however, I could be wrong.  

The easy application is external data with a  1 to 1 mapping to another data point.

Here is an easy example.  I have a dataset in Informer with a bunch of information, one of them being the Agency Name.  I also have an external spreadsheet with the **Agency Name** and an **Agency Alias**.

The end goal is to link the spreadsheet to the dataset on **Agency Name**.

To do this, you first must create a dataset from your external spreadsheet.  You can accomplish this in a number of ways, here are two:

1. Go to the **Datasets page** in Informer and drag and drop your Excel file
   ![1574192288686](../assets/informer_tips_006.png)

   You will the dialog above, simply drop the file here.

   ![1574192477192](../assets/informer_tips_007.png)

   

   Give the dataset a name and choose the sheet (this is an excel file) that the data is located on.

2. Or, Click on the New Dataset button and choose upload a file:

   ![1574192719800](../assets/informer_tips_009.png)

   Then choose a file and fill in the Dataset name and Sheet name where data is located.

   ![1574192675476](../assets/informer_tips_008.png)

   Click Save.

This will upload the data in the external file and create a new Dataset.  You will see it in your list of Datasets:

![1574192840659](../assets/informer_tips_010.png)

To get the Agency Alias into another Dataset, simply open the Dataset that you want to append the external data to and create a field using the Flow Step, *Add Field/Fields from another Dataset*

![1574193038428](../assets/informer_tips_011.png)

This Flow will have you select the dataset where the target field resides (AgencyAliasExternal Dataset) and then you must link these Datasets by choosing the fields from each dataset that will create the link.  In our case, it is simply the Agency Name.

![1574193254407](../assets/informer_tips_012.png)

The other important setting is choosing the fields you would like to.  Click and add the fields that you want.  In this example, it is just the Agency Alias.

The *What if more than one value matches?* option can be left as *Only use the first value*.  

The *Prefix field labels* setting allows you to add a prefix to these import fields so that you can better identify them as coming from another dataset.  It is optional.

## Flow Step - Normalize

Splits array values into individual rows for each value in the array.

I tested on a dataset that had multiple *array* fields in it and when I normalized on all of the array fields, it "lined" up the arrays.

**Without Normalize flow step:**

![1576164558349](../assets/informer_tips_013.png)

**With the Normalize flow step:**

![1576165545982](../assets/informer_tips_013-2.png)

## Using the Dates in Your Filters

### Date Keywords

Using Date keywords in your filters will allow you to get dynamic date filtering.  Meaning this filtering will update based on the current date when the filter is run.

Here are the keywords:

![1573243161315](../assets/informer_tips_003.png)

All keywords resolve to a single date.  For example **TODAY** will be today's date.  **YEAR_BEGIN** will be January 1st of the current year.  I believe **NOW** is the only keyword to incorporate the current time.

The Keywords by themselves would allow us to do a whole lot, but the **modifiers** really add power.

The modifiers allow you to take the date returned by the Keyword and change it by years, quarters, months, weeks or days.

For example, if the filter needed is Start of the Year **two years ago** through the Current Start of the Year.  If today's date is 5/5/2020, the filter being requested is:

**01/01/2018** through **01/01/2020**

Using the modifiers we can accomplish this as follows:

- **YEAR_BEGIN-2y** = 01/01/2018
- **YEAR_BEGIN** = 01/01/2020

> You can have one modifier modifying each Date Keyword.  You **cannot** do something like this: YEAR_BEGIN-2y+2m
>
> To accomplish this you would instead do:
>
> YEAR_BEGIN-22m

> **BUG ALERT** - I did find an issue when trying to use YEAR_BEGIN with no modifiers.  It didn't return anything.  To make it return the current YEAR_BEGIN adding a + or - after it seemed to work:
> **YEAR_BEGIN+**

**To create a filter** using Date Keywords, select the Date keyword option, which will show in your filter options if you are on a field typed as Date.

![1578944607855](../assets/informer_tips_date-filters-001.png)

This will present you with a side bar area where you can build your filter.

When building your filter, another feature of Date keywords that you need to understand is how to tell your filter how to *filter* on the date keyword you create.  You have the following options:

![1578944723488](../assets/informer_tips_date-filters-002.png)

> In the example below, assume the ***Date Keyword*** is **YEAR_BEGIN** and it will return a date of **01/01/2020** and the field being filtered is **StartDate**

- **on** - Only return records that match the date returned by your Date Keyword. 

  > **StartDate = 01/01/2020**

- **on or before** - Return records where dates are less than or equal to the date returned by your Date Keyword.

  > **StartDate <= 01/01/2020**

- **before** -  Return records where dates are less than the date returned by your Date Keyword.

  > **StartDate < 01/01/2020**

- **on or after** -  Return records where dates are greater than or equal to the date returned by your Date Keyword.

  > **StartDate >= 01/01/2020**

- **after** - Return records where dates are greater than the date returned by your Date Keyword.

  > **StartDate > 01/01/2020**

You can create multiple rows in your filter to achieve the filter that you want.  

An example would be creating a filter that would select all dates from the beginning of the previous year, to the end of the current year.  Please note there are multiple ways to structure this filter, I will only present one.

If today's date is 5/5/2020, our filter should do the following 

**StartDate >=01/01/2019 and StartDate < 01/01/2021**

![1578947893225](../assets/informer_tips_date-filters-003.png)

### Date Relative to Now

**Date Relative to Now** creates a filter that lets you look into the past or future in relation to today's date.   The first field will be either 'Next' or 'Past'. The middle field is a positive integer that needs the final field to tell the filter if it will be days, weeks, months or years.

![1578948578949](../assets/informer_tips_date-filters-004.png)

Keep in mind that when filtering for the Next/Past of anything, it doesn't take the current date to be part of the Next/Past selection.

> **Past WILL** include today's date in the filtered dates 
>
> **Next WILL NOT** include today's date in the filtered dates 

**Some examples based on Today's Date of 1/13/2020**

- **Past 2 Days** - Returns 1/11/2020-1/13/2020
- **Past 2 Weeks** - Returns 12/30/2019-1/13/2020
- **Next 2 Months** Returns 1/14/2020 - 3/31/2020 - Notice it returned the *Next* full 2 months

### Date Range

The tried and true date range is simply that.  Enter a starting and an ending date range to filter on.

### Distinct Values

Allows filtering by Years, Months, etc.  If the filter needed is Nov and Dec of 2019, 2020, Distinct Values will get you there.

When you choose Distinct Values on a Date field, you will initially be presented with the years available in the date field to select.  However, by clicking on the ellipses you will have the option to change the date period to something else.  

![1578949557137](../assets/informer_tips_date-filters-005.png)

In our example, filter by Nov and Dec of 2019 and 2020, you would need to add two Distinct value filters.  The first for the years and the second for the months.  It would like like this:

![1578949720984](../assets/informer_tips_date-filters-006.png)

## Using Datasets

The data in a Dataset will be persisted.  Meaning that once loaded, it will be available for future use, while the Ad Hoc query's data is dumped after it is done being used.

Persisted but not updated data would work for historical data, but for reporting that requires current data the dataset data must be refreshed at certain intervals to be useful.

You can do this by scheduling a job to run to refresh your datasets.

## Jobs & Emails

 Jobs are the Informer way to take some sort of action.  

- Emails are sent as part of a Jobs. 
- Jobs are also used to schedule the reload datasets.  

You can pair the reloading with Actions like emailing, however, you don't have to.  Each dataset in a Job has a check box "Refresh on job run" that will determine if the dataset will be refreshed before the other actions in the Job are run.

![image-20200210093208408](./informer_tips_jobs-001.png)

A job is made up of two parts, the **Data** and the **Actions**.

You can have a Job with just Data (probably for a reload) or just Actions, you don't need both.

### Job Data Options

The data for a job can be either a **Dataset** or a **Query**.  The Query being one of your Ad-Hoc Reports.

You can have multiple **Data** objects in a single job.  This would allow you to refresh both data objects as well as send email that included data from both Data objects.

### Job Actions

You have five actions that you can perform in a job.  They are:

- **Send an Email** - Sends an email to users that enter.  This is an option where a single email will be generated and you will have to fill out the email addresses that the email is going to.  This is useful for reports that you know who the recipient will be
- **[Send an email burst](https://informer5.zendesk.com/hc/en-us/articles/360032985372-3-3-Send-an-Email-Burst)** - An email burst uses the data in the dataset to get the email addresses to send emails and data to.  This is what I would call a loop and reduce, since it will not only use an email field in the dataset to determine who to send the email to, but will also reduce the data so that the email recipient only gets the data they are "associated" with.
- **Send to FTP** - Sends to an FTP site
- **Send to file system** - Exports to the host boxes files system.
- **Export Saved List** - this will create  list in a Datasource

### Email Burst Job Action

An email burst uses the data in the dataset to get the email addresses to send emails and data to.  

This is what I would call a loop and reduce, since it will not only use an email field in the dataset to determine who to send the email to, but will also reduce the data so that the email recipient only gets the data they are "associated" with.

You can choose to attach the data associated with the user email and/or include the full set of data.

![image-20200210094850978](./informer_tips_jobs-002.png)



## Data Access Tokens

Data Access Tokens allow you to access your Dataset from a command line interface using cURL or HTTPie.

You can also use the curl output to access the data via a browser or in a program that supports rest APIs.

Here is an example of a cURL Data Access Token:

```javascript
curl "https://digital20192.msglcloud.com:8082/api/datasets/cafe1b00-9544-4799-a06a-184ebc4e4bd9/export/json?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIyNTk0ZWNjNi1mYmY1LTRlZTgtYmJmNy0zOTEyNDNhMWU4NjkiLCJpYXQiOjE1ODA3NDQ3MzIuMzIzfQ.GPmK56XqmiEww_D6kSWZHh1FNSeqaadePg706u1qkEg"
```

If you just take what is in quotes, you can paste into a browser or into another application.

Output can be in JSON, XML or CSV.

Here is a sample of JSON output from a sample Dataset:

```json
[
    {
        "name_id_assoc_companyName": "MERLE NORMAN COSMETICS",
        "salesrep_id_assoc_repName": [
            "Nora Smith"
        ],
        "id": "MENO*LOC1*16",
        "advName": "MERLE NORMAN COSMETICS",
        "agencyName": "",
        "brandName": "DOMESTIC",
        "baseCost": 1140
    },
    {
        "name_id_assoc_companyName": "BMW of North America, LLC",
        "salesrep_id_assoc_repName": [
            "Wayne Burrows"
        ],
        "id": "244008*A1*48",
        "advName": "BMW of North America, LLC",
        "agencyName": "Mediavest/Starcom",
        "brandName": "3 Series",
        "baseCost": 42962.7
    },
    {
        "name_id_assoc_companyName": "BIOMARIS USA",
        "salesrep_id_assoc_repName": [
            "LUCIOUS, LOLA"
        ],
        "id": "BIUS.1*LOC1*4",
        "advName": "BIOMARIS USA",
        "agencyName": "",
        "brandName": "DOMESTIC",
        "baseCost": 1908.68
    },
  ...
]
```



## Power Scripts

Power Scripts are advanced scripts (JavaScript) that gives you complete control over the data.  A Power Script is JavaScript with a sandboxed script context

Here are the predefined keywords you can use in your Power Script. [Informer Docs](https://informer5.zendesk.com/hc/en-us/articles/115005113823)

| Keyword | Type            | Desc                                                         |
| ------- | --------------- | ------------------------------------------------------------ |
| $record | object          | The current row. You may modify this row.                    |
| $index  | number          | The current row number (row 1 = index 0)                     |
| $omit() | function        | When called, removes the current row                         |
| $fields | object          | Field metadata                                               |
| $field  | function        | Function to describe a field: $field('location').label('Loc') |
| $inputs | object          | User Inputs                                                  |
| $local  | object          | Variable that is not cleared from on record to the next      |
| _       | object/function | Lodash v3 library. [lodash](https://lodash.com)              |
| moment  | function        | moment date manipulation library. [momentjs](https://momentjs.com) |

To declare a variable use the `var` keyword. 

```javascript
var gtp = $inputs['greaterThanPrice'] || 0;
if($record.baseCost >= gtp) {
    $record.isGreaterThan = true
} else {
    $record.isGreaterThan = false
}
```

Do not `return` anything from the Power Script.  Simply change the value of what you want.

You can create multiple fields in a single Power Script.

### Using $local

The $local keyword is very powerful in that it persists throughout the load process.  First thing to understand is that it is an Object.  Which means, you can declare multiple local persistent variables using the $local keyword:

```javascript
$local.count = 0;
$local.otherVariable = "x";
```

However, if you were to declare the $local variables as above, they would be reset every time.  To declare these types of variables, you must first check if they exists, if they do, continue, if they don't, then create them:

```javascript
if(!$local.count) { // if this var doesn't exist then
  $local.count = 0 // initialize it
}
// Another method that does the same thing
$local.count = ($local.count) ? $local.count : 0

// Last way to do the same thing
$local.count = ($local.hasOwnProperty('count')) ? $local.count : 0
```

If you wanted to create a row count variable, you would pick one of the above methods to perform the initialization and then increment the count and store in a `$record` variable.

```javascript
if(!$local.count) { // if this var doesn't exist then
  $local.count = 0 // initialize it
}
//This will create a rowCount record for every row
//the ++ at the end of the $local.count will increment AFTER it assigns 
//whatever is in $local.count.  This just means your first row will be 0.
$record.rowCount = $local.count++
```

### Numbers and Other Gotchas

You must be aware of the data type of the fields you are using and if there are any *Null* values in the fields you are using.

For Example, if you wanted to get a running total by Customer (AdvName) and the field you were using to get this running total (priceActAmt) had null values in it, you would need to take that into account in your script.

### Delete a column

Use the keyword **delete** followed by the column you want removed.

```javascript
delete $record.columnToDelete
```



### Getting Total By Advertiser and % of Total By Advertiser

The `$local` variable can be very powerful by itself, but when used in conjunction with the **Flush** flow step, you can do a number of other things.

It is important to understand that the `$local` object will persist between running a Power Script and a **Flush** flow step.

**Goal**

The goal is to get a field that sums the revenue for an advertiser and then uses that to calculate the percentage of total for every row.

>  This is vastly different from the **Percent of Total** flow step as this is based on the Grand Total versus totals by advertiser.

To do this we need three flow steps.

1. **Power Script Flow Step** - used to calculate the Total Revenue for each Advertiser.  This information will have to be stored in the `$local` object so that it is persisted.
2. **Flush** - Starts a new pass of the data with our `$local` object intact.
3. **Power Script Flow Step** - used to calculate the % of Total Revenue per Advertiser and create the fields 
   - **$record.percentOfTotalByAdv** - This is the field we want, the % of Total Revenue by Advertiser.
   - **$record.TotalByAdv** - This is the subtotal for each advertiser.  We really don't need to expose this as a record, but it is useful for testing.

Here is what the Flow steps look like:

![image-20200213150630405](../assets/informer_tips_date-powerscript-001.png)

**Power Script - Aggregate Rev By Advertiser**

```javascript
// The usual initialization code
if (!$local[$record.advCode]) {
	$local[$record.advCode] = 0    
}
// Add current records amount to the running total
$local[$record.advCode] = $local[$record.advCode] + $record.orderNetAmt 
```

The unique thing that is happening in the **Aggregate Rev By Advertiser** Power Script, is that we are create a different object property on the `$local` object for each advCode (advertiser).  This allows us to keep a different total for each Advertiser.

Next we just run the **Flush** Flow step.

**Power Script - Percent Of Adv Total**

```javascript
$record.percentOfTotalByAdv = ($record.orderNetAmt / $local[$record.advCode])
$record.TotalByAdv = $local[$record.advCode]
```

This above code is simply creating the two new fields that we want.  

## Saved Functions



# Questions When Converting from v4 to v5

##  Informer 4 allows for input parameters to be set on the schedule

I am assuming this means setting some sort of filtering criteria for what will be emailed/exported for a job.

If the Job's data is an **Ad Hoc Report** and it has query Inputs associated with it, when you create a Job with that report and click on run the Job editor window, you will be presented with the *Query Inputs* dialog, where you can enter the inputs.

![1586186067004](../assets/informer_tips_v4-v5_001.png)

When you click on run, you will see the Inputs dialog:

![1586186135921](../assets/informer_tips_v4-v5_002.png)

Whatever you enter as inputs will be used on all subsequent runs of the Job.

**Datasets**

You can do the same with a Dataset, but the standard practice with a dataset will be to have one job that reloads it and the other jobs that use a **post filter**, to narrow the data and set to the appropriate users.

**Post Filter**

Many times, your need to only set a select set of data to users can be accomplished using a **Post Filter** or by using an action such as the "Sen an email burst".

The post filter is located here:

![1586191934643](../assets/informer_tips_v4-v5_003.png)



