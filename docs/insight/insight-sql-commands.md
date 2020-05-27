---
id: insight-sql-commands
title: InSight SQL Commands
sidebar_label: InSight SQL Commands
---

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

