---
id: sql-bi-common-queries
title: Common BI Queries
sidebar_label: Common BI Queries
---

- [SalesFlash Not Invoiced Rules](#salesflash-not-invoiced-rules)
- [Schedule Ids and SalesComm Rep](#schedule-ids-and-salescomm-rep)
- [fctGL Simple Query](#fctgl-simple-query)
- [Contract Tables Query](#contract-tables-query)



---

Most of these queries have `where` statements which allow you to limit the query by some field.  While these are pretty obvious to find, they will be show in the following way:

> Limited By: **field limited by**

---

## SalesFlash Not Invoiced Rules

This query will return the fields that QVD_ALL's Combined Revenue build uses to determine which ads are considered not invoiced.

You can use this query to verify that an ad should not be in Sales Flash.  

>**Not Invoiced Ad Rules**
>
>dmAdOrderBools.DoNotBill_Flag = 'FALSE'
>
>(dmAdOrderBools.Quote_Flag = 'FALSE' OR QuoteToOrder_Flag = 'TRUE')
>
>dmAdInsertBools.isPublished_Flag = 'TRUE'
>
>fctInsertChargeSummary.ChargeType = 'CHARGE'
>
>fctInsertChargeDetail.InvoicedAlready_Flag = 'FALSE'

> Limited By: **fad.adordernumber**

```sql
SELECT fadbool.donotbill_flag, 
       fadbool.quote_flag, 
       fadbool.quotetoorder_flag, 
       fs.chargetype, 
       fd.invoicedalready_flag, 
       finbool.ispublished_flag 
FROM   fctadorder fad, 
       fctinsertion fin, 
       fctinsertchargesummary fs, 
       fctinsertchargedetail fd, 
       dmadorderbools fadbool, 
       dmadinsertbools finbool 
WHERE  fad.id = fin.fctadorder_id 
       AND fin.id = fs.insertion_id 
       AND fs.id = fd.insertchargesummary_id 
       AND fad.adorderbools_id = fadbool.id 
       AND fin.adinsertbools_id = finbool.id 
       AND fad.adordernumber = '0000000000'; 
```

---

## Schedule Ids and SalesComm Rep

This query is useful when you want to see the Soldby as well as the SalesComm reps.  It also shows the types of Schedules and their Ids.

> NOTE: Be aware that fctSalesComm rep has a many to many relationship with fctInsertion.

>Limited By: **fad.adordernumber**

```sql
--------------------------------------------------------------------------
--Returns a Schedule ID, Schedule type, fctInsertion.ID, InsertDate
--SoldBy Rep and SalesComm Rep
--For a more Compact View, comment out the following:
--InsertionID and InsertDate in the SELECT statement
--The Order By clause
--then add a Distinct to the SELECT statement
--------------------------------------------------------------------------
SELECT
  fad.AdOrderID_Adbase,
  fad.AdOrderNumber,
  fin.ID as InsertionID,
  iDate.CalendarDate as InsertDate,
  CASE WHEN fin.RUNSCHEDULEID_ADBASE > 0 THEN fin.RUNSCHEDULEID_ADBASE
       WHEN fin.FLIGHTSCHEDULEID_ADBASE > 0 THEN fin.FLIGHTSCHEDULEID_ADBASE
       WHEN fin.PRPSCHEDULEID_ADBASE > 0 THEN fin.PRPSCHEDULEID_ADBASE
       ELSE 0 END
    AS ScheduleID,
  CASE WHEN fin.RUNSCHEDULEID_ADBASE > 0 THEN 'RunSchedule'
       WHEN fin.FLIGHTSCHEDULEID_ADBASE > 0 THEN 'FlightSchedule'
       WHEN fin.PRPSCHEDULEID_ADBASE > 0 THEN 'PreprintSchedule'
       ELSE 'OtherSchedule' END
    AS ScheduleType,
  sbUser.USERLOGINNAME AS SoldByRep,
  scUser.USERLOGINNAME AS SalesCommRep
FROM fctAdorder fad INNER JOIN fctInsertion fin ON fad.id = fin.fctadorder_id
  INNER JOIN DMUSER sbUser ON fin.COMMISSIONEDREP_USER_ID = sbUser.ID
  INNER JOIN dmdate iDate ON fin.INSERT_DATE_ID = iDate.ID
  LEFT JOIN fctSalesComm sc ON fin.ID = sc.INSERTION_ID
  LEFT JOIN DMUSER scUser ON sc.SALESREP_USER_ID = scUser.ID
WHERE fad.adordernumber = '0000000000'
ORDER BY iDate.CALENDARDATE;
```

---

## fctGL Simple Query

This is a simple query that shows commonly used columns in fctGL as used by Analytix.  It is multiplying the transamount by -1 and only including glType of 0.

> Limited By: **adordernumber**

```sql
SELECT g.transamount * -1 AS TRANSAMOUNT, 
       g.runscheduleid_adbase, 
       g.prpscheduleid_adbase, 
       g.flightscheduleid_adbase, 
       g.transactionnumber, 
       g.adproduct_id, 
       g.lastpopulatedate, 
       g.gllineitemid_adbase, 
       '------->'         AS [ALL COLUMNS], 
       g.* 
FROM   fctarsummary far, 
       fctgl g 
WHERE  far.id = g.arsummary_id 
       AND g.gltype = 0 
       AND adordernumber = '000000000' 
```

---

## Contract Tables Query

Query showing the joins between the common BI Contract tables.

```sql
SELECT ordererClient.id AS OrdererClient, 
       ordererClient.namelast_bsn, 
       '----->'         AS fctContractFields, 
       fc.*, 
       cd.instancename, 
       '----->'         AS fctContractFulFillmentFields, 
       fcf.* 
FROM   fctcontract fc 
       INNER JOIN dmcontractdetails cd 
               ON fc.contractdetails_id = cd.id 
       LEFT OUTER JOIN fctcontractfulfillment fcf 
                    ON fcf.contractdetails_id = cd.id 
       INNER JOIN bridgecontractclient bcc 
               ON bcc.groupcontractclient_id = fc.groupcontractclient_id 
       INNER JOIN dmclient ordererClient 
               ON ordererClient.id = bcc.ordererclient_id 
WHERE  ordererClient.accountnumber_adbase = '000000' 
```

