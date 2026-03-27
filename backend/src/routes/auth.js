const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 获取用户信息（需要认证）
router.get('/user', auth, authController.getUserInfo);

// 更新用户信息（需要认证）
router.put('/user', auth, authController.updateUserInfo);

module.exports = router;
