---
id: informer-mappings
title: Informer Mappings
sidebar_label: Informer Mappings
---

## User Reports Mappings

### User Reports vs User Reports Original Rep

The `User Reports` mapping does not have the original rep but they can go to the source record in AD ORDERS or INET.CAMPAIGNS and get the original rep.

When the USER REPORTS trigger was first created it was two files USER_REPORTS_DETAIL (current) and USER_REPORTS_DETAIL_O (original). Then most of our clients complained that they needed something to represent the “Brand Rep” and keep the “current rep” so as of now here is how it looks:

**User Reports** - BRAND REP (the rep with the current assignment on the brand regardless of what is on the order)

**User Reports Original Rep** - CURRENT REP (the current rep assigned on the order which would be the brand rep at the time of order entry and/or if orders were updated because users are given a choice.)  
When the order is created, the Brand rep becomes the "Original Rep", however, the critical question is, when they update the brand rep, they are prompted, **“Do you want to update future orders?”**.  If they answer YES, then the **Current Rep** will become the Brand Rep and will have the same info as the User Reports mapping. Up to that point the Current rep on the order is the same as the original rep and will stay the same unless they say “Yes, update future orders”.  In that case the current rep on future orders changes to the brand rep and the original rep on the order never changes but we have no User Reports that points to the Original rep on the order.
If they change the Brand Rep and **do not say yes to update future orders** then User Reports Original Rep (Current Rep on the order) would then be the same as the Original Rep on the order.

> History on Naming: The way it is at the moment, User Reports will pull the Brand Rep (from the brand record itself), and User Reports Original will pull the current Rep on the order. I know the label is confusing, that is because years ago we had it as the actual current rep and original rep on the order but the demand was to change this instead to Brand rep for User Reports and Current Rep on the order for User Reports Original Rep 

----

### User Reports Revenue Fields

While there are over 80 "AMT" fields in the User Reports mapping.  You most likely will only need one, but I will explain the three that will jump out as being usable.

