---
id: qlikview-miscellaneous-support
title: Qlikview Miscellaneous Support
sidebar_label: Qlikview Miscellaneous Support
---

## BNF Mode Issue with QV 12.2 2017 - Failing Reloads

**Description**
Reloads that were functioning fine in QlikView 11.20 or QlikView 12.x, begin to fail after an upgrade to QlikView November 2017.

After upgrading to QlikView November 2017, odd behavior may be seen with expressions, scripts, set analysis, etc.  Things like:

- Expression editor may throw an error
- Chart may show empty
- Chart may show "Incomplete visualization"
- Chart may show "Invalid dimension" And any other odd behavior that would mimic a change in the script (expression, set analysis, etc). 

So far, we have seen this issue manifest with a few customers as a change in how single quotes and double quotes are being treated.
See article [Quotes in Set Analysis change in behavior](https://qliksupport.force.com/articles/Basic/Quotes-in-Set-Analysis-change-in-behavior-error-in-expression-or-incomplete-visualization-or-invalid-dimension)

**Environment**:

QlikView 12.20 (November 2017) all service releases **not available in 12.30 (November 2018)**

**Cause:**

A new script reload mode, BNF, has been introduced.

**Resolution:**

A new script reload mode, BNF, has been introduced. In some unusual cases, users may need to disable the BNF reload mode using one of these methods.

**Disabling BNF reload mode on the local QlikView client:**

Update the **QV.exe** *Settings.ini* file by adding the line `EnableBnfReload=0` under the `[Settings 7]` tag for the default reload setting *"EnableBnfReload"*.
By default, Settings.ini can be found in `C:\%USER%\AppData\Roaming\QlikTech\QlikView`

**Disabling BNF reload mode for the entire server:**

Update the QVB.exe  Settings.ini by adding the line EnableBnfReload=0 under the [Settings 7] tag for the default reload setting "EnableBnfReload". 
By default, the Settings.ini can be found in 

`C:\Windows\System32\config\systemprofile\AppData\Roaming\QlikTech\QlikViewBatch`

For more information please review [Where to find the QlikView QVB settings file](https://qliksupport.force.com/articles/Basic/Where-to-find-the-QlikView-QVB-settings-file)

Modify it to read:

```
[Settings 7]
EnableBnfReload=0
```

**Disabling BNF reload mode for individual apps:**

Add the `///$bnf off` tag at the top of the script (it must be within the first 50 characters of the script). Reload the script.
It is a good idea to use the `///$bnf off` tag as a troubleshooting step.  See if toggling this setting in the load script will cause a change in the suspect behavior.