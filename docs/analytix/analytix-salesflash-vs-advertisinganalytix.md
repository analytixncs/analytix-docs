---
id: analytix-salesflash-vs-advertisinganalytix
title: SalesFlash versus AdvertisingAnalytix
sidebar_label: SalesFlash versus AdvertisingAnalytix
---

[Optional Header]: # "SalesFlash versus AdvertisingAnalytix"



## Comparing AdvertisingAnalytix to SalesFlash

When trying to compare revenue numbers from these two applications, there are a few things that you need to understand before you can do this.

SalesFlash contains a combination of Realized (Invoiced) items and Non-Realized (Not invoiced yet) items, while Advertising Analytix contains all booked items regardless of whether they have been invoiced or not.

It would seem that you could compare revenue totals from these two applications on a closed period using the following critiera:

**Sales Flash**

- Date Criteria – Some Closed Period
- Transaction Type – NOT CHARGE

**Advertising Analytix**

- Date Criteria – Some Closed Period
- Invoiced? Flag – TRUE
- Published? Flag – TRUE 

At first glance, you would think that this should give you the same amounts, however it doesn’t.  There are two reasons for this and they deal with order level charges, credits and debits and how BI interacts with them on the advertising side.

First, all order level charges are spread across the order.  For example, if an ad runs for 10 days and has an order level charge of $100, BI will allocate $10 per day (in the advertising tables) by spreading that order level charge across the insertions in an order.  These are the tables that AdvertisingAnalytix uses for all of its revenue information.

This same order on the GL side, will have that $100 order level charge all showing up on one day.  If you were comparing totals for the month of May and this order was to start running on May 30th, your SalesFlash would show the $100 all on May 30th, while AdvertisingAnalytix would show you $10 for May 30th and $10 for May 31st.

When a credit is entered into the AdBase, the user has the option to target the credit to a specific ad OR to put it on account**.  If the credit is targeted, then that credit will be seen on the advertising side.**  However, if the credit is NOT targeted, then one of AdBase’s utilities will apply the credit to ads until the credit is used up.  The advertising side does NOT recognize these credits since they are really just being used as payments.  However the Sales Flash application (pulling from the GL side) will report these as credits.

Another thing to note about Credits and Debits on the advertising side is that they are also spread across the order if they are not attached to a specific insertion.  So while on the GL Side a $100 dollar credit sits on one day, while on the advertising side the $100 credit, if associated with an order, will be spread across that order.

Also, when a credit/debit is targeted to an ad, the BI Populator, on the advertising side, will spread that credit/debit across all insertions in the ad.  Thus if an ad has insertions that lie outside of your date range criteria, you would be missing portions of those credits/debits in your final number.

 

 