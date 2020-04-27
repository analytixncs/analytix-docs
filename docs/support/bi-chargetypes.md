---
id: bi-chargetypes
title: BI ChargeTypes Explained
sidebar_label: BI ChargeTypes Explained
---

[Optional Header]: # "BI ChargeTypes Explained"



##  CHARGETYPE field in fctInsertChargeSummary

- **CREDIT** – Shows only credits that were targeted to an ad or insertion.  These include credits that Invoice Generator created because of a Trans ID in *rtChargeEntryElem* as well as credits is *aoChargeAdjust* (These are credits a user creates to target the GL of the credit to match the revenue GL for order). 

  Also those credits in *aoPrepayment* apply are marked as ChargeType CREDIT.  (The *aoPrepaymentapply* table is where we store the prepayment data for an order.)

- **REV CR** (Revenue Credit) – Shows credits that were “physically” used to “pay” down an order.

  So when viewing CREDIT transactions we are seeing credits that are created and then applied to a specific invoice by the user.

  The REV CR transactions are credits that applied to an invoice to reduce its balance. This can happen through balance utility, ad booker or any other application that applies existing credits to an invoice.

  In Analytix we exclude all REV CR charges because including them will, in some cases, cause double dipping.  This happens when a credit is created and applied to a specific order and that order is already paid.  When this happens, a CREDIT transaction is created in BI and then when that credit is actually applied to pay down an order a REV CR transaction is created.

  So, when we view all CREDIT charge types in BI, we see all credits targeted to specific orders, however we will not ever see credit that were created on a customers account.  These credits will show up as REV CR charge types when they are applied to an order

- **CHARGE** - Indicates that this record is a part of the charge that the rating engine has determined for this ad.

- **DEBIT** - Indicates a Debit that has been applied to this ad.

