@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   重新启动服务
echo ========================================
echo.

:: 停止可能占用端口的进程
echo [1/3] 检查端口占用...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a 2>nul
    echo 已停止进程 %%a
)

:: 启动后端Mock API
echo.
echo [2/3] 启动Mock API服务器...
cd backend
start "Mock API" cmd /k "node src\index-mock.js"

echo [✓] Mock API服务器启动中...
echo    API地址: http://localhost:3000

:: 等待后端启动
timeout /t 3 /nobreak >nul

:: 启动前端应用
echo.
echo [3/3] 启动前端应用...
cd ..\frontend
start "React App" cmd /k "npm start"

echo.
echo ========================================
echo   [✓] 服务启动完成！
echo ========================================
echo.
echo 访问地址：
echo   前端应用: http://localhost:3000
echo   Mock API:  http://localhost:3000/health
echo.
echo [提示] 关闭此窗口不会停止服务
echo        请关闭各自的命令窗口来停止
echo.
pause
