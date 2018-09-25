---
id: analytix-bi-overview
title: Analytix and BI Overview
sidebar_label: Analytix and BI Overview
---

##  Background

The BI database is a dimensional model based on the data in the *Core* database.  When referring to the *Core* database, I'm talking about the transactional database that is behind all of **Adbase**.  

When you book an ad in **AdBooker**, it is stored in the *Core* database.  When you invoice a series of ads, the data for the ads to invoice *and* the results of the invoicing come from and are stored in the *Core* database.

A transactional database is setup to be normalized and verbose for performance and data requirement reasons.  However, using a transactional database for reporting can be a tedious task.  The *BI* database was created to make this task easier.

The *BI* database is based on the dimensional model.    In contrast to a transactional database, a dimensional database is set up to be denormalized and is often referred to as a star schema.

This type of schema eases report creation in a number of ways.

1. Reduce the number of fields in the data model to only those needed to create reports.
2. Increase clarity of the data model with clear naming and data joins.
3. Reduce the need for outer joins with the structure of the database.

The best way to get a handle on the BI database design is to view an ERD (Entity Relationship Diagram) of the data model.

| Entity Relationship Diagram of BI DB                         | Excel Version of BI Database Tables                          |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [BI ERD PDF](../assets/downloads/BISchema-2016-1_20160729.pdf) | [BI ERD Spreadsheet](../assets/downloads/AdBase_Schema_v2016-1(273).xlsx) |

---

## Population of BI And Analytix

The **BI Database** is populated via a tool called the BI Populator and BI Interface app.  Both of these applications will be running on a background server. 

They ensure that the BI database is up to date with the core database.  They usually run every 10-30 minutes, so that your BI database will not be more than 30 minutes behind the Core database.

**Analytix**, however, is usually reloaded once a day as it is not intended to be a real time reporting tool.  With that said, each site may choose to refresh their Analytix data as often as their load times allow.  Each site's Analytix reload is dependent upon their size and can take between 10 minutes to 2 hours for a very large site.

Be aware that the data in Analytix is pulled from the BI Database.  Thus, the accuracy of Analytix is dependent upon the accuracy of the BI Database.  We have created two applications that help ensure the BI Database is in sync with the Core database.  Please familiarize yourself with these tools by reading the [BI Auditors Guide](../bi/bi-auditors)

## Next Steps

The BI database and BI Population applications will be installed and configured during your initial setup.  If you have purchased Analytix, it too should be installed on a separate server.  You can the installation instructions in the [Analytix Installation](./analytix-install).

Once installed, there are a number of site specific configurations you can change and/or update.  You can read more about these in the [Analytix Administrators Guide](analytix-admin-guide)

----

## Links

[Analytix Installation](./analytix-install)

[Analytix Administrators Guide](analytix-admin-guide)

[BI Auditors](../bi/bi-auditors)



