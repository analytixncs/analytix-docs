---
id: sql-bi-common-queries
title: Common BI Queries
sidebar_label: Common BI Queries
---

- [SalesFlash Not Invoiced Rules](#salesflash-not-invoiced-rules)
- [SalesComm Rep](#salescomm-rep)
- [Schedule Ids and SalesComm Rep](#schedule-ids-and-salescomm-rep)
- [fctGL Simple Query](#fctgl-simple-query)
- [Contract Tables Query](#contract-tables-query)
- [shApp Settings](#shapp-settings)
- [GL Number From AdOrderNumber](#gl-number-from-adordernumber)
- [Agency or Parent Relationship](#agency-or-parent-relationship)
- [Rate Information From dmRate](#rate-information-from-dmrate)
- [Client Location (Address)](#client-location-(address))
- [BridgeMultiClient Query](#bridgemulticlient-query)



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

## SalesComm Rep

> Limited By: **fad.adordernumber**

```sql
SELECT fad.adordernumber,
       fsc.adorderid_adbase,
       u.userloginname,
       fsc.*
FROM   fctsalescomm fsc,
       dmuser u,
       fctadorder fad
WHERE  fad.adorderid_adbase = fsc.adorderid_adbase
       AND fsc.salesrep_user_id = u.id
       AND fad.adordernumber = '0000000000'
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



---

## shApp Settings

While this needs to be run on the **Core** database, it is used find out which users have run the BI Populator.

The programid of 127 indicates the BI Populator.

```sql
SELECT DISTINCT s.userid, 
                u.loginname 
FROM   shappsettings s, 
       usrusers u 
WHERE  programid = 127 
       AND s.userid = u.userid 
```



---

## GL Number From AdOrderNumber

Returns GL Information for a given Ad Order Number.

> Limited by: **fad.adordernumber**

```sql
SELECT g.glnumber             AS BI_GLNumber, 
       g.glname               AS BI_GLName, 
       fad.adordernumber      AS BI_ADORDERNUMBER, 
       fad.adorderid_adbase   AS BI_AdOrderID, 
       f.runscheduleid_adbase AS BI_RunScheduleID, 
       g.id                   AS BI_GLAccountID 
FROM   fctinsertion f, 
       fctinsertchargesummary fs, 
       fctadorder fad, 
       fctinsertchargedetail fd, 
       dmglaccounts g 
WHERE  f.id = fs.insertion_id 
       AND fad.id = f.fctadorder_id 
       AND fs.id = fd.insertchargesummary_id 
       AND fd.glaccounts_id = g.id 
       AND fad.adordernumber = '0000000000' 
```



---

## Agency or Parent Relationship

> Limited by: **accountnumber_adbase**

### Agency/Client 

```sql
SELECT
  c.namelast_bsn,
  c.accountnumber_adbase,
  r.*
FROM dmrelationshipagency r,
  dmclient c
WHERE r.client_client_id = c.id
      AND agency_client_id = (SELECT id
                          FROM dmclient
                          WHERE accountnumber_adbase = '000000')
```

### Parent/Child

```sql
SELECT
  c.namelast_bsn,
  c.accountnumber_adbase,
  r.*
FROM dmrelationshipparent r,
  dmclient c
WHERE r.CHILD_CLIENT_ID= c.id
      AND parent_client_id = (SELECT id
                          FROM dmclient
                          WHERE accountnumber_adbase = '3218887650')
```



---

## Rate Information From dmRate

> Limited by: **adordernumber**

```sql
SELECT fctinsertchargedetail.rtchargeid_adbase AS RTCHARGEID, 
       fctadorder.adordernumber, 
       dmdate.calendardate                     AS EFFECTIVEDATE, 
       dmrateinfo.ratename, 
       dmrateinfo.taxschedulename 
FROM   fctadorder, 
       fctinsertion, 
       fctinsertchargesummary, 
       fctinsertchargedetail, 
       dmrateinfo, 
       dmdate 
WHERE  fctadorder.id = fctinsertion.fctadorder_id 
       AND fctinsertion.id = fctinsertchargesummary.insertion_id 
       AND fctinsertchargesummary.id = 
           fctinsertchargedetail.insertchargesummary_id 
       AND fctinsertchargedetail.rateinfo_id = dmrateinfo.id 
       AND fctinsertion.insert_date_id = dmdate.id 
       AND fctadorder.adordernumber = '00000000000'; 
```



---

## Client Location (Address)

In BI, the dmClient is only linked to an address through the following tables:

- **FCTADORDER** - Using 
  - PrimaryOrderer_Client_id/Location_id
  - PrimaryPayer_Client_id/Location_id
- **FCTINSERTION** - Using
  - PrimaryOrderer_Client_id/Location_id
  - PrimaryPayer_Client_id/Location_id
- **FCTARSUMMARY** - Using
  - AROrderer_Client_id/Location_id
  - ARPayer_Client_id/Location_id
- **FCTGL** - Using
  - Client_id/Location_id

The example below gets the PrimaryOrderer's location by going through the fctAdOrder table.  This could return multiple address for a customer if they have ads linked to an old address and ads linked to a new address.

> Limited by: **accountnumber_adbase**

```sql
SELECT DISTINCT c.accountnumber_adbase, 
                c.namelast_bsn, 
                l.address1, 
                l.* 
FROM   fctadorder f, 
       dmclient c, 
       dmlocation l 
WHERE  f.primaryorderer_client_id = c.id 
       AND f.primaryorderer_location_id = l.id 
       AND c.accountnumber_adbase = '' 
```

### fctClientCoverage Option

The direct way (but rarely used way) is to link through the fctClientCoverage table.  If you only want the current address, look for ccovercurrentrecord_Flag = 'TRUE'.

>  Limited by: **accountnumber_adbase**

```sql
SELECT c.accountnumber_adbase, 
       c.namelast_bsn, 
       l.address1, 
FROM   fctclientcoverage cc, 
       dmclient c, 
       dmlocation l 
WHERE  cc.client_id = c.id 
       AND cc.location_id = l.id 
       AND cc.ccovercurrentrecord_flag = 'TRUE' 
       AND c.accountnumber_adbase = '' 
```

## BridgeMultiClient Query

There are a number of Bridge tables in the BI Database.  Every Bridge table has a corresponding Group table, however the Group table is only used so the database can enforce referential integrity through foreign keys. 

When querying the data, we do not need to use the Group tables, simply bypass them and link directly to the Bridge table.

For the BridgeMultiClient, you would like directly from 
**fctInsertion.groupMultiClient_id** to **bridgeMultiClient.groupMultiClient_id**

> Limited by: adorderid_adbase

```sql
SELECT fin.adorderid_adbase, 
       b.advertisertype, 
       c.accountnumber_adbase, 
       c.namelast_bsn, 
       b.* 
FROM   fctinsertion fin, 
       bridgemulticlient b, 
       dmclient c 
WHERE  fin.groupmulticlient_id = b.groupmulticlient_id 
       AND b.client_id = c.id 
       AND fin.adorderid_adbase = 000
```

