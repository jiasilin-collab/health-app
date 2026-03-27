# 📱 Android APK构建完成

## ✅ 已创建文件（共6个）

| 文件 | 说明 |
|------|------|
| `capacitor.config.json` | Capacitor配置文件 |
| `build-android.bat` | Windows一键构建脚本 |
| `build-android.sh` | Linux/Mac一键构建脚本 |
| `ANDROID_QUICKSTART.md` | Android快速开始指南 |
| `ANDROID_BUILD.md` | 完整Android构建指南 |
| `ANDROID_README.md` | Android项目说明 |

---

## 🚀 立即开始构建

### Windows用户（推荐）

```bash
# 双击运行
build-android.bat
```

**脚本会自动完成：**
1. ✅ 检查Node.js和npm
2. ✅ 构建前端React应用
3. ✅ 检查并安装Capacitor CLI
4. ✅ 初始化Capacitor配置
5. ✅ 添加Android平台
6. ✅ 同步代码到Android项目

### Linux/Mac用户

```bash
chmod +x build-android.sh
./build-android.sh
```

---

## 📋 构建步骤说明

### 1. 环境要求

**必需：**
- Node.js (16.x+)
- npm
- Android Studio 或 Android SDK
- Java JDK (11或17)

**安装检查：**
```bash
node --version
npm --version
java -version
```

### 2. 构建方式

#### 方式1：一键构建脚本（推荐）

**Windows：**
```bash
build-android.bat
```

**Linux/Mac：**
```bash
build-android.sh
```

#### 方式2：使用Android Studio

1. 运行构建脚本（完成前6步）
2. 打开Android Studio
3. 导入项目：`android/`
4. 点击 Build → Build APK(s)

#### 方式3：使用Gradle命令

```bash
cd android
./gradlew assembleDebug
```

---

## 📦 APK输出位置

```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎨 应用配置

### 应用信息
- **名称**: 全生命周期健康
- **包名**: com.healthapp.lifecircle
- **版本**: 1.0.0
- **主题色**: #52c41a

### 配置文件
- `capacitor.config.json` - Capacitor配置
- `android/app/src/main/AndroidManifest.xml` - Android清单
- `android/app/build.gradle` - Gradle构建配置

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

1. 复制APK文件到手机
2. 在手机文件管理器中找到APK
3. 点击安装
4. 允许安装未知来源（如果提示）

---

## 🔧 自定义配置

### 修改应用名称

编辑 `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">你的应用名称</string>
```

### 修改应用图标

1. 准备512x512px PNG图标
2. 复制到 `resources/android/icon.png`
3. 运行 `npx cap sync android`

### 添加权限

编辑 `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## ⚠️ 常见问题

### Q: 构建失败提示SDK版本错误？

**A:** 编辑 `android/build.gradle`:
```gradle
compileSdkVersion 33
targetSdkVersion 33
```

### Q: APK安装失败？

**A:**
1. 检查Android版本（5.0+）
2. 允许安装未知来源
3. 检查APK完整性
4. 卸载旧版本

### Q: 应用白屏？

**A:**
1. 重新构建前端
2. 清除Capacitor缓存
3. 检查配置

### Q: 无法连接API？

**A:**
1. 确认Mock API已启动
2. 使用电脑IP而非localhost
3. 检查网络权限

---

## 🚀 快速命令参考

```bash
# 构建前端
cd frontend && npm run build

# 同步到Android
cd .. && npx cap sync android

# 构建APK
npx cap build android

# 清除缓存
npx cap clean android

# 在Android上运行
npx cap run android

# 复制到设备
npx cap copy android

# 打开Android Studio
npx cap open android
```

---

## 📚 详细文档

- [Android快速开始](ANDROID_QUICKSTART.md)
- [Android构建详细指南](ANDROID_BUILD.md)
- [Capacitor官方文档](https://capacitorjs.com/)
- [Android开发者文档](https://developer.android.com/)

---

## 💡 优化建议

### APK体积优化
1. 启用混淆（ProGuard）
2. 移除未使用资源
3. 压缩图片
4. 使用App Bundle格式

### 性能优化
1. 优化JavaScript
2. 使用懒加载
3. 减少HTTP请求
4. 缓存静态资源

---

## 📤 发布到应用商店

### 准备工作
1. ✅ 准备应用图标
2. ✅ 准备应用截图（至少2张）
3. ✅ 生成密钥库
4. ✅ 签名Release APK
5. ✅ 测试所有功能

### Google Play Store
1. 创建开发者账号（$25）
2. 登录Google Play Console
3. 创建新应用
4. 上传APK或AAB
5. 填写应用信息
6. 提交审核

### 国内应用商店
- 应用宝、360、小米、华为、OPPO、vivo
- 大部分免费，需要注册开发者账号

---

## 📊 构建状态

```
Capacitor配置: ████████████████████ 100%
构建脚本: ████████████████████ 100%
文档编写: ████████████████████ 100%
```

**总进度：███████████████████ 100%**

---

## 🎯 下一步

1. ✅ 运行构建脚本
2. ✅ 安装APK到手机
3. ✅ 测试所有功能
4. ✅ 准备发布材料
5. ✅ 提交到应用商店

---

_构建配置已完成！祝你APK构建成功！🎉_
