@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   数据库管理工具
echo ========================================
echo.
echo 1. 创建数据库
echo 2. 删除数据库
echo 3. 查看数据库列表
echo 4. 导入Schema
echo 5. 清空数据（保留表结构）
echo 6. 备份数据库
echo 7. 恢复数据库
echo 0. 退出
echo.
set /p choice=请选择操作:

if "%choice%"=="1" goto create_db
if "%choice%"=="2" goto drop_db
if "%choice%"=="3" goto list_db
if "%choice%"=="4" goto import_schema
if "%choice%"=="5" goto clear_data
if "%choice%"=="6" goto backup_db
if "%choice%"=="7" goto restore_db
if "%choice%"=="0" goto end

:create_db
echo.
set /p dbname=请输入数据库名称（默认: health_app）:
if "%dbname%"=="" set dbname=health_app
psql -U postgres -c "CREATE DATABASE %dbname%;"
if %ERRORLEVEL% EQU 0 (
    echo [✓] 数据库 %dbname% 创建成功
) else (
    echo [错误] 数据库创建失败
)
goto end

:drop_db
echo.
set /p dbname=请输入要删除的数据库名称（默认: health_app）:
if "%dbname%"=="" set dbname=health_app
echo.
set /p confirm=确认删除数据库 %dbname%？(y/n):
if /i "%confirm%"=="y" (
    psql -U postgres -c "DROP DATABASE %dbname%;"
    if %ERRORLEVEL% EQU 0 (
        echo [✓] 数据库 %dbname% 已删除
    ) else (
        echo [错误] 数据库删除失败
    )
) else (
    echo 已取消
)
goto end

:list_db
echo.
echo 数据库列表：
psql -U postgres -c "\l"
goto end

:import_schema
echo.
set /p dbname=请输入数据库名称（默认: health_app）:
if "%dbname%"=="" set dbname=health_app
echo 正在导入Schema...
psql -U postgres -d %dbname% -f ..\database\schema.sql
if %ERRORLEVEL% EQU 0 (
    echo [✓] Schema导入成功
) else (
    echo [错误] Schema导入失败
)
goto end

:clear_data
echo.
set /p dbname=请输入数据库名称（默认: health_app）:
if "%dbname%"=="" set dbname=health_app
echo.
set /p confirm=确认清空数据？这将删除所有数据但保留表结构 (y/n):
if /i "%confirm%"=="y" (
    echo 正在清空数据...
    psql -U postgres -d %dbname% -c "
        TRUNCATE TABLE health_records CASCADE;
        TRUNCATE TABLE user_favorites CASCADE;
        TRUNCATE TABLE reminders CASCADE;
        TRUNCATE TABLE user_constitutions CASCADE;
        DELETE FROM recipes WHERE recipe_id IS NOT NULL;
        DELETE FROM tcm_constitutions WHERE constitution_id NOT IN (1, 2, 3);
        DELETE FROM age_nutrition_requirements WHERE id NOT IN (SELECT MIN(id) FROM age_nutrition_requirements GROUP BY mineral_id);
    "
    echo [✓] 数据已清空
) else (
    echo 已取消
)
goto end

:backup_db
echo.
set /p dbname=请输入数据库名称（默认: health_app）:
if "%dbname%"=="" set dbname=health_app
set /p backupfile=请输入备份文件名（默认: backup_%date:~0,4%%date:~5,2%%date:~8,2%.sql）:
if "%backupfile%"=="" set backupfile=backup_%date:~0,4%%date:~5,2%%date:~8,2%.sql
echo 正在备份数据库...
pg_dump -U postgres %dbname% > %backupfile%
if %ERRORLEVEL% EQU 0 (
    echo [✓] 数据库已备份到 %backupfile%
) else (
    echo [错误] 备份失败
)
goto end

:restore_db
echo.
set /p dbname=请输入数据库名称（默认: health_app）:
if "%dbname%"=="" set dbname=health_app
set /p backupfile=请输入备份文件名:
if "%backupfile%"=="" (
    echo [错误] 请指定备份文件
    goto end
)
echo 正在恢复数据库...
psql -U postgres %dbname% < %backupfile%
if %ERRORLEVEL% EQU 0 (
    echo [✓] 数据库已恢复
) else (
    echo [错误] 恢复失败
)
goto end

:end
echo.
pause
