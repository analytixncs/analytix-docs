---
id: informer-mappings
title: Informer Mappings
sidebar_label: Informer Mappings
---

# User Reports Mappings

## User Reports vs User Reports Original Rep

The `User Reports` mapping does not have the original rep but they can go to the source record in AD ORDERS or INET.CAMPAIGNS and get the original rep.

When the USER REPORTS trigger was first created it was two files USER_REPORTS_DETAIL (current) and USER_REPORTS_DETAIL_O (original). Then most of our clients complained that they needed something to represent the “Brand Rep” and keep the “current rep” so as of now here is how it looks:

**User Reports** - BRAND REP (the rep with the current assignment on the brand regardless of what is on the order)

**User Reports Original Rep** - CURRENT REP (the current rep assigned on the order which would be the brand rep at the time of order entry and/or if orders were updated because users are given a choice.)  
When the order is created, the Brand rep becomes the "Original Rep", however, the critical question is, when they update the brand rep, they are prompted, **“Do you want to update future orders?”**.  If they answer YES, then the **Current Rep** will become the Brand Rep and will have the same info as the User Reports mapping. Up to that point the Current rep on the order is the same as the original rep and will stay the same unless they say “Yes, update future orders”.  In that case the current rep on future orders changes to the brand rep and the original rep on the order never changes but we have no User Reports that points to the Original rep on the order.
If they change the Brand Rep and **do not say yes to update future orders** then User Reports Original Rep (Current Rep on the order) would then be the same as the Original Rep on the order.

> **History on Naming**: The way it is at the moment, User Reports will pull the Brand Rep (from the brand record itself), and User Reports Original will pull the current Rep on the order. I know the label is confusing, that is because years ago we had it as the actual current rep and original rep on the order but the demand was to change this instead to Brand rep for User Reports and Current Rep on the order for User Reports Original Rep 

----

## User Reports Revenue Fields

While there are over 80 "Amt" fields in the User Reports mapping.  You most likely will only need one, but I will explain the three that will jump out as being usable.

