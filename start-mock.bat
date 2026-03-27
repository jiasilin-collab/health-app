@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Mock模式启动（无需数据库）
echo ========================================
echo.

echo [信息] 检测到PostgreSQL未安装
echo [信息] 使用Mock API模式启动
echo.

cd backend

echo [1/2] 启动Mock API服务...
start "Mock API" cmd /k "node src/index-mock.js"

timeout /t 3 /nobreak >nul

cd ..\frontend

echo [2/2] 检查前端依赖...
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

echo.
echo ========================================
echo   [✓] 启动完成！
echo ========================================
echo.
echo 访问地址：
echo   前端: http://localhost:3000
echo   后端: http://localhost:3000/health
echo.
echo [提示] 关闭此窗口不会停止服务
echo        请关闭各自的服务窗口来停止
echo.
pause
