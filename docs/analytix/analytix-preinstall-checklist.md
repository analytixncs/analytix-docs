---
id: analytix-preinstall-checklist
title: Analytix Pre Install Checklist
sidebar_label: Analytix Pre Install Checklist
---

---



[Optional Header]: # "Analytix Pre Install Checklist"

## Hardware

Analytix, which is an application running within the Qlikview architecture, is a memory and CPU intensive application.  Each site will be unique in it requirements, but we have found, even for the smallest sites, 4 cores and 8 Gigs of RAM is the minimum.

Other configurations, as the sites get larger, could be:

| RAM     | CPU Cores   |
| ------- | ----------- |
| 16 Gigs | 8 Cores     |
| 32 Gigs | 8-16 Cores  |
| 64 Gigs | 16-32 Cores |

## Analytix Software

The Analytix software is installed via the **AnalytixInstaller.exe**.  This application will install and run the actual setup program that will guide you through the installation or upgrade of Analytix.

 Details on using the software is found in the [Analytix Installer](analytix-install )

## Qlikview Software

Qlikview is the engine that runs Analytix. 

The latest release of Qlikview can be found on the public FTP site. As of 2018 Qlikview 12.2 is the latest version.

The location on the ftp site is: **ftp://ftp-mlb.newscyclesolutions.com//Mark**

## Licensing

If the site is on-premise, make sure that you secure the Qlikview licensing before installing the software. 

## ODBC Connections

You will need two connections for each instance of Analytix.  

- A connection to your BI Database
- A connection to your Core Database

The default setting in Analytix is for 64 bit ODBC connections, but if for some reason you need 32 bit, this can be accomplished with a small change in the connection file.

For more information, see the  [Analytix Setup](analytix-setup) documentation.

## Background Account on Server

Qlikview runs a number of services that need a user with administrator privileges as well as rights to access the ODBC connections.

We will need the Username and Password for this account when installing Qlikview.

## On Site Training

During the on-site training for Analytix, each user should have access to Analytix during the training.  The training is very interactive and it is critical that users are able to try the examples during class.

## Quick Overview

Here is a quick checklist for on-premise sites.

1. Download the Analytix software: 
   ftp://ftp-mlb.newscyclesolutions.com//Mark/CurrentRelease/AnalytixInstaller.exe
2. Download the Qlikview software 
   ftp://ftp-mlb.newscyclesolutions.com//Mark/QlikView/CurrentRelease
3. Create a service account with Admin rights. We need the username and password for the install.
4. Create the ODBC connections to the BI and CORE databases. We need the login information for these databases.

   