---
id: analytix-qlik-dev-cookbook
title: Qlikview Developer Cookbook
sidebar_label: Qlikview Developer Cookbook
---

---

This document hopes to be a journal of different techniques that I have used to accomplish tasks within Analytix and Qlikview.

## Loading Spreadsheets with Wildcard / Star is *

First and foremost, the Qlikview option of `star is *` cannot be used with in Section Application, hence it is only useful when using Section Access for security purposes.

Now, the scenario is this, a site wants to create a new field called **Product Cluster** and this field is based on Product and AdType combinations.  The twist is that their spreadsheet looks something like this:

![1560972957229](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\analytix-docs\docs\assets\analytix-cookbook-001.png)

Those blank AdTypes are supposed to mean match all AdTypes for that product and assign the given cluster.

First off, let's change the blanks to '*', to make life easier:

![1560973090763](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\analytix-docs\docs\assets\analytix-cookbook-002.png)

A few things that we need to keep in mind as we build a table for this.

1. If a valid Product/AdType combination exists in the spreadsheet, we do not want to create a duplicate when we "fill in" the '*' fields.
2. In the code below, any Product / AdType combinations from the database, but not called out in the spreadsheet, will be given a "Cluster" value of **UNDEFINED.**
3. I am letting the two fields *ProductName* and *AdTypeCombo* create a synthetic key to be joined, however, you may choose to create a your own, single key to make this join.

This code assumes you have a spreadsheet **ClusterText.xlsx** with fields 

- ProductName
- AdType
- Cluster

```sql
// Need to replace the "UNDEFINED" Cluster name with any that were defined in
// the productcluster spreadsheet 
// Loading only those rows with an * for AdType
// Creating a mapping match field that includes Product concatenated with "-UNDEFINED"
// This will update only those rows that were filled in
UpdateClusterMap:
Mapping LOAD ProductName & '-UNDEFINED' , 
     Cluster
FROM ..\Include\CustomScripts\SalesFlash\Samples\ClusterTest.xlsx
(ooxml, embedded labels, table is Sheet1)
Where AdType = '*';

// Load initial cluster table
// Create "FillJoin" field to be used by NOT Exists clause
// to find Product/AdType combinations that were not defined in ProductCluster table
ProductCluster:
LOAD ProductName as ProductNameCluster, 
     AdType as AdTypeCluster, 
     ProductName & '-' & AdType as FillJoin,
     Cluster
FROM ..\Include\CustomScripts\SalesFlash\Samples\ClusterTest.xlsx
(ooxml, embedded labels, table is Sheet1)
WHERE AdType <> '*';

// Create a table that contains all permutations of Product and AdType that do not exist 
// in the ProductCluster table.
ClusterFill:
LOAD
	ProductName as ProductClusterFill,
	AdTypeCombo as AdTypeClusterFill,
	ApplyMap('UpdateClusterMap', ProductName & '-UNDEFINED', 'UNDEFINED') as ClusterFill
Resident AdProduct
WHERE NOT Exists(FillJoin, ProductName & '-' & AdTypeCombo);

// Concatenate the ProductCluster and ClusterFill tables into a single table
FinalProductCluster:
Load ProductNameCluster as ProductName, 
	AdTypeCluster as AdTypeCombo, 
	Cluster
Resident ProductCluster;
Concatenate
LOAD
	ProductClusterFill as ProductName,
	AdTypeClusterFill as AdTypeCombo,
	ClusterFill as Cluster
Resident ClusterFill;

// Get rid of work tables
Drop table ProductCluster;
Drop Table ClusterFill;
```

