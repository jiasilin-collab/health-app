const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户注册
const register = async (req, res) => {
  try {
    const { phone, password, nickname } = req.body;

    // 验证
    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }

    // 检查手机号是否已注册
    const existingUser = await pool.query(
      'SELECT user_id FROM users WHERE phone = $1',
      [phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: '该手机号已注册' });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 创建用户
    const result = await pool.query(
      `INSERT INTO users (phone, password_hash, nickname)
       VALUES ($1, $2, $3)
       RETURNING user_id, phone, nickname, created_at`,
      [phone, passwordHash, nickname]
    );

    // 生成token
    const token = jwt.sign(
      { userId: result.rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: result.rows[0],
        token
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 验证
    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }

    // 查找用户
    const result = await pool.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: '手机号或密码错误' });
    }

    const user = result.rows[0];

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: '手机号或密码错误' });
    }

    // 生成token
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 返回用户信息（不含密码）
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取用户信息
const getUserInfo = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      `SELECT user_id, phone, nickname, avatar_url, gender, birthday,
              height, weight, age_group, bmi, allergies,
              chronic_diseases, medications, created_at
       FROM users WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 更新用户信息
const updateUserInfo = async (req, res) => {
  try {
    const { userId } = req.user;
    const { nickname, gender, birthday, height, weight, allergies, chronic_diseases, medications } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET nickname = COALESCE($1, nickname),
           gender = COALESCE($2, gender),
           birthday = COALESCE($3, birthday),
           height = COALESCE($4, height),
           weight = COALESCE($5, weight),
           allergies = COALESCE($6, allergies),
           chronic_diseases = COALESCE($7, chronic_diseases),
           medications = COALESCE($8, medications),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $9
       RETURNING user_id, phone, nickname, gender, birthday, height, weight,
                 age_group, bmi, allergies, chronic_diseases, medications`,
      [nickname, gender, birthday, height, weight, allergies, chronic_diseases, medications, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      success: true,
      message: '更新成功',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  updateUserInfo
};
