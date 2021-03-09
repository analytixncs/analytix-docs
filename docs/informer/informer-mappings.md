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

> **History on Naming**: The way it is at the moment, User Reports will pull the Brand Rep (from the brand record itself), and User Reports Original will pull the current Rep on the order. I know the label is confusing, that is because years ago we had it as the actual current rep and original rep on the order but the demand was to change this instead to Brand rep for User Reports and Current Rep on the order for User Reports Original Rep 

----

### User Reports Revenue Fields

While there are over 80 "Amt" fields in the User Reports mapping.  You most likely will only need one, but I will explain the three that will jump out as being usable.

- **Order Net Amt** - This is the total net amount for the campaign.  The problem with this field is that it will be duplicated for every line item in User Reports for an order.  If you are going to do any aggregation on the field, you will need to add a flow step to remove the duplicates.  [Remove Duplicates Code](./informer-javascript/#remove-duplicate-values-in-aggregation)

- **Rep Split Net Amt** - This field can be aggregated to get total net revenue for a campaign **ONLY when the Rep Indicator is filtered to 1.**
  To expand on this, there is a field in User Reports called **Rep Indicator(REP_MV)**.  This indicator is used to indicate the number of reps on the order.   If you do not filter by the Rep Indicator, your revenue will be overstated for some ads.
  
  The **Rep Split Net Amt** field is the total net amount for a line within a campaign
  
  To keep from having to filter on the Rep Indicator, you could also set the Rep Net Amt field to zero for those that have a Rep Indicator not equal to zero.
  I would also suggest removing the original RepSplitNetAmt field from your dataset after the above Powerscript has been run.
  
```javascript
  // Rep Split Net Amt Fix
  $record.LineNetAmount = $record.repMv === 1 ? $record.netCost : 0;
  ```
  
- **Rep Net Amt** - This field is the **Rep Split Net Amt * Salesrep Percentage**.  Note that the aggregation of this at the campaign level is not always the Net amount of the order.  This is because multiple reps may be getting commission or a percentage of the campaign.

### User Report Other Fields

**Product or Website Field**

The product and website are stored in the same field.  In the User Reports mapping you can get at the Product/Website ID and Product/Website name from a couple of different places.

In the User Reports mapping you can use:

- **Pub Id** - This will be the Product/Website Id
- **Pub Desc** - This will be the Product/Website Description



------

## AD Internet Campaigns mapping

The AD Internet Campaigns mapping is the at the campaign level.  If you need line item detail, you will need to get that from the AD Internet Orders mapping.

When pulling back records from AD Internet Campaigns, you need to most likely filter on the Status Code (STATUS.CODE, #7).

> NOTE: This is the status at the **Campaign** level.  So, it will be filtering on campaign level status's.  If you are pulling data in from AD Internet Orders also, you will need to also filter on the **Line Cancel Status ID (LINE.CANCEL.STATUS.ID #26)**



## AD Internet Orders mapping

The AD Internet Orders mapping is the detail level of a campaign.  It will hold the individual line items.

Be aware of the difference between the Actual Amt and the Estimated Amt.



Questions:

- **Digital vs Print** - What is the Flag Name? -> User Reports but there is a flag on the product which can indicate if it is print only or not.
- **Product** - Is in the AD Publications mapping, field 4 Pub Desc or Website Name.  How does the Pub Group relate to the Pub/Website?  Is there a default Pub Group that can be assigned?  How do you deal with reporting within Naviga Ad on Pub Group since a single product can exist in multiple Pub Groups?
- Anything to filter like DELETED, etc so revenue is correct



 

 