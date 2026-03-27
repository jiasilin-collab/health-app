const pool = require('../config/database');

// 获取所有微量元素
const getAllMinerals = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM minerals ORDER BY type, name'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('获取微量元素错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取单个微量元素详情
const getMineralDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM minerals WHERE mineral_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '微量元素不存在' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('获取微量元素详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 根据年龄和性别获取营养推荐
const getNutritionRecommendation = async (req, res) => {
  try {
    const { age, gender } = req.query;

    if (!age || !gender) {
      return res.status(400).json({ error: '年龄和性别不能为空' });
    }

    // 查询对应的营养需求
    const result = await pool.query(
      `SELECT anr.*, m.name, m.name_cn, m.type, m.unit
       FROM age_nutrition_requirements anr
       JOIN minerals m ON anr.mineral_id = m.mineral_id
       WHERE anr.age_min <= $1
         AND anr.age_max >= $1
         AND (anr.gender = $2 OR anr.gender IS NULL)
       ORDER BY m.type, m.name`,
      [parseInt(age), gender]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('获取营养推荐错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 微量元素自测问卷（简化版）
const mineralSelfTest = async (req, res) => {
  try {
    const { userId } = req.user;
    const { symptoms, lifestyle, diet } = req.body;

    // 简化的决策树算法
    const risks = [];

    // 症状分析
    if (symptoms?.includes('fatigue')) {
      risks.push({ mineral: '铁', reason: '疲劳可能是缺铁的症状之一' });
    }
    if (symptoms?.includes('muscle_cramps')) {
      risks.push({ mineral: '钙', reason: '肌肉抽搐可能是缺钙的症状之一' });
    }
    if (symptoms?.includes('poor_immunity')) {
      risks.push({ mineral: '锌', reason: '免疫力下降可能与缺锌有关' });
    }

    // 饮食分析
    if (diet?.includes('no_dairy')) {
      risks.push({ mineral: '钙', reason: '不吃乳制品可能导致钙摄入不足' });
    }
    if (diet?.includes('no_meat')) {
      risks.push({ mineral: '铁', reason: '素食者容易缺铁' });
    }

    // 保存评估记录
    await pool.query(
      `INSERT INTO health_records (user_id, record_type, value, notes)
       VALUES ($1, 'mineral_assessment', $2, $3)`,
      [userId, JSON.stringify({ symptoms, lifestyle, diet }), JSON.stringify(risks)]
    );

    res.json({
      success: true,
      data: {
        risks,
        recommendations: risks.length > 0
          ? '建议增加富含以上微量元素的食物摄入，或咨询营养师'
          : '您的饮食看起来比较均衡，继续保持！'
      }
    });
  } catch (error) {
    console.error('微量元素自测错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = {
  getAllMinerals,
  getMineralDetail,
  getNutritionRecommendation,
  mineralSelfTest
};
