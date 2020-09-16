---
id: insight-sql-commands
title: InSight SQL Commands
sidebar_label: InSight SQL Commands
---

## Check Error Tables

Below is the query that can be used to pull the data out of the error table. important columns are:

**erev_Stamp**: Data when error record was loaded

**sn_module**: name of the table

**sn_code/sn_desc**: Custom error code and error message (these are defined in the package)

```sql
SELECT TOP 10000 * 
FROM   [dbo].[sys_fct_errorevent] f 
       JOIN [dbo].[sys_dim_screen] d 
         ON d.sn_key = f.erev_screenkey 
WHERE  sn_module NOT LIKE 'cln_brg_truckdistribpoint' 
ORDER  BY f.erev_key DESC 
```

If you are looking for a particular table, just add a filter condition for sn_Module.

Its important to understand what these tables stores so I will provide a quick summary.

Data from source files (\*.ASC) is loaded into fil\_\* tables. 

Data then gets massaged (all different joins and transformations) and a clean copy of the data (that can be straight loaded into dim or fact tables) is loaded into cln\_\* tables. But before loading some rules are applied to check the consistency and accuracy of data. And any failed records are loaded into the **sys_fct_errorevent** table.

For some sources we always receive full data and all those failed records will be logged everyday. So size of these table keeps on going up.

## Check When Backup was Restored

```sql
SELECT 
   [rs].[destination_database_name], 
   [rs].[restore_date], 
   [bs].[backup_start_date], 
   [bs].[backup_finish_date], 
   [bs].[database_name] as [source_database_name], 
   [bmf].[physical_device_name] as [backup_file_used_for_restore]
FROM msdb..restorehistory rs
INNER JOIN msdb..backupset bs ON [rs].[backup_set_id] = [bs].[backup_set_id]
INNER JOIN msdb..backupmediafamily bmf ON [bs].[media_set_id] = [bmf].[media_set_id] 
ORDER BY [rs].[restore_date] DESC
```

## SSIS Error Query

You can use this query to pull error data from the Management database.  This table is huge and logs all SSIS messages.  You will want to limit it by day and possibly *event* as in the query below.

```sql
SELECT * FROM [CirculationInSightManagement]..sysssislog where event in ('User:User:OnError', 'ONError') and starttime >'2019-03-01 0:00:00.000'
order by starttime desc
```

## Rebuild Indexes for CirculationInsightStaging DB

This script will rebuild the indexes for the CirculationInsightStaging Database:

```sql
use CirculationInSightStaging
GO
DECLARE @Database NVARCHAR(255)   
DECLARE @Table NVARCHAR(255)  
DECLARE @cmd NVARCHAR(1000)  

set @Database = 'CirculationInSightStaging'

DECLARE TableCursor CURSOR READ_ONLY FOR SELECT '[' + table_catalog + '].[' + table_schema + '].[' +  
   table_name + ']' as tableName FROM CirculationInSightStaging.INFORMATION_SCHEMA.TABLES WHERE table_type = 'BASE TABLE'

   OPEN TableCursor   

   FETCH NEXT FROM TableCursor INTO @Table   
   WHILE @@FETCH_STATUS = 0   
   BEGIN
      BEGIN TRY   
         SET @cmd = 'ALTER INDEX ALL ON ' + @Table + ' REBUILD' 
         --PRINT @cmd -- uncomment if you want to see commands
         EXEC (@cmd) 
      END TRY
      BEGIN CATCH
         PRINT '---' +ERROR_MESSAGE() 
         PRINT @cmd
      END CATCH

      FETCH NEXT FROM TableCursor INTO @Table   
   END   

   CLOSE TableCursor   
   DEALLOCATE TableCursor 
```

## Kill SQL For DB

This SQL will kill all running SQL statements on a specific database.

```sql
USE [master];

DECLARE @kill varchar(8000) = '';  
SELECT @kill = @kill + 'kill ' + CONVERT(varchar(5), session_id) + ';'  
FROM sys.dm_exec_sessions
WHERE database_id  = db_id('MyDB')

EXEC(@kill);
```

## Make Everyone System Admin

You can find this script in the Cognos install directory: `.\cognos\c8_64\configuration\schemas\content\sqlserver`

If you ever get locked out of the Cognos Admin, you can run the SQL below on the **Cognos10**  Database to reset the System Admins to be "Everyone"

```sql
INSERT INTO cmreford1 
            (propid, 
             cmid, 
             ord, 
             refcmid) 
SELECT 27, 
       (SELECT cmid 
        FROM   cmobjprops1 
        WHERE  objid = '::System Administrators'), 
       COALESCE((SELECT Max(ord) FROM cmreford1 WHERE propid=27 AND cmid=(SELECT 
       cmid 
       FROM cmobjprops1 WHERE objid='::System Administrators')), -1) 
       + 1, 
       cmid 
FROM   cmobjprops1 
WHERE  objid = '::Everyone' 
```

