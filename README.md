# 全生命周期健康管理App

一款基于性别、年龄分层的个性化健康管理手机应用，涵盖微量元素分析、营养食谱推荐、中医理疗等功能。

## 📱 功能特性

### 核心功能
- ✅ **微量元素检测** - 自测问卷 + 智能推荐 + 缺乏分析
- 🥗 **营养食谱** - 个性化食谱 + 季节推荐 + 购物清单
- 🩺 **中医理疗** - 体质辨识 + 穴位按摩 + 节气养生
- 📊 **健康监测** - 数据记录 + 可视化报告
- 👤 **用户管理** - 注册/登录 + 个人信息 + BMI计算

### 技术特点
- 🚀 响应式设计，适配手机/平板/桌面
- 💾 PostgreSQL数据库，支持复杂查询
- 🔐 JWT认证，安全可靠
- 🎨 Ant Design UI组件库
- ⚡ React Router路由管理

---

## 📁 项目结构

```
health-app/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── config/        # 配置文件
│   │   │   └── database.js
│   │   ├── controllers/    # 控制器
│   │   │   ├── authController.js
│   │   │   ├── nutritionController.js
│   │   │   ├── recipeController.js
│   │   │   └── tcmController.js
│   │   ├── routes/        # 路由
│   │   │   ├── auth.js
│   │   │   ├── nutrition.js
│   │   │   ├── recipes.js
│   │   │   └── tcm.js
│   │   ├── middleware/    # 中间件
│   │   │   └── auth.js
│   │   └── index.js     # 入口文件
│   ├── package.json
│   └── .env.example
│
├── frontend/               # 前端应用
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/
│   │   │       └── MainLayout.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Home.js
│   │   │   ├── Nutrition.js
│   │   │   ├── Recipes.js
│   │   │   ├── RecipeDetail.js
│   │   │   ├── Tcm.js
│   │   │   ├── ConstitutionAssessment.js
│   │   │   ├── ConstitutionResult.js
│   │   │   ├── Profile.js
│   │   │   └── MineralDetail.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── database/               # 数据库
│   └── schema.sql
│
├── start.bat              # Windows一键启动脚本
├── start.sh               # Linux/Mac一键启动脚本
├── start-all.bat          # Windows同时启动前后端
├── start-all.sh           # Linux/Mac同时启动前后端
├── database-manager.bat    # 数据库管理工具（Windows）
├── .gitignore
├── CHANGELOG.md          # 更新日志
├── FAQ.md               # 常见问题
├── QUICKSTART.md         # 快速开始指南
└── README.md             # 本文件
```

---

## 🚀 快速开始

### 方式1：使用一键启动脚本（推荐）

**Windows用户：**
```bash
# 双击运行
start.bat
```

**Linux/Mac用户：**
```bash
chmod +x start.sh
./start.sh
```

脚本会自动完成：环境检查、依赖安装、数据库创建、数据表导入

详细说明请查看 [QUICKSTART.md](QUICKSTART.md)

### 方式2：手动启动

#### 环境要求

- Node.js >= 16.x
- PostgreSQL >= 13.x
- npm 或 yarn

#### 后端安装

```bash
cd backend
npm install
cp .env.example .env
# 编辑 .env 文件，配置数据库连接信息
```

#### 创建数据库

```bash
# 登录PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE health_app;

# 导入Schema
psql -U postgres -d health_app -f ../database/schema.sql
```

#### 启动后端

```bash
cd backend
npm run dev
```

后端服务将在 `http://localhost:3000` 启动

#### 前端安装

```bash
cd frontend
npm install
```

#### 启动前端

```bash
cd frontend
npm start
```

前端应用将在 `http://localhost:3000` 启动

---

## 📡 API文档

### 认证相关

#### 用户注册
```
POST /api/auth/register
Body: { phone, password, nickname }
Response: { success, data: { user, token } }
```

#### 用户登录
```
POST /api/auth/login
Body: { phone, password }
Response: { success, data: { user, token } }
```

