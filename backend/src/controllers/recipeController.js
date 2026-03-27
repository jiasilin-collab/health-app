const pool = require('../config/database');

// 获取食谱列表
const getRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, age_group, gender } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT recipe_id, title, description, cooking_time, difficulty,
             target_age_group, target_gender, category, image_url,
             nutrition_info, mineral_content, favorites
      FROM recipes
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (age_group) {
      paramCount++;
      query += ` AND target_age_group = $${paramCount}`;
      params.push(age_group);
    }

    if (gender) {
      paramCount++;
      query += ` AND (target_gender = $${paramCount} OR target_gender IS NULL)`;
      params.push(gender);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        recipes: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.rows.length
        }
      }
    });
  } catch (error) {
    console.error('获取食谱列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取食谱详情
const getRecipeDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM recipes WHERE recipe_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '食谱不存在' });
    }

    // 增加浏览次数
    await pool.query(
      'UPDATE recipes SET views = views + 1 WHERE recipe_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('获取食谱详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 搜索食谱
const searchRecipes = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    if (!keyword) {
      return res.status(400).json({ error: '搜索关键词不能为空' });
    }

    const result = await pool.query(
      `SELECT recipe_id, title, description, image_url, category
       FROM recipes
       WHERE title ILIKE $1 OR description ILIKE $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${keyword}%`, parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: {
        recipes: result.rows,
        keyword
      }
    });
  } catch (error) {
    console.error('搜索食谱错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 收藏食谱
const favoriteRecipe = async (req, res) => {
  try {
    const { userId } = req.user;
    const { recipeId } = req.body;

    await pool.query(
      `INSERT INTO user_favorites (user_id, recipe_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, recipe_id) DO NOTHING`,
      [userId, recipeId]
    );

    // 更新收藏数
    await pool.query(
      `UPDATE recipes
       SET favorites = (SELECT COUNT(*) FROM user_favorites WHERE recipe_id = $1)
       WHERE recipe_id = $1`,
      [recipeId]
    );

    res.json({
      success: true,
      message: '收藏成功'
    });
  } catch (error) {
    console.error('收藏食谱错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 取消收藏
const unfavoriteRecipe = async (req, res) => {
  try {
    const { userId } = req.user;
    const { recipeId } = req.params;

    await pool.query(
      'DELETE FROM user_favorites WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipeId]
    );

    // 更新收藏数
    await pool.query(
      `UPDATE recipes
       SET favorites = (SELECT COUNT(*) FROM user_favorites WHERE recipe_id = $1)
       WHERE recipe_id = $1`,
      [recipeId]
    );

    res.json({
      success: true,
      message: '取消收藏成功'
    });
  } catch (error) {
    console.error('取消收藏错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = {
  getRecipes,
  getRecipeDetail,
  searchRecipes,
  favoriteRecipe,
  unfavoriteRecipe
};