- **Order Net Amt** - This is the total net amount for the campaign.  The problem with this field is that it will be duplicated for every line item in User Reports for an order.  If you are going to do any aggregation on the field, you will need to add a flow step to remove the duplicates.  [Remove Duplicates Code](./informer-javascript/#remove-duplicate-values-in-aggregation)

  > Be aware that to use the above field, you will need to Sort your Dataset using the **Order By** step when building the "query".  This can slow the query down.  I don't feel you really will ever or should ever use the Order Net Amt. 
  > Instead, if you just need net amount for campaigns, use the Rep Split Net Amt field fix below.

  

- **Rep Split Net Amt** - This field can be aggregated to get total net revenue for a campaign **ONLY when the Rep Indicator is filtered to 1.**
  To expand on this, there is a field in User Reports called **Rep Indicator(REP_MV)**.  This indicator is used to indicate the number of reps on the order.   If you do not filter by the Rep Indicator, your revenue will be overstated for some ads.
  
  The **Rep Split Net Amt** field is the total net amount for a line within a campaign
  
  To keep from having to filter on the Rep Indicator, you could also set the Rep Net Amt field to zero for those that have a Rep Indicator not equal to zero.
  I would also suggest removing the original RepSplitNetAmt field from your dataset after the above Powerscript has been run.
```javascript
  // Rep Split Net Amt Fix
  $record.LineNetAmount = $record.repMv === 1 ? $record.netCost : 0;
```

- **Rep Net Amt** - This field IS the **Rep Split Net Amt * Salesrep Percentage**.  Note that the aggregation of this at the campaign level is not always the Net amount of the order.  This is because multiple reps may be getting commission or a percentage of the campaign.

## User Report NEEDED Status Criteria

Most of the time when you are creating a report to get revenue, you **DO NOT** want to include deleted lines.  To ensure this, you will need to add the following criteria to only pull the following **Status** field values

The **Status** field is located in the **User Reports** mapping and you will want to exactly match the following:

- **EX** - Billed
- **RU** - Confirmed
- **IS** - Invoicing Started

The filter will look like this:

![image-20210401095638103](..\assets\informer-mapping-userreports-001.png)



## User Report Other Fields

### Product or Website Field

The product and website are stored in the same field.  In the User Reports mapping you can get at the Product/Website ID and Product/Website name from a couple of different places.

In the User Reports mapping you can use:

- **Pub Id** - This will be the Product/Website Id
- **Pub Desc** - This will be the Product/Website Description

### Classified Category Tree and Classified Category

These fields exist in the **AD Internet Classified** mapping but are NOT linked to anything.  However, the individual fields *Category Tree* and *Category* exist on the **AD Internet Orders** mapping.  You can pull these fields in from this mapping and in from the **User Reports** mapping you would get to it by going to the **Internet Order (newer Elan releases)**, which is just the **AD Internet Orders** mapping renamed for this link.

![image-20210525153827370](..\assets\informer-mapping-userreports-002.png)

The above two fields come from the following on the Line Item Detail:

![image-20210525154031808](..\assets\informer-mapping-userreports-003.png)

## User Report Print vs Digital

To determine if a campaign is either Print or Digital, you can use the field **Inet Print Pub Ind** in the User Reports mapping.

If this field is Y, then the campaign is Print, if N, then the campaign is Digital.

You can use this piece of code in a Powerscript to convert the Y or N to Print or Digital

```javascript
PrintDigitalConvert = {
    Y: 'Print',
    N: 'Digital'
}
$record.PrintOrDigital = PrintDigitalConvert[$record.inetPrintPubInd] || 'Not Defined'
```





------

# AD Internet Campaigns mapping

The AD Internet Campaigns mapping is the at the campaign level.  If you need line item detail, you will need to get that from the AD Internet Orders mapping.

When pulling back records from AD Internet Campaigns, you need to most likely filter on the Status Code (STATUS.CODE, #7).

> NOTE: This is the status at the **Campaign** level.  So, it will be filtering on campaign level status's.  If you are pulling data in from AD Internet Orders also, you will need to also filter on the **Line Cancel Status ID (LINE.CANCEL.STATUS.ID #26)**

# AD Internet Orders mapping

The AD Internet Orders mapping is the detail level of a campaign.  It will hold the individual line items.

**AD Internet Campaigns** hold the summary data and then links to the **AD Internet Orders** mapping for the detail about the lines and reps.

Given that most of the reports that you write that pull data for Orders will want the detail level information found in **Ad Internet Orders**, it is recommended that you start with the AD Internet Orders mapping. 

## Filtering

When pulling data from the **AD Internet Orders** mapping, realize that Deleted Lines and potentially unwanted Campaign Status's will be included in your results.  Since most reports do not want this information, you will want to add criteria to filter this information out.

Here is a common set of Criteria for a report from the **AD Internet Orders** mapping:

![image-20210511150211401](..\assets\informer-mapping-adinternetorders-001.png)

The first is the Status Code on the Campaign.  It is found in the **AD Internet Campaigns** mapping and is called **Status Code**

![image-20210511150424446](..\assets\informer-mapping-adinternetorders-002.png)

The second field, **Line Cancel Status ID**, makes sure that no Deleted Lines are included in your results.  It is located on the **AD Internet Orders** mapping.

![image-20210511150826980](..\assets\informer-mapping-adinternetorders-003.png)

## Multivalued Fields

You will notice in this mapping that there are a number of Multivalued fields.  Even though we are at the Line level in the **AD Internet Orders** mappings, you will still see multivalued fields.  One of these fields that we will use for Revenue is the **Month Period** field.  Why would a single line within a Campaign have multiple Month Period fields?  

First, the Month Period field is the Month/Period and Year (MM-YYYY) that this line is to be recognized as revenue in.

When you view a line in Naviga Ad, you see that a single line can extend across multiple months.  If you want to see this information by month, then you will have to deal with the multivalued fields for this breakout.  In particular the fields are:

- Month Period
- Month Start
- Month End
- Month Est Amt
- Month Act Amt

This is what a Line in a Campaign looks like in Naviga Ad. Notice that it has further detail showing the billing amount for each month.  The values above correspond to each of these value in Naviga Ad.

![img](..\assets\informer-mapping-adinternetorders-004.png)

The bit of difficulty is that these fields are stored in a Multivalued field.  A weird concept if you are coming from a relational background, however, all it means, is that, in the example above, there will be three values stored in each of the MV fields mentioned.  

A multivalued field in Informer usually is not in a format that is usable and thus you will need to run a flow step in your report to "Normalize" it.

This is what a report pulling these multivalued fields would look like without Normalization:

![image-20210511153122760](..\assets\informer-mapping-adinternetorders-005.png)

The problem with the above format is two fold, first it is hard to reason about, since we are used to seeing a full row of data.  Secondly, you cannot filter on the MV fields.

Given this, the normal course of action when we have MV fields in our report is to normalize the MV fields.  This can be done with the **Normalize** flow step.  

After Normalizing, the above data will now look like this:

![image-20210511161333417](..\assets\informer-mapping-adinternetorders-006.png)

## Amount Fields

There are a lot of Amount fields in the **AD Internet Orders** mapping.  We will focus on the Month Actual/Est Amt fields and the **Line Price Amt** fields in this document. 

**Line Price Amt**

If you do not need to know the Line Item monthly breakout of revenue, then you can simply use the **Line Price Amt**.  Just be aware that if you include any multivalued fields and normalize on them, the **Line Price Amt** field will be duplicated over those normalized items.

## Month Actual / Est Amt

The **Month Actual and Est Amt** multivalued fields have some special rules that need to be followed to get the correct information from a report written using them.

These rules can only be applied via a PowerScript Flow step.

Here are the rules:

- **Flexible Campaigns** - If the line is part of a flexible campaign, then you will **only** use the **Month Est Amt**
- **Other Types of Campaigns** - If the line is not part of a flexible campaign, then we need to determine whether to use the Actual or Estimated amount field.  You will simply choose the Estimated amount if the Actual amount field is zero or empty.

Here is a Powerscript excerpt that embodies the above rules and creates a single revenue field called **NetAmount**:

```javascript
// Calculated the Net Revenue Amount field
if ($record.a_d_internet_campaigns_assoc_campaignType === 'F') {
	$record.NetAmount = $record.monthEstAmt
} else {
	$record.NetAmount = ($record.monthActualAmt === 0 || !$record.monthActualAmt) ? $record.monthEstAmt : $record.monthActualAmt;    
}
```

> NOTE: The above code references the following fields:
>
> - **$record.a_d_internet_campaigns_assoc_campaignType** - This is the Campaign Type from the **AD Internet Campaign** mapping
> - **$record.monthEstAmt** - This is the Month Est Amt from the **AD Internet Orders** mapping
> - **$record.monthActualAmt** - This is the Month Actual Amt from the **AD Internet Orders** mapping
>
> The above code assumes the base mapping is **AD Internet Orders**.  If not, the field reference name may be different.





Questions:

- **Digital vs Print** - What is the Flag Name? -> User Reports but there is a flag on the product which can indicate if it is print only or not.
- **Product** - Is in the AD Publications mapping, field 4 Pub Desc or Website Name.  How does the Pub Group relate to the Pub/Website?  Is there a default Pub Group that can be assigned?  How do you deal with reporting within Naviga Ad on Pub Group since a single product can exist in multiple Pub Groups?
- Anything to filter like DELETED, etc so revenue is correct



 

 