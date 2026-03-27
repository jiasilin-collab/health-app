const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const auth = require('../middleware/auth');

// 获取所有微量元素
router.get('/minerals', nutritionController.getAllMinerals);

// 获取单个微量元素详情
router.get('/minerals/:id', nutritionController.getMineralDetail);

// 获取营养推荐
router.get('/recommendation', nutritionController.getNutritionRecommendation);

// 微量元素自测（需要认证）
router.post('/self-test', auth, nutritionController.mineralSelfTest);

module.exports = router;
