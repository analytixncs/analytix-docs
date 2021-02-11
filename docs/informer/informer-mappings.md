---
id: informer-mappings
title: Informer Mappings
sidebar_label: Informer Mappings
---

## User Reports vs User Reports Original Rep

The `User Reports` mapping does not have the original rep but they can go to the source record in AD ORDERS or INET.CAMPAIGNS and get the original rep.

When the USER REPORTS trigger was first created it was two files USER_REPORTS_DETAIL (current) and USER_REPORTS_DETAIL_O (original). Then most of our clients complained that they needed something to represent the “Brand Rep” and keep the “current rep” so as of now here is how it looks:

USER_REPORTS_DETAIL à BRAND REP (the rep with the current assignment on the brand regardless of what is on the order)

USER_REPORTS_DETAIL_O à CURRENT REP (the current rep assigned on the order which would be the brand rep at the time of order entry and/or if orders were updated because users are given a choice.)

That leaves no place for the actual Original rep on the order on any User Reports files, it can only be found on the source order files.

It depends on their process.

 

The way it is at the moment, User Reports will pull the Brand Rep (from the brand record itself), and User Reports Original will pull the current Rep on the order. I know the label is confusing, that is because years ago we had it as the actual current rep and original rep on the order but the demand was to change this instead to Brand rep for User Reports and Current Rep on the order for User Reports Original Rep.

 

The critical question is, when they update the brand rep, they are prompted, “Do you want to update future orders?” This creates a fork in the road.

 

Up to that point the Current rep on the order is the same as the original rep and will stay the same unless they say “Yes, update future orders”.

 

In that case the current rep on future orders changes to the brand rep and the original rep on the order never changes but we have no User Reports that points to the Original rep on the order.

 

If they change the Brand Rep and do not update future orders then User Reports Original (Current Rep on the order) maintains the same as the Original Rep so that would work for them I believe.

---

Just to make our heads spin we store reps on the campaign and on the order and to keep things most accurate (or is it?) we point the trigger to the INET.ORDERS salesrep which in this case was 04 Brian Terry.

 

What most likely happened is the person entering the orders might have assigned Brian Terry during order entry so he appears as the original rep and sure enough I see him on the order as the original rep: