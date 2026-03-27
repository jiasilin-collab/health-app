# 全生命周期健康管理App

## 📱 Android APK构建方案

### 🚀 快速开始

#### 方式1：一键构建（推荐）

**Windows用户：**
```bash
双击运行: build-android.bat
```

**Linux/Mac用户：**
```bash
chmod +x build-android.sh
./build-android.sh
```

#### 方式2：手动构建

```bash
# 1. 构建前端
cd frontend
npm run build
cd ..

# 2. 安装Capacitor
npm install -g @capacitor/cli @capacitor/android

# 3. 初始化
npx cap init health-app com.healthapp.lifecircle "全生命周期健康" --web-dir=frontend/build

# 4. 添加Android平台
npx cap add android

# 5. 同步代码
npx cap sync android

# 6. 构建APK
npx cap build android
```

---

## 📁 项目结构

```
health-app/
├── frontend/              # React Web应用
│   ├── build/            # 构建输出（Capacitor使用）
│   └── src/
├── android/              # Android原生项目（Capacitor自动创建）
├── capacitor.config.json  # Capacitor配置
├── build-android.bat      # Windows构建脚本
├── build-android.sh       # Linux/Mac构建脚本
├── ANDROID_BUILD.md      # Android构建详细指南
├── ANDROID_QUICKSTART.md # Android快速开始
└── README.md            # 项目文档
```

---

## 🎨 应用配置

### 应用信息
- **名称**: 全生命周期健康
- **包名**: com.healthapp.lifecircle
- **版本**: 1.0.0
- **图标**: 需要提供512x512px PNG
- **主题色**: #52c41a（绿色）

### 功能特性
- ✅ 响应式设计（自动适配所有屏幕）
- ✅ 用户认证系统
- ✅ 微量元素检测
- ✅ 营养食谱推荐
- ✅ 中医体质辨识
- ✅ 个人健康管理
- ✅ Mock API（无需数据库）

---

## 📋 构建步骤详解

### 步骤1：环境检查

**必需工具：**
- Node.js (16.x+)
- npm
- Android Studio（或仅Android SDK）
- Java JDK (11或17)

**检查命令：**
```bash
node --version
npm --version
java -version
```

### 步骤2：构建前端

```bash
cd frontend
npm run build
```

**说明：**
- React应用构建到 `frontend/build` 目录
- Capacitor使用这个目录作为Web内容

### 步骤3：初始化Capacitor

```bash
npx cap init health-app com.healthapp.lifecircle "全生命周期健康"
```

**生成文件：**
- `capacitor.config.json` - Capacitor配置
- `ios/` - iOS项目（如果添加）
- `android/` - Android项目（如果添加）

### 步骤4：添加Android平台

```bash
npx cap add android
```

**创建内容：**
- 完整的Android项目结构
- Gradle构建配置
- AndroidManifest.xml

### 步骤5：同步代码

```bash
npx cap sync android
```

**同步内容：**
- 插件配置
- Web资源
- 配置文件

### 步骤6：构建APK

**方式1：使用Android Studio**
1. 打开Android Studio
2. 打开 `android/` 目录
3. 点击 Build -> Build APK(s)

**方式2：使用Gradle**
```bash
cd android
./gradlew assembleDebug
```

**方式3：使用Capacitor CLI**
```bash
npx cap build android
```

---

## 📦 APK输出

### Debug版本
- **位置**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **用途**: 测试和调试
- **签名**: Debug签名（不可发布）

### Release版本
- **位置**: `android/app/build/outputs/apk/release/app-release-unsigned.apk`
- **用途**: 发布到应用商店
- **签名**: 需要手动签名

---

## 🔐 签名与发布

### 生成密钥库

```bash
keytool -genkey -v -keystore health-app.keystore \
  -alias healthapp \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass yourpassword \
  -keypass yourpassword
```

### 签名APK

```bash
jarsigner -verbose -sigalg SHA1withRSA \
  -digestalg SHA1 \
  -keystore health-app.keystore \
  -storepass yourpassword \
  -keypass yourpassword \
  app-release-unsigned.apk \
  healthapp
```

### 对齐APK

```bash
zipalign -v 4 app-release-unsigned.apk app-release-signed.apk
```

---

## 📤 发布到应用商店

### Google Play Store

1. 创建开发者账号（$25）
2. 登录 [Google Play Console](https://play.google.com/console)
3. 创建新应用
4. 上传签名的APK或AAB
5. 填写应用信息
6. 上传截图和图标
7. 设置价格和分发
8. 提交审核

### 国内应用商店

| 商店 | 提交地址 | 费用 |
|------|----------|------|
| 应用宝 | https://open.myapp.com/ | 免费 |
| 360手机助手 | http://dev.360.cn/ | 免费 |
| 小米应用商店 | http://dev.xiaomi.com/ | 免费 |
| 华为应用市场 | http://developer.huawei.com/ | 免费 |
| OPPO应用商店 | http://open.oppomobile.com/ | 免费 |
| vivo应用商店 | https://dev.vivo.com.cn/ | 免费 |

---

## 💡 优化建议

### 减小APK体积

1. 启用混淆（ProGuard）
2. 移除未使用的资源
3. 压缩图片资源
4. 使用App Bundle（AAB）格式

### 提升性能

1. 优化JavaScript代码
2. 使用懒加载
3. 减少HTTP请求
4. 缓存静态资源

### 用户体验

1. 优化启动速度
2. 添加加载动画
3. 优化动画流畅度
4. 适配各种屏幕尺寸

---

## ⚠️ 常见问题

### Q1: Gradle同步失败？

**A:**
1. 检查网络连接
2. 清除Gradle缓存：`rm -rf ~/.gradle/caches/`
3. 使用国内镜像（参考ANDROID_BUILD.md）

### Q2: APK安装失败？

**A:**
1. 检查Android版本（5.0+）
2. 允许安装未知来源
3. 检查APK完整性
4. 卸载旧版本后重新安装

### Q3: 应用白屏？

**A:**
1. 重新构建前端：`cd frontend && npm run build`
2. 清除Capacitor缓存：`npx cap clean android`
3. 检查`capacitor.config.json`配置
4. 使用ADB查看日志：`adb logcat | grep health`

### Q4: 无法连接API？

**A:**
1. 确认Mock API已启动：`http://localhost:3000/health`
2. 检查手机和电脑同一网络
3. 修改API地址为电脑IP：`http://192.168.1.100:3000`

---

## 📚 相关文档

- [Android构建详细指南](ANDROID_BUILD.md)
- [Android快速开始](ANDROID_QUICKSTART.md)
- [Capacitor官方文档](https://capacitorjs.com/)
- [React官方文档](https://react.dev/)

---

## 🎯 下一步

1. ✅ 运行构建脚本
2. ✅ 安装APK到手机测试
3. ✅ 准备应用图标和截图
4. ✅ 签名Release版本
5. ✅ 提交到应用商店

---

_需要帮助请查看详细文档或提交Issue！_
