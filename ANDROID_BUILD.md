# 全生命周期健康管理App - Android构建指南

## 📱 Android APK构建方式

### 方式1：使用Capacitor（推荐）

Capacitor可以将现有的React Web应用打包为原生Android应用，无需重写代码。

#### 步骤1：安装Capacitor CLI

```bash
npm install -g @capacitor/cli @capacitor/android
```

#### 步骤2：构建前端

```bash
cd frontend
npm run build
```

#### 步骤3：初始化Capacitor

```bash
cd ..
npx cap init

# 配置信息：
# App Name: 全生命周期健康
# App ID: com.healthapp.lifecircle
# Web Directory: frontend/build
```

#### 步骤4：添加Android平台

```bash
npx cap add android
```

#### 步骤5：同步代码

```bash
npx cap sync android
```

#### 步骤6：构建APK

```bash
npx cap build android
```

构建完成后，APK文件位于：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

### 方式2：使用Cordova（备选）

#### 步骤1：安装Cordova

```bash
npm install -g cordova
```

#### 步骤2：创建Cordova项目

```bash
cordova create health-android com.healthapp.lifecircle "全生命周期健康"
cd health-android
```

#### 步骤3：复制前端文件

```bash
# 构建前端
cd ../frontend
npm run build

# 复制到Cordova的www目录
xcopy build ..\health-android\www\ /E /I /Y
```

#### 步骤4：添加Android平台

```bash
cd ../health-android
cordova platform add android
```

#### 步骤5：构建APK

```bash
cordova build android
```

构建完成后，APK文件位于：
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 快速构建脚本（Capacitor方式）

我已经创建了 `build-android.bat` 脚本，一键完成所有步骤。

### Windows使用：

```bash
# 双击运行
build-android.bat
```

### Linux/Mac使用：

```bash
chmod +x build-android.sh
./build-android.sh
```

---

## 📋 构建前的准备工作

### 1. 安装Android Studio

- 下载：https://developer.android.com/studio
- 安装Android SDK（API Level 30+）
- 配置环境变量：ANDROID_HOME

### 2. 安装Java JDK

- 推荐：JDK 11或17
- 下载：https://www.oracle.com/java/technologies/downloads/

### 3. 配置环境变量

```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-17
set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk

# Linux/Mac
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

---

## 🎨 Android应用图标配置

### 图标要求

- 尺寸：512x512px（PNG格式）
- 命名：icon.png
- 放在 `resources/android/` 目录

### 生成图标

```bash
# 使用工具生成不同尺寸的图标
npm install -g cordova-res
npx cordova-res resources/icon.png --skip-config --copy resources/android/
```

---

## 🎯 签名与发布

### Debug版本（测试用）

```bash
npx cap build android
# 或
cordova build android
```

### Release版本（发布用）

```bash
# 创建密钥库
keytool -genkey -v -keystore health-app.keystore -alias healthapp -keyalg RSA -keysize 2048 -validity 10000

# 构建Release版本
npx cap build android --prod

# APK位置：android/app/build/outputs/apk/release/app-release-unsigned.apk

# 签名APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore health-app.keystore app-release-unsigned.apk healthapp

# 对齐APK
zipalign -v 4 app-release-unsigned.apk app-release-signed.apk
```

---

## 📤 上传到应用商店

### Google Play Store

1. 创建Google Play开发者账号（$25一次性费用）
2. 登录 [Google Play Console](https://play.google.com/console)
3. 创建新应用
4. 上传APK文件
5. 填写应用信息
6. 上传截图和图标
7. 提交审核

### 国内应用商店

- **应用宝**：https://open.myapp.com/
- **360手机助手**：http://dev.360.cn/
- **小米应用商店**：http://dev.xiaomi.com/
- **华为应用市场**：http://developer.huawei.com/

---

## 📝 配置文件说明

### capacitor.config.json

```json
{
  "name": "health-app",
  "appId": "com.healthapp.lifecircle",
  "appName": "全生命周期健康",
  "webDir": "frontend/build",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "backgroundColor": "#52c41a"
    }
  }
}
```

### AndroidManifest.xml 修改

位置：`android/app/src/main/AndroidManifest.xml`

可配置：
- 应用权限（网络、存储、相机等）
- 应用图标
- 应用名称
- 启动Activity

---

## ⚠️ 常见问题

### Q1: 构建失败提示SDK版本错误？

**A:** 在 `android/build.gradle` 中更新 SDK 版本
```gradle
compileSdkVersion 33
targetSdkVersion 33
```

### Q2: APK安装失败？

**A:** 
1. 检查是否允许安装未知来源应用
2. 检查APK签名（Release需要签名）
3. 检查Android版本（要求5.0+）

### Q3: 应用白屏？

**A:**
1. 检查 `webDir` 配置是否正确
2. 确保前端已构建到 `build` 目录
3. 清除Capacitor缓存：`npx cap clean android`

### Q4: 无法访问API？

**A:**
在 AndroidManifest.xml 中添加网络权限：
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## 💡 优化建议

### APK体积优化

1. 启用代码压缩
2. 移除未使用的资源
3. 使用WebP格式图片
4. 启用混淆（ProGuard）

### 性能优化

1. 使用懒加载
2. 优化图片大小
3. 减少DOM操作
4. 使用虚拟列表

---

## 📞 技术支持

如有问题：
- Capacitor文档：https://capacitorjs.com/
- Cordova文档：https://cordova.apache.org/
- Android开发者文档：https://developer.android.com/

---

## 🚀 下一步

构建完成后：

1. 在Android手机或模拟器上测试
2. 检查所有功能是否正常
3. 测试不同Android版本（5.0, 6.0, 10.0, 11.0等）
4. 优化用户体验
5. 准备发布到应用商店

---

_祝你构建成功！_
