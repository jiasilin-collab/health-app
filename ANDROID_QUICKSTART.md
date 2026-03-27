# Android构建快速开始

## 🚀 一键构建

### Windows用户：
```bash
双击运行: build-android.bat
```

### Linux/Mac用户：
```bash
chmod +x build-android.sh
./build-android.sh
```

---

## 📋 构建步骤说明

脚本会自动完成以下步骤：

1. ✅ 检查Node.js和npm环境
2. ✅ 构建前端React应用（`npm run build`）
3. ✅ 检查并安装Capacitor CLI
4. ✅ 初始化Capacitor配置
5. ✅ 添加Android平台
6. ✅ 同步Web代码到Android项目

---

## 🏗️ 构建APK

### 方式1：使用Android Studio（推荐）

1. 安装 [Android Studio](https://developer.android.com/studio)
2. 打开Android Studio
3. 选择 `Open an Existing Project`
4. 导入项目：`C:\Users\86176\.openclaw\workspace\health-app\android\`
5. 等待Gradle同步完成
6. 点击菜单：`Build > Build Bundle(s) / APK(s) > Build APK(s)`
7. 选择 `debug` 或 `release`
8. 等待构建完成

### 方式2：使用Gradle命令行

```bash
cd android
./gradlew assembleDebug
```

### 方式3：使用Capacitor CLI

```bash
npx cap build android
```

---

## 📦 APK输出位置

```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 安装到手机

### USB调试安装

```bash
# 1. 启用USB调试
# 手机设置 > 开发者选项 > USB调试

# 2. 连接手机到电脑

# 3. 使用ADB安装
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 4. 启动应用
adb shell am start -n com.healthapp.lifecircle/.MainActivity
```

### 直接安装APK

1. 将APK文件复制到手机
2. 在手机上打开文件管理器
3. 找到APK文件
4. 点击安装
5. 允许安装未知来源应用（如果提示）

---

## 🎨 自定义应用图标

### 1. 准备图标文件

- 尺寸：512x512px（PNG格式）
- 命名：`icon.png`
- 透明背景（推荐）

### 2. 复制到资源目录

```bash
mkdir -p resources/android
cp your-icon.png resources/android/icon.png
```

### 3. 更新配置

编辑 `capacitor.config.json`：
```json
{
  "plugins": {
    "SplashScreen": {
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP"
    }
  }
}
```

### 4. 重新同步

```bash
npx cap sync android
```

---

## ⚙️ 修改应用配置

### 修改应用名称

编辑 `android/app/src/main/res/values/strings.xml`：
```xml
<string name="app_name">全生命周期健康</string>
```

### 修改应用包名

编辑 `capacitor.config.json`：
```json
{
  "appId": "com.healthapp.lifecircle"
}
```

### 添加权限

编辑 `android/app/src/main/AndroidManifest.xml`：
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

---

## 🔧 常见问题

### Q: 构建时Gradle同步失败？

**A:**
1. 检查网络连接
2. 清除Gradle缓存
3. 尝试使用国内镜像

```gradle
// android/build.gradle
repositories {
    maven { url 'https://maven.aliyun.com/repository/google' }
    maven { url 'https://maven.aliyun.com/repository/public' }
    maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }
}
```

### Q: APK安装失败？

**A:**
1. 检查Android版本（要求5.0+）
2. 允许安装未知来源应用
3. 检查APK是否完整
4. 清除手机上旧版本后重新安装

### Q: 应用启动白屏？

**A:**
1. 检查前端构建是否成功
2. 清除Capacitor缓存：`npx cap clean android`
3. 检查`webDir`配置是否正确

### Q: 无法连接到API？

**A:**
1. 确认Mock API服务器已启动
2. 检查手机和电脑在同一网络
3. 确认API地址正确（使用电脑IP而不是localhost）

---

## 📚 详细文档

- [完整Android构建指南](ANDROID_BUILD.md)
- [Capacitor官方文档](https://capacitorjs.com/)
- [Android开发者文档](https://developer.android.com/)

---

## 🎯 下一步

1. ✅ 运行构建脚本
2. ✅ 安装APK到手机测试
3. ✅ 检查所有功能是否正常
4. ✅ 优化用户体验
5. ✅ 准备发布到应用商店

---

_祝你构建成功！🎉_
