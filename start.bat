@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   全生命周期健康管理App
echo   一键启动脚本
echo ========================================
echo.

:: 检查PostgreSQL是否安装
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到PostgreSQL，请先安装
    echo 下载地址: https://www.postgresql.org/download/
    pause
    exit /b 1
)
echo [✓] PostgreSQL 已安装

:: 检查Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到Node.js，请先安装
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo [✓] Node.js 已安装

:: 检查后端依赖
echo.
echo [1/4] 检查后端依赖...
cd backend
if not exist node_modules (
    echo 正在安装后端依赖...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 后端依赖安装失败
        pause
        exit /b 1
    )
    echo [✓] 后端依赖安装完成
) else (
    echo [✓] 后端依赖已存在
)

:: 检查.env文件
echo.
echo [2/4] 检查环境配置...
if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [✓] 已创建 .env 文件
        echo.
        echo [!] 请编辑 backend\.env 文件，配置数据库信息：
        echo     - DB_HOST: localhost
        echo     - DB_PORT: 5432
        echo     - DB_NAME: health_app
        echo     - DB_USER: postgres
        echo     - DB_PASSWORD: [你的数据库密码]
        echo.
        pause
        exit /b 0
    ) else (
        echo [错误] 缺少 .env.example 文件
        pause
        exit /b 1
    )
) else (
    echo [✓] 环境配置文件已存在
)

:: 检查数据库
echo.
echo [3/4] 检查数据库...
set DB_PASSWORD=
set /p DB_PASSWORD=请输入PostgreSQL密码（或直接回车跳过）:

if defined DB_PASSWORD (
    echo 正在检查数据库...
    psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='health_app';" 2>nul | findstr "1" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo 正在创建数据库...
        psql -U postgres -c "CREATE DATABASE health_app;" -q
        echo [✓] 数据库创建成功
    ) else (
        echo [✓] 数据库已存在
    )

    echo 正在导入数据表...
    psql -U postgres -d health_app -f ..\database\schema.sql -q 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [警告] 数据表导入可能已存在或失败
    ) else (
        echo [✓] 数据表导入完成
    )
)

:: 检查前端依赖
echo.
echo [4/4] 检查前端依赖...
cd ..\frontend
if not exist node_modules (
    echo 正在安装前端依赖...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 前端依赖安装失败
        pause
        exit /b 1
    )
    echo [✓] 前端依赖安装完成
) else (
    echo [✓] 前端依赖已存在
)

:: 完成提示
echo.
echo ========================================
echo   [✓] 准备工作全部完成！
echo ========================================
echo.
echo 启动方式：
echo.
echo 方式1（推荐）: 分别启动前后端
echo   终端1: cd backend ^&^& npm run dev
echo   终端2: cd frontend ^&^& npm start
echo.
echo 方式2: 使用 start-all.bat 同时启动（需要先配置）
echo.
echo 访问地址：
echo   前端: http://localhost:3000
echo   后端: http://localhost:3000/health
echo.
pause