- **Order Net Amt** - This is the total net amount for the campaign.  The problem with this field is that it will be duplicated for every line item in User Reports for an order.  It can only be used if you add a flow step to remove the duplicates.  [Remove Duplicates Code](./informer-javascript/#remove-duplicate-values-in-aggregation)

- **Rep Net Amt** - This field can be aggregated to get total net revenue for a campaign **ONLY when the Rep Indicator is filtered to 1.**
  To expand on this, there is a field in User Reports called **Rep Indicator**.  This indicator is used to indicate the number of reps on the order.   If you do not filter by the Rep Indicator, your revenue will be overstated for some ads.
  To keep from having to filter on the Rep Indicator, you could also set the Rep Net Amt field to zero for those that have a Rep Indicator not equal to zero.

  ```javascript
  //-----------------------
  // Rep Net Amt Fix
  $record.RepNetAmount = $record.repMv === 1 ? $record.repNetCost : 0
  ```

  I would also suggest removing the original RepNetAmt field from your dataset.

- **Rep Split Net Amt** - This field is the **Rep Net Amt * Salesrep Percentage**.  Note that the aggregation of this at the campaign level is not always the Net amount of the order.  This is because multiple reps may be getting commission or a percentage of the campaign.

### User Report Other Fields

**Product or Website**

The product and website are stored in the same field.  In the User Reports mapping you can get at the Product/Website ID and Product/Website name from a couple of different places.

In the User Reports mapping you can use:

- **Pub Id** - This will be the Product/Website Id
- **Pub Desc** - This will be the Product/Website Description



------



The rest is at the order level:

 REP SPLIT NET AMT field 26  believe it or not is showing the full order amount on the line item.

REP NET AMT is field 41 is the amount based in the rep split percentage.

 

Here is an example of how the data looks on DEVDATA for campaign 5081 line 15160.

![img](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\analytix-docs\docs\assets\informerMapping_temporary006.jpg)

![img](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\analytix-docs\docs\assets\informerMapping_temporary005.jpg)

 

 

Thanks

 

Greg

 

**From:** Mark McCoid <[Mark.McCoid@navigaglobal.com](mailto:Mark.McCoid@navigaglobal.com)> 
 **Sent:** Wednesday, February 10, 2021 12:22 PM
 **To:** Greg Stierley <[greg.stierley@navigaglobal.com](mailto:greg.stierley@navigaglobal.com)>; Jamie Fuller <[Jamie.Fuller@navigaglobal.com](mailto:Jamie.Fuller@navigaglobal.com)>; Wayne Burrows <[wayne.burrows@navigaglobal.com](mailto:wayne.burrows@navigaglobal.com)>
 **Subject:** RE: Data in Informer -- Need some Help

 

Very Helpful!!

 

I’m working with ADN and have an example and just want to make sure I’m understanding correctly.

 

I’m looking at Rep Net Amt, Order Net Amt, and Rep Split Net Amt.

 

**Order Net Amt** contains the Campaign amount total and can only be used if we are very careful about the fields selected and then use the merge duplicates flow step.

 

**Rep Net Amt** can be aggregated to get total net revenue for a campaign ONLY when the Rep Indicator is filtered to 1.

 

**Rep Split Amt** can be used to get net revenue PER rep on order, but I’m not sure if it contains the Order Amt * Rep Percentage. I’m not sure what I’m seeing in this field in the example below.

 

![img](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\analytix-docs\docs\assets\informerMapping_temporary004.jpg)

 

Thanks,

 

 

**From:** Greg Stierley <[greg.stierley@navigaglobal.com](mailto:greg.stierley@navigaglobal.com)> 
 **Sent:** Wednesday, February 10, 2021 2:26 PM
 **To:** Mark McCoid <[Mark.McCoid@navigaglobal.com](mailto:Mark.McCoid@navigaglobal.com)>; Jamie Fuller <[Jamie.Fuller@navigaglobal.com](mailto:Jamie.Fuller@navigaglobal.com)>; Wayne Burrows <[wayne.burrows@navigaglobal.com](mailto:wayne.burrows@navigaglobal.com)>
 **Subject:** RE: Data in Informer -- Need some Help

 

Sure we could do a zoom meeting but I will provide some answers in the meantime.

 

First the original intent of User Reports was to create a normalized version of the nested data within the PBOOKINGS (print order) file by salesrep (also by Edition but rarely used)

 

There are two ways to slice the data, by Salesrep or by Order. You can view the split rep amount or the entire order amount.

 

So if the order has two salesreps then you get two rows in User Reports but some users want to exclude duplicates so in that case we have a flag called “REP_MV” and if you set the criteria, REP_MV = “1” then you won’t get duplicate rows per order# but if your selection criteria includes salesreps you probably wouldn’t want to combine it with REP_MV.

 

See below:

 

**From:** Mark McCoid <[Mark.McCoid@navigaglobal.com](mailto:Mark.McCoid@navigaglobal.com)> 
 **Sent:** Wednesday, February 10, 2021 10:55 AM
 **To:** Greg Stierley <[greg.stierley@navigaglobal.com](mailto:greg.stierley@navigaglobal.com)>; Jamie Fuller <[Jamie.Fuller@navigaglobal.com](mailto:Jamie.Fuller@navigaglobal.com)>; Wayne Burrows <[wayne.burrows@navigaglobal.com](mailto:wayne.burrows@navigaglobal.com)>
 **Subject:** Data in Informer -- Need some Help

 

As I try to create reports for sites, I realize that I really don't understand how the data is “structured” in Naviga Ad. I find it difficult to create a simple simple revenue report, even with 86 "...amt" fields to choose from in Users Reports!

 

So, I have a lot of questions and thought maybe it would be best to write them out and then see if anyone wants to have a zoom meeting to enlighten me!

 

- Revenue/Amt     fields. For 99% of the reports, sites seem to want “Net Revenue”.      What makes this a bit more confusing (and maybe I’m making it more     complicated) is the granularity of the different fields. For example     in the User Reports mapping, is the Order Net Amt at the same granularity     as the Rep Net Amt? And if so, what then is the difference between     these fields? 

User Reports has changed as the application has changed, fields have been added and altered to meet new requirements so there are multiple names for the same attribute (discussed later)

Often times I will audit the data/record just to verify we are going to pull the right field. For example we only used INET.CAMPAIGNS in the past then we added INET.ORDERS instead so the fields were shifted around, but due to legacy systems the old fields are never removed, this does make it quite confusing.


 This also brings up another question, some sites say that for some orders/campaigns multiple reps will be assigned the amount of the order. What does this mean? Is this for commission purposes, so if two reps each get 100%, then aggregating on this field grouping by Campaign ID will overstate the total cost.

Correct, if you base it off of the order amount it will be overstated if they each get 100% unless you either filter rows where REP_MV = 1 or somehow only total on rows where REP_MV = 1.

Normally the split is even 50/50 or 33/33/34 or 25/25/25/25 and you could use the rep split amount which totals the order amount.

- AD Internet Orders vs AD     Internet Campaigns. They both link to each other, so how are they     related? Is one Summary and the other detail?

The Internet Campaign is the source header record with Inet Orders as the line items.

- Digital vs Print - what,     where, how, why? 

Lol… Exactly! Well both are in User Reports but there is a flag on the product which can indicate if it is print only or not.

- Where is the Product     name field? Looks to be the Website

AD Publications mapping, field 4 Pub Desc or Website Name

- When looking for a     field, what are the highlighted numbers below? I’m assuming these     are field numbers, so in the instance of IN Campaign ID and IN Campaign     Line Id, both being 52, does that mean they are the same field but named     differently?

Correct in Unidata we have “Files” which are like a SQL Table/Entity and “dictionaries” which are the “fields/columns”.

Each attribute represents a position in the file which can’t be changed but you could have different dictionaries which interpret the data differently.

For example we could store the date on AR Invoices in attribute 2 but we could create a dictionary showing the raw data and we can show it using a date format with a different dictionary.

![img](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\analytix-docs\docs\assets\informerMapping_temporary003.jpg)

You can see it when we list the data using the dictionary:

![img](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\analytix-docs\docs\assets\informerMapping_temporary002.jpg)


 ![img](C:\Users\mark.mccoid\Documents\AnalytixDevelopment\analytix-docs\docs\assets\informerMapping_temporary.jpg)

- Lastly, Sales     reps. I seem to come across Brand, Current and Original. Greg     has tried to explain how these are represented in User Reports, but I think     I need a better understanding of what exactly each is referring to and how     it is used in the system.

Since I already explained it maybe Wayne can describe it better than I can. 😊

 

 