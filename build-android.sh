#!/bin/bash

echo ""
echo "========================================"
echo "  Android APK构建脚本"
echo "  基于 Capacitor"
echo "========================================"
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi
echo "[✓] Node.js: $(node --version)"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "[错误] 未检测到npm"
    exit 1
fi
echo "[✓] npm: $(npm --version)"

# 步骤1: 构建前端
echo ""
echo "[1/6] 构建前端应用..."
cd frontend
if [ ! -d "build" ]; then
    echo "正在构建前端..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "[错误] 前端构建失败"
        exit 1
    fi
    echo "[✓] 前端构建完成"
else
    echo "[✓] 前端build已存在，跳过构建"
fi

# 步骤2: 检查Capacitor
echo ""
echo "[2/6] 检查Capacitor..."
if ! command -v npx &> /dev/null; then
    echo "[错误] 未检测到npx"
    exit 1
fi

cd ..

# 步骤3: 安装Capacitor CLI
echo ""
echo "[3/6] 检查Capacitor CLI..."
npx cap --version &> /dev/null
if [ $? -ne 0 ]; then
    echo "正在安装Capacitor CLI..."
    npm install -g @capacitor/cli @capacitor/android
    if [ $? -ne 0 ]; then
        echo "[错误] Capacitor安装失败"
        exit 1
    fi
    echo "[✓] Capacitor CLI安装完成"
else
    CAP_VERSION=$(npx cap --version)
    echo "[✓] Capacitor CLI已安装 (v$CAP_VERSION)"
fi

# 步骤4: 初始化Capacitor
echo ""
echo "[4/6] 初始化Capacitor..."
if [ ! -f "capacitor.config.json" ]; then
    echo "正在初始化Capacitor..."
    npx cap init health-app com.healthapp.lifecircle "全生命周期健康" --web-dir=frontend/build
    if [ $? -ne 0 ]; then
        echo "[错误] Capacitor初始化失败"
        exit 1
    fi
    echo "[✓] Capacitor初始化完成"
else
    echo "[✓] Capacitor已初始化"
fi

# 步骤5: 添加Android平台
echo ""
echo "[5/6] 添加Android平台..."
if [ ! -d "android" ]; then
    echo "正在添加Android平台..."
    npx cap add android
    if [ $? -ne 0 ]; then
        echo "[错误] 添加Android平台失败"
        exit 1
    fi
    echo "[✓] Android平台添加完成"
else
    echo "[✓] Android平台已存在"
fi

# 步骤6: 同步代码
echo ""
echo "[6/6] 同步代码到Android项目..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "[错误] 代码同步失败"
    exit 1
fi
echo "[✓] 代码同步完成"

# 完成提示
echo ""
echo "========================================"
echo "  [✓] 准备工作全部完成！"
echo "========================================"
echo ""
echo "现在可以构建APK："
echo ""
echo "方式1（推荐）: 使用 Android Studio"
echo "  - 打开 Android Studio"
echo "  - 导入项目: android/"
echo "  - 点击 Build -> Build Bundle(s) / APK(s) -> Build APK(s)"
echo ""
echo "方式2: 命令行构建"
echo "  cd android"
echo "  ./gradlew assembleDebug"
echo ""
echo "构建完成后，APK位于："
echo "  android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "详细说明请查看 ANDROID_BUILD.md"
echo ""
