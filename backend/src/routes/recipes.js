const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');

// 获取食谱列表
router.get('/', recipeController.getRecipes);

// 获取食谱详情
router.get('/:id', recipeController.getRecipeDetail);

// 搜索食谱
router.get('/search/:keyword', recipeController.searchRecipes);

// 收藏食谱（需要认证）
router.post('/favorite', auth, recipeController.favoriteRecipe);

// 取消收藏（需要认证）
router.delete('/favorite/:recipeId', auth, recipeController.unfavoriteRecipe);

module.exports = router;