#### 获取用户信息
```
GET /api/auth/user
Headers: { Authorization: Bearer <token> }
Response: { success, data: user }
```

### 营养相关

#### 获取微量元素列表
```
GET /api/nutrition/minerals
Response: { success, data: minerals[] }
```

#### 获取营养推荐
```
GET /api/nutrition/recommendation?age=25&gender=male
Response: { success, data: recommendations[] }
```

#### 微量元素自测
```
POST /api/nutrition/self-test
Headers: { Authorization: Bearer <token> }
Body: { symptoms, lifestyle, diet }
Response: { success, data: { risks, recommendations } }
```

### 食谱相关

#### 获取食谱列表
```
GET /api/recipes?page=1&limit=20&category=补钙
Response: { success, data: { recipes[], pagination } }
```

#### 获取食谱详情
```
GET /api/recipes/:id
Response: { success, data: recipe }
```

#### 搜索食谱
```
GET /api/recipes/search/:keyword
Response: { success, data: { recipes[], keyword } }
```

#### 收藏食谱
```
POST /api/recipes/favorite
Headers: { Authorization: Bearer <token> }
Body: { recipeId }
Response: { success, message }
```

### 中医相关

#### 获取体质类型
```
GET /api/tcm/constitutions
Response: { success, data: constitutions[] }
```

#### 体质评估
```
POST /api/tcm/assessment
Headers: { Authorization: Bearer <token> }
Body: { answers: [] }
Response: { success, data: { constitution, scores, details } }
```

---

## 🗄️ 数据库Schema

### 主要数据表

1. **users** - 用户表
2. **minerals** - 微量元素库
3. **age_nutrition_requirements** - 年龄段营养需求
4. **recipes** - 食谱表
5. **tcm_constitutions** - 中医体质表
6. **user_constitutions** - 用户体质评估记录
7. **health_records** - 健康数据记录
8. **user_favorites** - 用户收藏表
9. **reminders** - 提醒记录表

完整Schema请查看 `database/schema.sql`

---

## 🎨 界面预览

### 首页
- 统计卡片（用户数、食谱数、收藏数）
- 今日营养均衡度
- 推荐食谱

### 微量元素
- 元素列表卡片展示
- 搜索功能
- 详情弹窗

### 食谱
- 分类筛选
- 搜索功能
- 卡片展示

### 中医理疗
- 体质辨识问卷
- 评估结果展示
- 养生建议

---

## 🛠️ 工具脚本

### Windows工具
- **start.bat** - 一键启动（检查环境、安装依赖、创建数据库）
- **start-all.bat** - 同时启动前后端服务
- **database-manager.bat** - 数据库管理工具（创建/删除/备份/恢复）

### Linux/Mac工具
- **start.sh** - 一键启动（同Windows版本）
- **start-all.sh** - 同时启动前后端服务

---

## 🔧 技术栈

### 后端
- Node.js + Express.js
- PostgreSQL
- JWT认证
- bcryptjs密码加密
- helmet安全中间件

### 前端
- React 18
- React Router 6
- Ant Design 5
- Axios HTTP客户端
- Day.js日期处理

---

## 📝 待开发功能

- [ ] 健康数据可视化图表
- [ ] 提醒系统
- [ ] 食谱收藏列表
- [ ] 消息通知
- [ ] 社区互动
- [ ] 专家问答
- [ ] 电商对接
- [ ] 设备接入

---

## 📚 文档

- 📖 [QUICKSTART.md](QUICKSTART.md) - 快速开始指南
- 📝 [CHANGELOG.md](CHANGELOG.md) - 更新日志
- ❓ [FAQ.md](FAQ.md) - 常见问题解答

---

## 🐛 问题反馈

如有问题，请：
1. 查看 [FAQ.md](FAQ.md) 常见问题
2. 搜索已提交的 Issues
3. 提交新的 Issue

---

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 开源协议

MIT License

---

## 📞 联系方式

如有问题，请提交 Issue 或联系开发者。

---

_本项目正在持续开发中，欢迎反馈和建议！_
