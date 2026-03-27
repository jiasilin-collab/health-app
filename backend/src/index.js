const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// 路由
const authRoutes = require('./routes/auth');
const nutritionRoutes = require('./routes/nutrition');
const recipeRoutes = require('./routes/recipes');
const tcmRoutes = require('./routes/tcm');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 最多100个请求
  message: '请求过于频繁，请稍后再试'
});
app.use('/api/', limiter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '全生命周期健康管理API正常运行',
    timestamp: new Date().toISOString()
  });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/tcm', tcmRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.path
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║  🚀 全生命周期健康管理App - 后端服务已启动            ║
║                                                      ║
║  📡 服务器地址: http://localhost:${PORT}               ║
║  💚 健康检查: http://localhost:${PORT}/health         ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
