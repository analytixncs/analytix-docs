---
id: qlikview-reduce-data
title: Remove Data from Qlikview App
sidebar_label: Remove Data from Qlikview App
---

---

To facilitate moving QVW files, sometimes it is helpful to remove all the data from the QVW application.  This will make the QVW file much smaller and easier to move to a new server or send via email.

To do this, you must first open the QVW file in Qlikview Developer.

## Remove All Values

Qlikview call removing data "Reducing" as we have two options.  The first and most used, is the Remove all option.

Once you have the Qlikview file open, choose **File/Reduce Data/Remove All Values**

![1534339308828](..\assets\QLIKVIEW-ReduceData-1.png)

This remove all the data from the application.  When you save the QVW file, make sure to choose Save As....

If you simply save, it will overwrite the QVW file that your users are accessing and thus they will no data until you reload.  So, just save to a new location and then email or do whatever it is you need to with the smaller file.

## Keep Possible Values

This option can be useful in debugging and/or testing.  What it does, is reduces the amount of data based on what is in your current selections.

For example, if you had the month of May and the year 2018 selected, and the chose **File/Reduce Data/Keep Possible Values**, all data that was not associated with May/2018 would be removed.  

Another way to think about it, any data that was greyed out in the List Boxes would be removed.

