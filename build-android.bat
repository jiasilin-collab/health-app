@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Android APK构建脚本
echo   基于 Capacitor
echo ========================================
echo.

:: 检查Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo [✓] Node.js: %node%

:: 检查npm
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到npm
    pause
    exit /b 1
)
echo [✓] npm: %npm%

:: 步骤1: 构建前端
echo.
echo [1/6] 构建前端应用...
cd frontend
if not exist build (
    echo 正在构建前端...
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 前端构建失败
        pause
        exit /b 1
    )
    echo [✓] 前端构建完成
) else (
    echo [✓] 前端build已存在，跳过构建
)

:: 步骤2: 检查Capacitor
echo.
echo [2/6] 检查Capacitor...
where npx >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到npx
    pause
    exit /b 1
)

cd ..

:: 步骤3: 安装Capacitor CLI
echo.
echo [3/6] 检查Capacitor CLI...
call npx cap --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 正在安装Capacitor CLI...
    call npm install -g @capacitor/cli @capacitor/android
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] Capacitor安装失败
        pause
        exit /b 1
    )
    echo [✓] Capacitor CLI安装完成
) else (
    for /f "tokens=*" %%i in ('npx cap --version') do set CAP_VERSION=%%i
    echo [✓] Capacitor CLI已安装 (v!CAP_VERSION!)
)

:: 步骤4: 初始化Capacitor
echo.
echo [4/6] 初始化Capacitor...
if not exist capacitor.config.json (
    echo 正在初始化Capacitor...
    call npx cap init health-app com.healthapp.lifecircle "全生命周期健康" --web-dir=frontend/build
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] Capacitor初始化失败
        pause
        exit /b 1
    )
    echo [✓] Capacitor初始化完成
) else (
    echo [✓] Capacitor已初始化
)

:: 步骤5: 添加Android平台
echo.
echo [5/6] 添加Android平台...
if not exist android (
    echo 正在添加Android平台...
    call npx cap add android
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 添加Android平台失败
        pause
        exit /b 1
    )
    echo [✓] Android平台添加完成
) else (
    echo [✓] Android平台已存在
)

:: 步骤6: 同步代码
echo.
echo [6/6] 同步代码到Android项目...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 代码同步失败
    pause
    exit /b 1
)
echo [✓] 代码同步完成

:: 完成提示
echo.
echo ========================================
echo   [✓] 准备工作全部完成！
echo ========================================
echo.
echo 现在可以构建APK：
echo.
echo 方式1（推荐）: 使用 Android Studio
echo   - 打开 Android Studio
echo   - 导入项目: android/
echo   - 点击 Build -> Build Bundle(s) / APK(s) - Build APK(s)
echo.
echo 方式2: 命令行构建
echo   cd android
echo   ./gradlew assembleDebug
echo.
echo 构建完成后，APK位于：
echo   android/app/build/outputs/apk/debug/app-debug.apk
echo.
echo 详细说明请查看 ANDROID_BUILD.md
echo.
pause
