---
id: insight-duplicate-issues
title: InSight Duplicate Fixes
sidebar_label: InSight Duplicate Fixes
---



## Duplicate Subscription Draw records

Check the error for the following somewhere inside of it:

```
Source: "Microsoft SQL Server Native Client 11.0" Hresult: 0x80004005 Description: 
"Violation of PRIMARY KEY constraint 'PK_stg_fct_SubscriptionDraw'. Cannot insert 
duplicate key in object 'dbo.stg_fct_SubscriptionDraw'. The duplicate key value is 
(3455136).".
```

If you see `Violation of PRIMARY KEY constraint 'PK_stg_fct_SubscriptionDraw'` then you will need to follows these steps to fix the issue.

```sql
select * from stg_fct_SubscriptionDraw
where sudr_key = 3455136 --This is the key from the error message

--You will then take the sudr_SubscriptionKey from the above query
--and run this query
select * from stg_dim_subscription
where su_key = 10115539 
```

You will then take the **su_Code** field from the above query and search for that in the **cmSubscriptionDraw.asc** file.

You will be look for a record that has dates overlapping with another record with the same su_Code or where the first date is after the second date:

```
"MCCCM"|79249795|02/22/20|02/21/20|"OSu-F"|"Office Pay"|1|1|1|1|1|1|0|no
```

## Duplicate dst_fct_SubscriptionCount

If the error refers to the table **dst_fct_SubscriptionCount** and stated that there was a `violation of PRIMARY KEY contstraint 'PK_dst_fct_SubscriptionCount'`.

Then check to see if the error is similar to the following:

```sql
ExecutionID: Failure Code #-4001Source: Load stg_fct_SubscriptionCount SubComponent: 
Backup record before updating [1946] ErrorCode: -1071636471 Description: SSIS Error Code 
DTS_E_OLEDBERROR. An OLE DB error has occurred. Error code: 0x80040E2F.
An OLE DB record is available. Source: "Microsoft SQL Server Native Client 10.0" Hresult: 
0x80040E2F Description: "The statement has been terminated.".
An OLE DB record is available. Source: "Microsoft SQL Server Native Client 10.0" Hresult: 
0x80040E2F Description: "Violation of PRIMARY KEY constraint 
'PK_dst_fct_SubscriptionCount'. Cannot insert duplicate key in object 
'dbo.dst_fct_SubscriptionCount'. The duplicate key value is (428621).".
```

If so, you can take the following steps to rectify.

First, find the key that caused the error.  You will see in the message, `The duplicate key value is (xxxxxx).` 

In the above example the key is actually 428621.

Next you must look that key value up in the **dst_fct_subscriptioncount**.  

```sql
SELECT sucn_SubscriptionKey 
FROM   dst_fct_subscriptioncount 
WHERE  sucn_key = 428621 
```

Next, take the result of the above query and find that subscription record.

```sql
SELECT su_code 
FROM   stg_dim_subscription 
WHERE  su_key = 2377564 
```

The su_code that is return in the above query is what you will need to look for in the **cmDeliverySubscription.asc** file.

Here is the result of what was found in this file:

```
CMPROD|6194617|23735HD1|187540|5913261|ROUTE|08/02/19|31/12/25|187540|187540|187540|187540|187540|187540|187540|5913261|1|1|1|1|1|1|1|ROUTE|ROUTE|ROUTE|ROUTE|ROUTE|ROUTE|ROUTE|23735HD1|23735HD1|23735HD1|23735HD1|23735HD1|23735HD1|23735HD1|

CMPROD|6194617|23704HD1|187540|5913261|ROUTE|03/02/18|31/12/25|187540|0|0|0|0|0|187540|5913261|1|0|0|0|0|0|1|ROUTE||||||ROUTE|23704HD1||||||23704HD1|

CMPROD|6194617|23704HD1|187540|5913261|ROUTE|07/01/17|05/01/18|187540|0|0|0|0|0|187540|5913261|1|0|0|0|0|0|1|ROUTE||||||ROUTE|23704HD1||||||23704HD1|
```

You are just interested in the dates.  This example is from Australia, so the date format is *dd/mm/yyyy*.  What you see is two dates that extend to 2025.  The will overlap.  You will need to remove one and let the site know.  

```
|08/02/19|31/12/25|

|03/02/18|31/12/25|

|07/01/17|05/01/18|
```

