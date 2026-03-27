# 📱 APK快速生成方案

## 🚀 推荐方案：使用AKP编辑器（3-5分钟）

### 第1步：准备前端代码

将前端代码打包为ZIP：
```
选中 frontend/ 文件夹
右键 → 发送到压缩(zipped)文件夹
重命名为：health-frontend.zip
```

### 第2步：访问AKP编辑器

```
https://www.apkpkaer.com/
```

### 第3步：注册/登录

- 使用手机号或邮箱注册
- 完成手机验证
- 登录账号

### 第4步：创建新应用

1. 点击"创建新应用"
2. 选择平台：React
3. 点击下一步

### 第5步：上传ZIP文件

1. 上传 `health-frontend.zip`
2. 等待上传完成

### 第6步：配置应用

- **应用名称**：全生命周期健康
- **包名**：com.healthapp.lifecircle
- **版本**：1.0.0
- **图标**：上传512x512px PNG（可选，有默认图标）
- **启动图**：上传启动图（可选）

### 第7步：构建APK

1. 点击"构建APK"
2. 等待3-5分钟
3. 构建完成后下载

---

## 📋 5步快速生成APK

### 步骤1：准备ZIP文件

```
frontend/ → 右键压缩 → health-frontend.zip
```

### 步骤2：访问网站

```
https://www.apkpkaer.com/
```

### 步骤3：注册登录

- 手机号注册
- 短信验证
- 完成登录

### 步骤4：上传配置

- 上传ZIP
- 填写应用信息
- 上传图标（可选）

### 步骤5：构建下载

- 点击构建
- 等待完成
- 下载APK

---

## 📦 APK下载后

### 安装到手机

**方法1：USB安装**
```bash
adb install [APK文件]
```

**方法2：直接安装**
1. 将APK复制到手机
2. 文件管理器中找到APK
3. 点击安装
4. 允许未知来源

### 启动应用

找到"全生命周期健康"图标，点击打开

---

## ⚠️ 重要提示

### Mock API连接

**应用启动后，需要连接到Mock API：**

**获取电脑IP：**
```bash
# Windows
ipconfig
# 查找 IPv4 地址，例如：192.168.1.100

# Mac/Linux
ifconfig
# 查找 inet 地址
```

**在手机上访问：**
```
http://[电脑IP]:3000
```

**例如：**
```
http://192.168.1.100:3000
```

### 确保Mock API运行

Mock API服务器应该已在后台运行：
```
访问：http://localhost:3000/health
应该看到：{"status":"ok","message":"Mock API运行中"}
```

---

## 💡 快速命令

```bash
# 检查Mock API
curl http://localhost:3000/health

# 获取电脑IP（Windows）
ipconfig

# 检查端口占用
netstat -ano | findstr :3000

# ADB安装APK
adb install [APK文件路径]
```

---

## 🎯 开始吧！

1. **打包前端为ZIP**
2. **访问AKP编辑器**
3. **上传并配置**
4. **构建APK**
5. **下载并安装**

**预计时间：3-5分钟**

---

_详细指南：APK_BUILD_GUIDE.md  
开始生成你的APK吧！🎉_
