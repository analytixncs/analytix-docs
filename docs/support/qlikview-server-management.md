---
id: qlikview-server-management
title: Qlikview Server Management
sidebar_label: Qlikview Server Management
---



## Stop / Start Qlikview Services Batch File

Sometimes it is useful to restart the Qlikview services every night.  The easiest way to do this is to create a scheduled task with Windows Task Scheduler that runs a simple batch file.

The batch file will contain the following commands:

```powershell
net stop "Qlikview Directory Service Connector"
net stop "Qlikview Distribution Service"
net stop "Qlikview Management Service"
net stop "Qlikview Server"
net stop "Qlikview Webserver"

net start "Qlikview Directory Service Connector"
net start "Qlikview Distribution Service"
net start "Qlikview Management Service"
net start "Qlikview Server"
net start "Qlikview Webserver"
```

These commands take less than a minute or two to run, but still make sure you do not schedule the task to run during a reload or during peak usage times for Qlikview.

---

<div style="page-break-after: always;"></div>

