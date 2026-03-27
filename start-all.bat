@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   同时启动前后端服务
echo ========================================
echo.

:: 创建后台启动脚本
echo 启动后端服务...
cd backend
start "Health App Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo 启动前端服务...
cd ..\frontend
start "Health App Frontend" cmd /k "npm start"

echo.
echo ========================================
echo   [✓] 服务已启动
echo ========================================
echo.
echo 后端: http://localhost:3000
echo 前端: http://localhost:3000
echo.
echo 关闭此窗口不会停止服务
echo 请关闭各自的服务窗口来停止
echo.
pause
