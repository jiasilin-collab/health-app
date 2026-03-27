const pool = require('../config/database');

// 获取所有体质类型
const getConstitutions = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tcm_constitutions ORDER BY constitution_id'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('获取体质类型错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取体质详情
const getConstitutionDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM tcm_constitutions WHERE constitution_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '体质类型不存在' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('获取体质详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 体质评估问卷
const constitutionAssessment = async (req, res) => {
  try {
    const { userId } = req.user;
    const { answers } = req.body;

    // 简化的体质辨识算法
    // 实际应用中应该使用更复杂的评分系统

    let constitutionScores = {
      '平和质': 0,
      '阳虚质': 0,
      '阴虚质': 0
    };

    // 症状映射到体质
    if (answers?.includes('fear_cold')) {
      constitutionScores['阳虚质'] += 2;
    }
    if (answers?.includes('cold_hands_feet')) {
      constitutionScores['阳虚质'] += 2;
    }
    if (answers?.includes('palms_sole_heat')) {
      constitutionScores['阴虚质'] += 2;
    }
    if (answers?.includes('dry_mouth')) {
      constitutionScores['阴虚质'] += 2;
    }
    if (answers?.includes('good_energy')) {
      constitutionScores['平和质'] += 2;
    }
    if (answers?.includes('good_appetite')) {
      constitutionScores['平和质'] += 2;
    }

    // 找出得分最高的体质
    let dominantConstitution = Object.keys(constitutionScores).reduce((a, b) =>
      constitutionScores[a] > constitutionScores[b] ? a : b
    );

    // 获取体质ID
    const constitutionResult = await pool.query(
      "SELECT constitution_id FROM tcm_constitutions WHERE name = $1",
      [dominantConstitution]
    );

    if (constitutionResult.rows.length === 0) {
      dominantConstitution = '平和质';
    }

    const constitutionId = constitutionResult.rows[0]?.constitution_id || 1;

    // 保存评估记录
    await pool.query(
      `INSERT INTO user_constitutions (user_id, constitution_id, score, assessment_date)
       VALUES ($1, $2, $3, CURRENT_DATE)`,
      [userId, constitutionId, constitutionScores[dominantConstitution]]
    );

    // 返回体质详情
    const detailResult = await pool.query(
      `SELECT * FROM tcm_constitutions WHERE constitution_id = $1`,
      [constitutionId]
    );

    res.json({
      success: true,
      data: {
        constitution: dominantConstitution,
        scores: constitutionScores,
        details: detailResult.rows[0]
      }
    });
  } catch (error) {
    console.error('体质评估错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取用户历史体质评估
const getUserConstitutions = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      `SELECT uc.*, tc.name as constitution_name, tc.description
       FROM user_constitutions uc
       JOIN tcm_constitutions tc ON uc.constitution_id = tc.constitution_id
       WHERE uc.user_id = $1
       ORDER BY uc.assessment_date DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('获取用户体质评估错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = {
  getConstitutions,
  getConstitutionDetail,
  constitutionAssessment,
  getUserConstitutions
};
