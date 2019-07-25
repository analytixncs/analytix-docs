---
id: bi-faq
title: BI FAQ
sidebar_label: BI FAQ
---

- [BI Populator Command Line Arguments](#bi-populator-command-line-arguments)
- [dmUser SysAdmin Setting](#dmuser-sysadmin-setting)
- [Spread Logic may Cause Large Spread Amount](#spread-logic-may-cause-large-spread-amount)
- [BI Populator Object Id Filter Mapping](#bi-populator-object-id-filter-mapping)
- [shBIInterface Table Codes](#shbiinterface-table-codes)

## BI Populator Command Line Arguments

The following command line arguments may be used to run the BI Populator from the command line prompt or to schedule the BI Populator to run using Schedule Admin. 

In the table, parameters are enclosed to indicate information that needs to be supplied by the user. When entering the actual parameter (e.g., the user name), do not use the <> symbols. For example, to enter the user name and password for a particular user and schedule an automatic run, you would type the following.

`-U username -P password –auto –date 01/01/2006`

| Argument <div style="width:175px"></div> | Description                                                  |
| :--------------------------------------- | ------------------------------------------------------------ |
| -U \<username\>                          | Identifies the user for automatic login. Enter the AdBase User name to login. |
| -P \<password\>                          | Provides the password for automatic login. Enter the AdBase password to login. |
| -auto                                    | Runs the BI Populator in automatic mode. This means that the BI Populator executes automatically without a user having to click the Populate button. Once processing is complete, the BI Populator will automatically exit. This argument is primarily for use in Schedule Admin. |
| -continuous                              | Runs the BI Populator in automatic mode. This means that the BI Populator executes automatically without a user having to click the Populate button. Unlike the -auto argument, once the process is complete, the BI Populator continues to |
| -date \<start date\>                     | Specifies the start date in the absolute date format (mm/dd/yyyy). |
| -D \<# days in future\>                  | Specifies the start date as the number of days from the current date. |
| -duration \<# days\>                     | Specifies the end date as the number of days after the start date. |
| -crdate                                  | Specifies selection by the create date, rather than the last edit date. Using this argument is essentially the same as checking the Use create date box in the BI Populator window. When using this argument, do not specify a date. NOTE: If you do not use the crdate or ledate argument in the command line, BI Populator will run using whichever setting was selected the last time the utility was exited. |
| -ledate                                  | Specifies selection by the last edit date, rather than the create date. Using this argument is essentially the same as checking the Use last edit date box in the BI Populator window. When using this argument, do not specify a date. |
| -customer                                | Specifies customer population will be performed.             |
| -customerfile \<filepath\>               | Specifies a file containing a list of customer IDs to be populated. Note that if you use this argument, you do not have to use the -customer argument. The presence of the -customerfile argument specifies customer population will be performed. |
| -contract                                | Specifies contract population will be performed.             |
| -contractfile \<file path\>              | Specifies a file containing a list of contract IDs to be populated. Note that if you use this argument, you do not have to use the -contract argument. The presence of the -contractfile argument specifies that contract population will be performed. |
| -gl                                      | Specifies GL population will be performed.                   |
| -invoicefile \<file path\>               | Specifies a file containing a list of invoice IDs to be populated. Note that if you use this argument, you do not have to use the -gl argument. The presence of the -invoicefile argument specifies that invoice population will be performed. |
| -debitfile \<file path\>                 | Specifies a file containing a list of debit IDs to be populated. Note that if you use this argument, you do not have to use the -gl argument. The presence of the -debitfile argument specifies that debit population will be performed. |
| -paymentfile \<file path\>               | Specifies a file containing a list of payment IDs to be populated. Note that if you use this argument, you do not have to use the -gl argument. The presence of the -paymentfile argument specifies that payment population will be performed. |
| -creditfile \<file path\>                | Specifies a file containing a list of credit IDs to be populated. Note that if you use this argument, you do not have to use the -gl argument. The presence of the -creditfile argument specifies that credit population will be performed. |
| -adorder                                 | Specifies ad order population will be performed.             |
| -adorderfile \<file path\>               | Specifies a file containing a list of ad order IDs to be populated. Note that if you use this argument, you do not have to use the -adorder argument. The presence of the -adorderfile argument specifies that credit population will be performed. |
| -leavesettings                           | If you run two copies of the BI Populator, they interfere with each other’s settings. A copy of the BI Populator called with this argument will avoid updating the settings, leaving the original copy of the BI Populator alone. |

---

<div style="page-break-after: always;"></div>
## dmUser SysAdmin Setting

A setting in System Admin &#129106;  Tools/System Level Information &#129106; Other Settings tab called “Update Existing dmUser Entry” is used to control when a user is moved to a new sales team, region, territory or company.

![](../assets/bi_core_mapping-sysadmin.jpg)

### Update Existing dmUser Entry - CHECKED

When this option is checked, any change made to the sales rep’s Team, Region, Territory or Company within system admin is reflected by updating the existing row in the dmUser table. 

### Update Existing dmUser Entry - UNCHECKED

If this option is not checked, than when a change is made to a sales rep’s Team, Region, Territory or Company a new row is created in dmUser for that sales rep, but his old row still exists. 

![img](../assets/bi-faq-dmUserSysAdmin.jpg)

**What Does This Mean**

These options affect how the Sold By rep’s transactions are able to be reported.

Every transaction (ad taken) has a Sold By sales rep attached to it.  This is a field that is set in Adbooker.   

When this option is Unchecked it will effectively let the Sold By rep’s transactions “move” with him when he moves to a new sales team, territory or region.  

For example, Rep JDoe is on Team Alpha in '17 and in Dec '17 he sold 10 ads in which he was the rep in the Sold By field in Ad Booker.  If we were to run a report for Dec '17 for Team Alpha, Rep JDoe’s sales would be included in the total.    

**Update Existing dmUser Entry - CHECKED**

If in Jan ’18 Rep JDoe was moved to Team Beta and Option 1 was set in System Admin, the same report, Dec '17 for Team Alpha, Rep JDoe’s sales would NO longer be included in the total.  

**Update Existing dmUser Entry - UNCHECKED**

However if this option is checked in System Admin, the above report would be the same both before and after Rep JDoe was moved to Team Beta.  

Be aware the Rep JDoe always is the Sold By rep on the ads.  This just allows you to choose what Team, Region, Territory or Company those ads should show up in.

### BE CAREFUL Changing This Option

If you have been populating the BI Database with this option unchecked and then decide you want it checked.  You will need to run a process in the BI Populator to make sure the data is consistent.

If you change this setting, from being un-checked to being checked, there is a function in BiPopulator to update the existing entries in BI. This would merge all entries for a sales rep to point to one record in BI.

Some sites start with the setting unchecked, but realize they want to change this and go to one record per sales rep. To update existing data to have one row vs. multiple you can use a function in BI Populator:

![1543509375900](../assets/bi-faq-bipopfixtable.jpg)



You click on ‘Fix The Table’ and it goes through all the [dmUser](bi-database-core-mapping#dmuser) records and merges them into one per sales rep. **Note:** Always do this in a **separate** BI Populator session here you are logged in with a user that is NOT
the same as the Automated BI Populator.

---

<div style="page-break-after: always;"></div>
## Spread Logic may Cause Large Spread Amount

> First seen in 2009

First and foremost this is not a bug in the sense that there is an error in the code.  As you will see it is caused by how the spread is calculated.

The spread algorithm is designed to spread an amount, like order level charges, credits, etc, across all other charges and distribute a weighted amount to each.  

Here is how the algorithm figures the weights:

Assume we are spreading a $50 Order Level charge across an ad with 3 revenue entries

![1539022078765](../assets/bi-faq-spreadlogic.jpg)

1.	Add all the revenue amounts together that we are going to spread the order level charge across.  (Amount Column)
2.	Divide each line item amount by the total amount to get a weighted percentage of how much of the spread amount to allocate to this line item.
3.	Multiply the Spread Amount by the calculated percentage found in step 2 to get the spread amount allocation.

This works fine until you run into a situation with line items as follows:

![1539022127954](../assets/bi-faq-spreadlogic2.jpg)

You can see that because the final total is a small number our percentages are very high, but in the end add to a total of 100% and the spread amount add to the correct number.

This is most commonly seen in Till forbid ads.

---

<div style="page-break-after: always;"></div>
## BI Populator Object Id Filter Mapping

The BI Populator allows you to manually populate individual records from the Object Id Filters tab.  Below is a mapping to the fields that are being referenced on this tab.

![1539022454846](../assets/bi-faq-ObjectIdFilterMap.jpg)

## shBIInterface Table Codes

The shBIInteface table in the AdBase core database is a table used to tell the BI Populator to populate information that will not get picked up by the BI Populator's normal check.

Usually, it is utility applications like RepSetter that will populate this table when it is run by users.

```sql
select * from shbiInterface
```

One of the fields in the shBIInterface table is the `FunctionCode` field.  This code represents what type of populating is going to occur. The other field of importance is the `ApplicationId` which tells us which application wrote the record in the shBIInterface table.  Lastly, the ObjectId, is the associated ID to be populated.  Whether the ObjectID represents an AdOrderID or CustomerID or something else, depends on the `FunctionCode` .

### Function Codes

Below is a list of the **function codes** and their enumerations.

| Function                                        | Function Code |
| :---------------------------------------------- | ------------- |
| <center>**Contract related functions**</center> |               |
| ShBIInterfacePopulateContract                   | 1             |
| ShBIInterfacePurgeContract                      | 2             |
| <center>**Invoice related functions**</center>  |               |
| ShBIInterfacePopulateInvoice                    | 101           |
| ShBIInterfacePurgeInvoice                       | 102           |
| ShBIInterfaceInvoiceClosedDate                  | 103           |
| <center>**Debit related functions**</center>    |               |
| ShBIInterfacePopulateDebit                      | 201           |
| ShBIInterfacePurgeDebit                         | 202           |
| ShBIInterfaceDebitClosedDate                    | 203           |
| <center>**Payment related functions**</center>  |               |
| ShBIInterfacePopulatePayment                    | 301           |
| ShBIInterfacePurgePayment                       | 302           |
| ShBIInterfacePaymentClosedDate                  | 303           |
| <center>**Credit related functions**</center>   |               |
| ShBIInterfacePopulateCredit                     | 401           |
| ShBIInterfacePurgeCredit                        | 402           |
| ShBIInterfaceCreditClosedDate                   | 403           |
| <center>**Ad order related functions**</center> |               |
| ShBIInterfacePopulateAdOrder                    | 501           |
| ShBIInterfacePurgeAdOrder                       | 502           |
| ShBIInterfaceAdOrderQueueStatus                 | 503           |
| ShBIInterfaceAdOrderInvoicedAlready             | 504           |
| ShBIInterfaceAdOrderEditorialInsert             | 505           |
| ShBIInterfaceAdOrderPrimarySalesRep             | 506           |
| <center>**Miscellaneous functions**</center>    |               |
| ShBIInterfacePopulateCustomer                   | 901           |
| ShBIInterfaceStatementNumber                    | 902           |
| ShBIInterfaceSyncAccountingPeriods              | 903           |
| ShBIInterfaceLast                               | 90            |

### Application Ids

Below is a list of the Application Ids and their associated application descriptions.

| Application                       | Id                            |
| --------------------------------- | ----------------------------- |
| AdBookingAppId                    | 1                             |
| ContactManagementAppId            | 2                             |
| GraphicsManagementAppId           | 3                             |
| LockAdminAppId                    | 4                             |
| GalleyoutAppId                    | 5                             |
| AdRaterAppId                      | 6                             |
| ProductManagerAppId               | 7                             |
| AdOrderExportAppId                | 8                             |
| ScheduleSrvAppId                  | 9                             |
| AdmarcCustomerExportAppId         | 10                            |
| AIMCustomerExportAppId            | 11                            |
| OfficePayMgrAppId                 | 12                            |
| OutputAppId                       | 13                            |
| AdOneExportAppId                  | 14                            |
| Layout8000ExportId                | 15                            |
| CashReceiptsId                    | 16                            |
| CustomerBalanceUtilityId          | 17                            |
| DisplayAdImporterId               | 18                            |
| InvoiceGeneratorId                | 19                            |
| RemoteDataAppId                   | 20                            |
| TillForbidExtenderAppId           | 21                            |
| RemoteMaintAppId                  | 22                            |
| AdOrderPurgeUtilityId             | 23                            |
| CustomerPurgeUtilityId            | 24                            |
| RemoteClientDataSenderAppId       | 25                            |
| CreditManagerUtilityId            | 26                            |
| ContractRenewUtilityId            | 27                            |
| DBTableUtilityId                  | 28                            |
| WorkFlowUtilityId                 | 29                            |
| SystemAdminId                     | 30                            |
| AdbaseWebServerAppId              | 31                            |
| GEACCustomerExportId              | 32                            |
| PaymentDaemonId                   | 33                            |
| GEACCreditImporterId              | 34                            |
| NovaInterfaceId                   | 35                            |
| FinanceManagerId                  | 36                            |
| GEACContractExportId              | 37                            |
| WebExporterId                     | 38                            |
| GraphicPurgeUtilityId             | 39                            |
| ContractManagerAppId              | 40                            |
| BlindBoxReplyManagerId            | 41                            |
| LockBoxUtilityId                  | 42                            |
| WriteOffUtilityId                 | 43                            |
| NovaViaWarpInterfaceAppId         | 44                            |
| AuthorizeDotNetInterfaceAppId     | 45                            |
| CrainCustomerExportId             | 46                            |
| CrainContractExportId             | 47                            |
| AdBaseXMLImporterAppId            | 48                            |
| UserFieldsImportId                | 49                            |
| HighPlainsAdOrderExportId         | 50                            |
| HighPlainsCustomerExportId        | 51                            |
| GannettCustomerImporter           | 52                            |
| PlainDealerImportAppId            | 53                            |
| ExpireAdsId                       | 54                            |
| PaymentPlusAXId                   | 55 // Payment Plus  interface |
| SAOEImportAppId                   | 56                            |
| ICVerifyAXId                      | 57                            |
| SuperChargeInterfaceId            | 58                            |
| SmartStreamAdOrderExportId        | 59                            |
| MactivePGLExportId                | 60                            |
| SmartStreamInterfaceId            | 61                            |
| PlainDealerAdOrderExportId        | 62                            |
| CampaignManagerAppId              | 63                            |
| ImportEditorialInformationAppId   | 64                            |
| PlainDealerCCInterfaceId          | 65                            |
| Annapolis8000ExportId             | 66                            |
| PlanPagExportId                   | 67                            |
| SJCC8000ExportId                  | 68                            |
| SystemTranslatorUtilityId         | 69                            |
| AdBaseWebServerId                 | 70                            |
| AppSettingsManagerId              | 71                            |
| DataAnalysisReportId              | 72                            |
| DataAnalysisToolId                | 73                            |
| SpokaneCustomerExportId           | 74                            |
| WebDbManagerId                    | 75                            |
| XMLWebExporterId                  | 76                            |
| DataImportAppId                   | 77                            |
| SpokaneCustomerImportId           | 78                            |
| AdjustmentManagerAppId            | 79                            |
| PlanPagImportId                   | 100                           |
| AdQuoterId                        | 101                           |
| ExternalLoginAppId                | 102                           |
| InvoiceAutoPayAppId               | 103                           |
| CustomerExportId                  | 104                           |
| CreditBalImportId                 | 105                           |
| GraphicsExporterAppId             | 106                           |
| RefundCheckExporterAppId          | 107                           |
| TellanAXAppId                     | 108                           |
| GLExporterAppId                   | 109                           |
| VerisignPayflowAppId              | 110                           |
| AutoLaunchToolAppId               | 111                           |
| CustomerImportAppId               | 112                           |
| AdTrackingExportAppId             | 113                           |
| TimesPicayune8000ExporterId       | 114                           |
| AdbaseXMLExporterAppId            | 115                           |
| AmosCustomerExportAppId           | 116                           |
| SanJoseGLExportAppId              | 117                           |
| ContraCostaGLExportAppId          | 118                           |
| NewarkOrderExporterAppId          | 119                           |
| SJCCGLExportAppId                 | 120                           |
| SystemNodeMonitorAppId            | 121                           |
| AdbaseSystemNodeManagerAppId      | 122                           |
| AdbaseToPMPAdtrackAppId           | 123                           |
| AdjustmentsMonitorAppId           | 124                           |
| AdbasePurgeUtilityAppId           | 125                           |
| RevenueExportAppId                | 126                           |
| BIPopulatorAppId                  | 127                           |
| EmailAlertManagerId               | 128                           |
| GatewayPaymentsMgrAppId           | 129                           |
| InCollectionsMarkerId             | 130                           |
| BalanceUtilityId                  | 131                           |
| IpixManagerId                     | 132                           |
| BIImporterAppId                   | 133                           |
| Fayetteville8000ExportId          | 134                           |
| RangerExportAppId                 | 135                           |
| USPSConversionUtilityAppId        | 136                           |
| StatementNumberToolAppId          | 137                           |
| TimesPicayuneUSGExportAppId       | 138                           |
| TimesPicayunePPBillingExportAppId | 139                           |
| MactivePlannerAppId               | 140                           |
| AdbaseXMLDistributorAppId         | 141                           |
| MactiveLoginAuditTrailId          | 142                           |
| XMLCustomerTransportId            | 143                           |
| CallFXExportAppId                 | 144                           |
| BIUtilityAppId                    | 145                           |
| BIInterfaceAppId                  | 146                           |
| KubraInterfaceAppId               | 147                           |
| ScheduleAdminAppId                | 148                           |
| MGDSIProjectedCountsAppId         | 149                           |
| MGDSIFinalCountsAppId             | 150                           |
| AdPayManagerId                    | 151                           |
| MobileAdPackPreprintId            | 152                           |
| BonusSpendingUtilityAppId         | 153                           |
| MactiveImageManagerId             | 154                           |
| MactiveImageUtilityAppId          | 155                           |
| DorfmanInterfaceAppId             | 156                           |
| Newark8000ExportId                | 157                           |
| VVPaymentInterfaceAppId           | 158                           |
| LiveProcessorInterfaceAppId       | 159                           |
| BookedSizeUpdaterAppId            | 160                           |
| MediaLinkAppId                    | 161                           |
| PlaceholderOrderAppId             | 162                           |
| DocumentEpxorterAppId             | 163                           |
| StandardReportsAppId              | 164                           |
| CyberSourceAppId                  | 165                           |
| AdbaseToYahooHotJobsId            | 166                           |
| CustomerStatusUtilityId           | 167                           |
| SDEPayInterfaceId                 | 168                           |
| ContractImportAppId               | 169                           |
| GraphicsImporterAppId             | 170                           |
| PaywareAppId                      | 171                           |
| DirectDebitToolAppId              | 172                           |
| AdbaseARAppId                     | 173                           |
| InterfaceDateUtilityId            | 174                           |
| PreprintCountToolAppId            | 175                           |
| DJBizSerivicesInterfaceAppId      | 176                           |
| CreditCardUtility                 | 193                           |
| EPSImporterAppId                  | 194                           |
| PaymentCutoffUtilityAppId         | 195                           |
| SalesforceUpdaterAppId            | 196                           |
| TagOrderToolAppId                 | 197                           |
| BatchCheckerAppId                 | 198                           |
| DJBizPayToolAppId                 | 199                           |
| OASExporterAppId                  | 200                           |
| PDFLinkerAppId                    | 201                           |
| AdbasePrintAuditAppId             | 202                           |
| PersonalFinanceManagerAppId       | 203                           |
| WebInventoryManagerAppId          | 204                           |
| PaymentTokenManagerAppId          | 205                           |
| BraintreePaymentAppId             | 206                           |
| GraphicsUpdaterAppId              | 207                           |
| XmlImporterFolderServerAppId      | 208                           |
| SSPCustomerExportAppId            | 209                           |
| OneViewAppId                      | 210                           |
| EdgilEccOAppId                    | 211                           |
| ElavonProtoBaseAppId              | 212                           |
| AutoPlannerAppId                  | 213                           |
| BcContentMgmtSubsystemId          | 214                           |
| BcSpaceMgmtSubsystemId            | 215                           |
| TrafficManagerAppId               | 216                           |
| SCANDARFinanceChargerAppId        | 217                           |
| OneViewSelfServiceAppId           | 218                           |
| FTNIAppId                         | 219                           |
| PayFlowTokenAppId                 | 220                           |
| SPHWorldPayAppId                  | 221                           |
| EPXAppId                          | 222                           |
| EdgilPayWayAppId                  | 223                           |
| FDHelperAppId                     | 224                           |
| Newsday8000ExportId               | 225                           |
| AdServingAppId                    | 226                           |
| PreSalesAppId                     | 227                           |
| MSSExportAppId                    | 228                           |
| AdSafeExportId                    | 229                           |
| BroadcastFormatImporterId         | 230                           |
| BroadcastPostProductionId         | 231                           |
| BroadcastFeedbackImporterId       | 232                           |
| GLRemapperAppId                   | 233                           |
| ASIStatsUtilityAppId              | 234                           |
| IntegrationServicesAppId          | 235                           |
| RelationUpdateInterfaceId         | 236                           |
| MonerisAppId                      | 237                           |
| EPSFPurgerAppId                   | 238                           |
| GoalToolAppId                     | 239                           |
| ChasePaymentTechAppId             | 240                           |
| ISNPDFXMLExporterAppId            | 241                           |
| ImportEditorialInfoAppId          | 242                           |
| PrintQueueToolAppId               | 243                           |
| ReportToolAppId                   | 244                           |
| FirstDataAppId                    | 245                           |
| FieldedDataModUtilAppId           | 246                           |
| DJContractAccrualExportAppId      | 247                           |
| FinanceChargerAppId               | 248                           |



