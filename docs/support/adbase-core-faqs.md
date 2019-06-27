---
id: adbase-core-faqs
title: Adbase Core FAQS
sidebar_label: Adbase Core FAQS
---



## aoAdContent.NumLines vs AdBooker Line Depth

When you see an Ad in Ad Booker, sometimes the depth will be represented as "Li"

![1561491615368](..\assets\adbase-core-001.png)

However, when you query the **aoAdContent** table, you will find a field called NumLines and it will not match what is in AdBooker.

The Depth field in AdBooker, when displaying the depth as Li units, is Agate Lines.  Agate lines represent the depth of the ad physically.  For example, if an ad had a depth of  **8248 twips**, that would be equal to **5.73 inches** and then Adbase will calculated and display that depth in Agate Lines based on how your site has defined the Agate lines.

How the Agate lines are defined will be found in Product Define.  Either in ***Setup/Column Definition*** or ***Setup/Adtype Template***.  

You can tell which Adtype Template is being used by looking under ***Setup/Adtypes***

To calculate the AdBooker Depth in lines use the following **(as always, test the formula for accuracy with your system setup)**:

> NOTE: The result from the equation below will be rounded up, just like a *Ceiling* function in Excel.
>
> 5.02 would round to 6
>
> 5.6 would round to 6
>
> etc.

```mathematica
(AdDepthInTwips/20)/AgateFactor
```

> Keep in mind that there are two places that the agate factor can come from.
>
> If you have values in both **AoColumnDef.AgateLineDef** and one of the field from **AoAdTypeDefinition &#129106;** AgateLineSize1, AgateLineSize2, or AgateLineSize3 (depending on the min/max values there), the **AoAdTypeDefinition** will take precedence. 
>
> Sometimes a site will have a common column definition linked to multiple Ad Types, but they want the measurement of the Ad Depth to be different, so the Ad Type’s agate line factor overrides the column definition. 

**aoAdContent.NumLines** represents the total number of "rows" with content on it, regardless of how large the font is.  Also, graphics get 1 line.  See the below ad, it has `aoAdContent.NumLines = 7`

![img](..\assets\adbase-core-002.png)