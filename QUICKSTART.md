# 🚀 快速开始指南

## 第一次使用？3步启动！

### 步骤1: 准备环境

**必须安装：**
- ✅ Node.js (16.x+) - https://nodejs.org/
- ✅ PostgreSQL (13.x+) - https://www.postgresql.org/download/

**可选安装：**
- Git - 用于版本控制

---

### 步骤2: 一键启动

#### Windows用户：
```bash
# 双击运行
start.bat
```

#### Linux/Mac用户：
```bash
# 运行启动脚本
chmod +x start.sh
./start.sh
```

**脚本会自动完成：**
1. ✅ 检查Node.js和PostgreSQL
2. ✅ 安装所有依赖
3. ✅ 创建环境配置文件
4. ✅ 创建数据库
5. ✅ 导入数据表结构

---

### 步骤3: 配置并运行

1. **编辑数据库配置**
   ```bash
   # Windows
   notepad backend\.env

   # Mac/Linux
   vim backend/.env
   ```

   修改这些配置：
   ```env
   DB_PASSWORD=your_postgresql_password
   JWT_SECRET=change_this_to_random_string
   ```

2. **分别启动前后端**
   
   **方式A（推荐）：分别启动**
   
   打开两个终端：
   ```bash
   # 终端1 - 后端
   cd backend
   npm run dev

   # 终端2 - 前端
   cd frontend
   npm start
   ```
   
   **方式B：同时启动（Windows）**
   ```bash
   # 双击
   start-all.bat
   ```

3. **访问应用**
   - 前端: http://localhost:3000
   - 后端: http://localhost:3000/health

---

## 📱 测试账号

首次使用请先注册，或使用测试账号：

**测试账号：**
- 手机号: 13800138000
- 密码: 123456

---

## 🐛 常见问题

### 问题1: PostgreSQL密码提示
**解决：**
```bash
# Windows
set PGPASSWORD=your_password
psql -U postgres -c "SELECT 1;"

# Mac/Linux
PGPASSWORD=your_password psql -U postgres -c "SELECT 1;"
```

### 问题2: 端口已被占用
**解决：**
```bash
# Windows - 查看占用进程
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### 问题3: npm install 慢
**解决：使用国内镜像**
```bash
npm config set registry https://registry.npmmirror.com
```

---

## 📚 文档导航

- 📖 [README.md](README.md) - 完整项目文档
- 📝 [CHANGELOG.md](CHANGELOG.md) - 更新日志
- ❓ [FAQ.md](FAQ.md) - 常见问题解答
- 🗄️ [database/schema.sql](database/schema.sql) - 数据库设计

---

## 🎯 下一步

1. ✅ 体验应用功能
2. ✅ 查看API接口文档
3. ✅ 修改配置参数
4. ✅ 添加新的食谱/微量元素
5. ✅ 开发新功能

---

## 💡 提示

- 首次启动可能需要5-10分钟下载依赖
- 建议使用 VS Code 或 WebStorm 打开项目
- 代码已包含详细注释，方便理解和修改
- 遇到问题请查看 [FAQ.md](FAQ.md)

---

_祝使用愉快！🌿_
