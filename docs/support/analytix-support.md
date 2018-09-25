---
id: analytix-support
title: Analytix Support
sidebar_label: Analytix Support Answers
---

[Optional Header]: # "Analytix Support"

- [Clearing CAL Data from QMC](#clearing-cal-data-from-qmc)
- [Assigning Document CALs and Full Use (Named User) CALs](#assigning-document-cals-and-full-use-(named-user)-cals)
- [Exporting and Importing Bookmarks using IE Plugin](#exporting-and-importing-bookmarks-using-ie-plugin)
- [Removing User Objects](#removing-user-objects)

## Clearing CAL Data from QMC

This is an extreme measure in that you are removing the CAL license pgo file.  However, shared information will be retained in the **.shared** files. 

To clear all CAL data from the system, start the QMC and go to **System\Setup\Qlikview Servers\Folders** tab:

![1536243947527](..\assets\support_1536243947527.png)

Look for the Root Folder location (see circled path above) and open up a Windows Explorer at this location.

You should see a number of **\*.pgo** files.

![1536244081111](..\assets\support_1536244081111.png)

Next stop all Qlikview Services and then delete the **CalData.pgo** file.  

When you look at the license screen in the QMC, you should see an empty list of in the **Assigned CALs** area by going to **System\Licenses\QlikView OEM Server\Client Access Licenses(CALs)\Assigned CALs**

![1536244729773](..\assets\support_1536244729773.png)

---

## Assigning Document CALs and Full Use (Named User) CALs

A **Document CAL** allows one user to open one Analytix document. So this would allow a Sales Rep to view all the reports that exist in the SalesFlash.qvw. The license is perpetual and will allow the user to open and use all the reports that exist within a single document. When a user opens an Analytix Document and consumes a Document CAL the user will be stored and linked with the Analytix Document.

A **Full Use CAL** allows one user to open any Analytix document. The license is perpetual and will the user to open any document until the license is revoked.

The first thing to understand are the two ways that licenses can be assigned to end users:

1. **Dynamic CAL Assignment** – This lets Qlikview server assign licenses on a first come first serve basis. The hierarchy to this assignment is as follows:
  - If a Full Use CAL is available, it will be used.
  - If a Document CAL is available, it will be used.
2. **Manual CAL Assignment** – A Qlikview administrator manually assigns an end user a Full Use or Document CAL.

You can see that the **Dynamic CAL** assignment method does not work well when you have both Document and Full Use CALs. In this case it is probably best to turn OFF dynamic CAL assignment and instead manually assign users to CALs.

###  Turning OFF Dynamic CAL Assignment

To turn off Dynamic CAL Assignment, go to the **QMC -> System tab -> Licenses -> Qlikview Server -> Client Access Licenses (CALs) -> General tab** and UNCHECK the “Allow dynamic CAL assignment” checkbox:

![1536245135074](..\assets\support_1536245135074.png)

### Manually Assign Full Use Licenses

To manually assign Full Use licenses to end users, go to the **QMC -> System tab -> Licenses -> Qlikview Server -> Client Access Licenses (CALs) -> Assigned CALs** tab:

![1536245181672](..\assets\support_1536245181672.png)

Once on this tab, click on the icon located in the right hand corner ->![1536245231614](..\assets\support_1536245231614.png)

This will bring up a "Manage Users" dialog.

![1536245264349](..\assets\support_1536245264349.png)

In this dialog you can add the users who will be getting Full Use licenses. You may do this by searching for them, using the “Search for Users and Groups” box or by manually entering the *domain\usernames* of those users who are going to get a full use license.  

**NOTE:** You may not be able to find the users by searching depending on how the domains have been set up.  If this is the case, use the manual entry method.

You may enter multiple users in this input box by simply separating them with a semicolon: 

*Domain\User1;Domain\User2*

### Manual Assignment of Document CALs

Documents CALs are assigned from the Documents->User Documents tab.

![1536245418867](..\assets\support_1536245418867.png)

You assign user directly to the document you want them to have access to.

To do this, simply click on the document and then in the right hand side of the screen choose the **“Document CALs”** tab.

![1536245452033](..\assets\support_1536245452033.png)

Follow these steps:

1. In the “Number of CALs allocated to this Document” input box, enter the number of users who you are going to assign to have access to this document
2. Click on the Icon to the right of the screen in the Assigned Users section and enter the Domain\Usernames of the users who will have access to this doc and click OK.
3. When done make sure to click on the Apply button.

Follows these steps for each document that you are assigning Document CALs to.

### Options

If you do not want to assign all the document CALs manually, you could instead just manually assign the Full Use CALs and then for each document that you want other users to have access to, assign the number of CALs for each document and the check the **“Allow Dynamic CAL assignment”** checkbox.

![1536245527622](..\assets\support_1536245527622.png)

---

## Exporting and Importing Bookmarks using IE Plugin

### Exporting Bookmarks

Start by going to the Bookmarks menu and choosing More…

![1536257756100](..\assets\support_1536257756100.png)

This will bring up the bookmarks dialog.  Go to the **Document Bookmarks** tab and click on the **“Export”** button.

![1536257803866](..\assets\support_1536257803866.png)

This will bring up the Export Bookmarks dialog. Here it will allow you to choose which bookmarks to export. 

> > The **Export** button is only available on the *Document Bookmarks* tab, however, it will bring up a dialog that shows all bookmarks available to export.  These will include the bookmarks that you have created PLUS all of the shared bookmarks.  Unfortunately, there is no easy way to uncheck everything and just check your own bookmarks.  Also, if you have not prefixed your bookmarks with your intials, they may be hard to fine.  
> >
> > Be aware, that if you export all of the bookmarks, when you import them, the *shared* bookmarks will become your bookmarks.

Click on each one that you want to export and click OK.

![1536257826640](..\assets\support_1536257826640.png)

This will bring up a Save As dialog. Enter a destination an

d name for your bookmark file (Remember where it is, you will need it when you import!!) and click OK.  The file will be create with an **\*.BM.xml** extension

You are done exporting bookmarks.

### Importing Bookmarks

Start by going to the Bookmarks menu and choosing More…

![1536257756100](C:/Users/mark.mccoid/Documents/AnalytixDevelopment/AnalytixDevWork/WorkingDocs/Docs/assets/support_1536257756100.png)

This will bring up the bookmarks dialog.  Go to the **User Bookmarks** tab and click on the **“Import”** button.

![1536259191816](..\assets\support_1536259191816.png)

Choose the bookmark file you want to import and click OK.  It will have an extension of **\*.BM.xml**.

This will bring up the *Import Bookmarks* dialog. Here it will allow you to choose which bookmarks to import. Click on each one that you want to import and click on Import.  If you want to deselect a bookmark, hold the control key and click on the bookmark to deselect.

Once you have the bookmarks you want to move selected, click on the import button.  This will not import them yet, but will move them to the **Current Bookmarks** area.

![1536258752814](..\assets\support_1536258752814.png)

If you would like to rename any of the bookmarks before importing them, simply hight the bookmark to rename, then click on the **Rename button**.  Once finished, click on OK to import the bookmarks.

![1536258890978](..\assets\support_1536258890978.png)

What you have done is import all of the selected bookmarks into your **User Bookmarks** area.  These bookmarks are stored on the local computer you are running Analytix on.  The desired outcome is to have these bookmarks stored on the server, under your user.

This is easily accomplished.  Make sure you are on the **User Bookmarks** tab, then click on the **"Move Local User Bookmarks to Server"** link.

> When you move bookmarks to the server, it is all or none.  You cannot just pick certain bookmarks.  This is ok because having all a user's bookmarks on the server makes it so they can be accessed from any computer.

![1536259062137](..\assets\support_1536259062137.png)

 Your bookmarks will be removed from the local repository to the server repository.

---

## Removing User Objects

It seems like an easy task to remove a cloned object from an Analytix file. Simply Right click on the object and select Remove.

![1536261981874](..\assets\support_1536261981874.png)

This will remove the object from the sheet, but the underlying cloned object still will exist in your Server Object Pane.

So, to really fully remove an cloned object from the application you need to click on the “Server Objects icon” ![1536262030211](..\assets\support_twoheadedicon.png)or press **F2** to open up the **Server Objects Pane**.

Once in the **Server Objects Pane**, find the object that you want to remove permanently.

> You can only remove items from the “My Objects” section.

Right click on the object you want to remove and select Remove.

![1536262165067](..\assets\support_1536262165067.png)

You will be prompted if you want to remove the object. Removing an object will also remove any instances of that object on your sheets. But that’s OK, because you want to get rid of it!