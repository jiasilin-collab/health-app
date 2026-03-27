# 常见问题 FAQ

## 安装相关

### Q1: PostgreSQL安装后无法连接？
**A:**
1. 检查PostgreSQL服务是否启动
   - Windows: 在服务中查找 `postgresql-x64-x` 服务并启动
   - Mac/Linux: `brew services start postgresql` 或 `sudo service postgresql start`

2. 检查端口占用
   ```bash
   netstat -an | findstr 5432
   ```

3. 检查密码是否正确
   - 默认用户名: `postgres`
   - 安装时设置的密码

### Q2: npm install 安装速度慢或失败？
**A:**
1. 切换到国内镜像
   ```bash
   npm config set registry https://registry.npmmirror.com
   ```

2. 或者使用 cnpm
   ```bash
   npm install -g cnpm --registry=https://registry.npmmirror.com
   cnpm install
   ```

### Q3: 前端启动后页面空白？
**A:**
1. 检查后端是否启动
   ```bash
   curl http://localhost:3000/health
   ```

2. 检查浏览器控制台是否有错误
   - 按F12打开开发者工具
   - 查看Console标签的错误信息

3. 清除缓存重新启动
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   npm start
   ```

---

## 运行相关

### Q4: 注册时提示"该手机号已注册"？
**A:**
1. 检查数据库中是否已有该用户
   ```sql
   SELECT * FROM users WHERE phone = '你的手机号';
   ```

2. 清理测试数据
   ```bash
   # 使用 database-manager.bat 选择"清空数据"
   ```

### Q5: 登录后token过期怎么办？
**A:**
1. 默认token有效期7天
2. 过期后需要重新登录
3. 可在 `.env` 中修改 `JWT_EXPIRES_IN` 调整有效期

### Q6: 食谱图片无法显示？
**A:**
当前使用占位图片，需要：
1. 上传真实图片到服务器
2. 更新数据库中的 `image_url`
3. 或使用图床服务（阿里云OSS、七牛云等）

---

## 开发相关

### Q7: 如何添加新的微量元素？
**A:**
1. 在数据库中插入新元素
   ```sql
   INSERT INTO minerals (name, name_cn, type, description, daily_requirement_min, daily_requirement_max, unit, food_sources, deficiency_symptoms, excess_risks)
   VALUES ('Selenium', '硒', 'mineral', '抗氧化剂，增强免疫力', 55, 400, 'mcg',
     '["巴西坚果", "海鲜", "全谷物"]'::jsonb,
     '["免疫力下降", "脱发"]'::jsonb,
     '["脱发", "神经系统损伤"]'::jsonb);
   ```

2. 添加对应的年龄段需求
   ```sql
   INSERT INTO age_nutrition_requirements (age_min, age_max, age_group_name, gender, mineral_id, daily_requirement_min, daily_requirement_max, unit, notes)
   VALUES (19, 45, 'adult', 'male', (SELECT mineral_id FROM minerals WHERE name='Selenium'), 55, 400, 'mcg', '成人需求量');
   ```

3. 重启后端服务

### Q8: 如何添加新的食谱？
**A:**
1. 在数据库中插入新食谱
   ```sql
   INSERT INTO recipes (title, description, cooking_time, difficulty, target_age_group, target_gender, category, nutrition_info, mineral_content, ingredients, steps, image_url)
   VALUES ('番茄炒蛋', '简单易做的家常菜', 15, 'easy', 'adult', NULL, '补铁',
     '{"calories": 150, "protein": 8, "fat": 10, "carbs": 5}'::jsonb,
     '{"iron": 2.5, "protein": 8}'::jsonb,
     '["鸡蛋", "番茄", "葱"]'::jsonb,
     '["打散鸡蛋", "热锅下蛋", "加入番茄炒熟"]'::jsonb,
     'https://example.com/recipe.jpg');
   ```

### Q9: 如何修改端口号？
**A:**
1. 修改后端端口：编辑 `backend/.env` 中的 `PORT`
2. 修改前端默认端口：编辑 `frontend/package.json` 中的 `start` 脚本
   ```json
   "start": "PORT=3001 react-scripts start"
   ```
3. 更新前端API调用地址：在所有 `axios` 调用中修改 `http://localhost:3000`

---

## 部署相关

### Q10: 如何部署到生产环境？
**A:**

#### 后端部署
1. 准备生产环境变量
   ```bash
   NODE_ENV=production
   PORT=3000
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=health_app_prod
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   JWT_SECRET=your-strong-secret
   ```

2. 使用 PM2 保持进程运行
   ```bash
   npm install -g pm2
   pm2 start backend/src/index.js --name health-app-backend
   pm2 save
   pm2 startup
   ```

3. 配置 Nginx 反向代理
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location / {
           root /path/to/frontend/build;
           try_files $uri /index.html;
       }
   }
   ```

#### 前端部署
1. 构建生产版本
   ```bash
   cd frontend
   npm run build
   ```

2. 将 `build/` 目录部署到 Nginx/Apache

3. 配置正确的 API 地址（在 `.env` 或代码中）

### Q11: 如何配置HTTPS？
**A:**
1. 使用 Let's Encrypt 免费证书
   ```bash
   certbot certonly --webroot -w /var/www/html -d your-domain.com
   ```

2. 配置 Nginx SSL
   ```nginx
   server {
       listen 443 ssl http2;
       server_name your-domain.com;

       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

       # 其他配置...
   }
   ```

---

## 性能优化

### Q12: 如何提高API响应速度？
**A:**
1. 添加数据库索引（已配置）
2. 使用 Redis 缓存热门数据
3. 实现分页（已实现）
4. 使用 CDN 加速静态资源

### Q13: 如何优化前端加载速度？
**A:**
1. 代码分割（React Router已支持）
2. 图片懒加载
3. 启用 Gzip 压缩
4. 使用 CDN 加速

---

## 安全相关

### Q14: 如何防止SQL注入？
**A:**
- 使用参数化查询（已实现）
- 避免字符串拼接SQL
- 使用 ORM 或查询构建器

### Q15: 如何加强密码安全？
**A:**
- 使用 bcrypt 加密（已实现）
- 强制密码复杂度（可在前端添加验证）
- 实现密码重置功能

---

## 其他问题

### Q16: 如何导出数据？
**A:**
使用 `database-manager.bat` 选择"备份数据库"

### Q17: 如何查看日志？
**A:**
```bash
# 后端日志
cd backend
npm run dev  # 终端直接显示

# 或输出到文件
npm run dev > logs/server.log 2>&1
```

### Q18: 如何参与开发？
**A:**
1. Fork 项目
2. 创建特性分支
3. 提交代码
4. 提交 Pull Request

---

如有其他问题，请提交 Issue 或联系开发者。
