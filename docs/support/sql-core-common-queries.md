---
id: sql-core-common-queries
title: Common Core Queries
sidebar_label: Common Core Queries
---

- [Core Credits](#core-credits)
- [fnTransactions Joins](#fntransactions-joins)
- [SalesComm Reps](#salescomm-reps)
- [UsrUsers Reps](#usrusers-reps)
- [Contract Customers](#contract-customers)



---

Most of these queries have `where` statements which allow you to limit the query by some field.  While these are pretty obvious to find, they will be show in the following way:

> Limited By: **field limited by**

---

## Core Credits

```sql
SELECT crdb.*, 
       crdb.amount, 
       crdb.transtype, 
       crdb.deleted, 
       custcd.* 
FROM   aocreditdebit crdb, 
       aocustomercd custcd 
WHERE  crdb.id = custcd.transid 
       AND crdb.transtype = 3 
       AND crdb.deleted = 0 
       AND crdb.amount < 0 
```



---

## fnTransactions Joins

> Limited By: **transnum**

```sql
SELECT f.* 
FROM   fntransactions f, 
       fntranslines fl, 
       fntranslinedist fd, 
       fntranslinedstdetail fdd 
WHERE  f.id = fl.ownerid 
       AND fl.id = fd.ownerid 
       AND fd.id = fdd.ownerid 
       AND transnum = '' 
```





---

## SalesComm Reps

> Limited By: **adorderid**

```sql
SELECT u.loginname AS SalesCommRep, 
       sc.* 
FROM   aoinsertionsalescomm sc, 
       usrusers u 
WHERE  adorderid = '' 
       AND sc.salesrepid = u.userid 
```





---

## UsrUsers Reps

> Limited By: **accountid** from customer table

```sql
SELECT u.loginname, 
       st.teamname, 
       c.* 
FROM   customer c, 
       usrusers u, 
       salesteamname st 
WHERE  c.accountid =  
       -- (select accountid from customer where accountnumber = '416191') 
       AND c.primarysalespersonid = u.userid 
       AND u.salesteamnameid = st.salesteamid 
```



---

## Contract Customers

This report  will give the contract/contracts a customer is on and also the last date the contract instance was used.

> Limited By: **Customer_PAY.accountnumber** - the customer marked as Payer on contract

```sql
SELECT cocustomeracctentry.id             AS CoCustomerAcctEntryId, 
       cocustomeracctentry.ownerid        AS InstanceID, 
       Customer_PAY.accountnumber         AS Payor_AccountNumber, 
       Customer_PAY.name1                 AS Payor_Name1, 
       Customer_ADV.accountnumber         AS Adv_AccountNumber, 
       Customer_ADV.name1                 AS Adv_Name1, 
       UsrUsers_PAY.loginname             AS Payor_Primary_Rep, 
       UsrUsers_ADV.loginname             AS Adv_Primary_Rep, 
       SalesTeamName_PAY.teamname         AS Payor_SalesTeam, 
       SalesTeamName_ADV.teamname         AS Adv_SalesTeam, 
       SalesRegionName_PAY.regionname     AS Payor_Region, 
       SalesRegionName_ADV.regionname     AS Adv_Region, 
       Max(coorderratereceived.daterated) AS LastUsed 
FROM   cocustomeracctentry CoCustomerAcctEntry 
       LEFT OUTER JOIN customeraccnumber CustomerAccNumber_PAY 
                    ON cocustomeracctentry.payoracctid = 
                       CustomerAccNumber_PAY.id 
       LEFT OUTER JOIN customeraccnumber CustomerAccNumber_ADV 
                    ON cocustomeracctentry.ordereracctid = 
                       CustomerAccNumber_ADV.id 
       LEFT OUTER JOIN customer Customer_PAY 
                    ON CustomerAccNumber_PAY.custaccnumberaccid = 
                       Customer_PAY.accountid 
       LEFT OUTER JOIN usrusers UsrUsers_PAY 
                    ON Customer_PAY.primarysalespersonid = UsrUsers_PAY.userid 
       LEFT OUTER JOIN salesteamname SalesTeamName_PAY 
                    ON UsrUsers_PAY.salesteamnameid = 
                       SalesTeamName_PAY.salesteamid 
       LEFT OUTER JOIN salesregionname SalesRegionName_PAY 
                    ON UsrUsers_PAY.salesregionid = 
                       SalesRegionName_PAY.salesregionnameid 
       LEFT OUTER JOIN customer Customer_ADV 
                    ON CustomerAccNumber_ADV.custaccnumberaccid = 
                       Customer_ADV.accountid 
       LEFT OUTER JOIN usrusers UsrUsers_ADV 
                    ON Customer_ADV.primarysalespersonid = UsrUsers_ADV.userid 
       LEFT OUTER JOIN salesteamname SalesTeamName_ADV 
                    ON UsrUsers_ADV.salesteamnameid = 
                       SalesTeamName_ADV.salesteamid 
       LEFT OUTER JOIN salesregionname SalesRegionName_ADV 
                    ON UsrUsers_ADV.salesregionid = 
                       SalesRegionName_ADV.salesregionnameid 
       LEFT OUTER JOIN coorderratereceived CoOrderRateReceived 
                    ON cocustomeracctentry.ownerid = 
                       coorderratereceived.contractinstanceid 
WHERE  Customer_PAY.accountnumber = ''                        
GROUP  BY cocustomeracctentry.id, 
          cocustomeracctentry.ownerid, 
          Customer_PAY.accountnumber, 
          Customer_PAY.name1, 
          Customer_ADV.accountnumber, 
          Customer_ADV.name1, 
          UsrUsers_PAY.loginname, 
          UsrUsers_ADV.loginname, 
          SalesTeamName_PAY.teamname, 
          SalesTeamName_ADV.teamname, 
          SalesRegionName_PAY.regionname, 
          SalesRegionName_ADV.regionname 
```



---

## Aging Tables

> Limited by: **accountid** 

```sql
SELECT ao.*, 
       ad.* --sum(ad.Bucket1Amount) 
FROM   agingdetail ad, 
       agingcustomer ac, 
       agingoptions ao 
WHERE  ac.accountid = 
       AND ad.agingcustomerid = ac.id 
       AND ac.agingoptionsid = ao.id 
--	   AND ao.agingdate = '03-13-2018' 
--	   AND ad.companyid = 23 
```

