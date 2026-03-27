const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Mock数据
const mockData = {
  users: [],
  minerals: [
    {
      mineral_id: 1,
      name: 'Calcium',
      name_cn: '钙',
      type: 'mineral',
      description: '骨骼和牙齿的主要成分，参与神经传导和肌肉收缩',
      daily_requirement_min: 800,
      daily_requirement_max: 1200,
      unit: 'mg',
      food_sources: ['牛奶', '奶酪', '豆制品', '深绿色蔬菜', '芝麻'],
      deficiency_symptoms: ['骨质疏松', '牙齿松动', '肌肉抽搐', '发育迟缓'],
      excess_risks: ['肾结石', '便秘', '钙化']
    },
    {
      mineral_id: 2,
      name: 'Iron',
      name_cn: '铁',
      type: 'mineral',
      description: '血红蛋白的重要组成部分，参与氧气运输',
      daily_requirement_min: 8,
      daily_requirement_max: 18,
      unit: 'mg',
      food_sources: ['红肉', '动物肝脏', '菠菜', '黑木耳', '红枣'],
      deficiency_symptoms: ['贫血', '疲劳', '免疫力下降', '注意力不集中'],
      excess_risks: ['肝脏损伤', '心脏毒性']
    }
  ],
  recipes: [
    {
      recipe_id: '1',
      title: '番茄炒蛋',
      description: '简单易做的家常菜，营养丰富',
      cooking_time: 15,
      difficulty: 'easy',
      target_age_group: 'adult',
      category: '补铁',
      nutrition_info: { calories: 150, protein: 8, fat: 10, carbs: 5 },
      mineral_content: { iron: 2.5, protein: 8 },
      ingredients: ['鸡蛋', '番茄', '葱', '盐', '油'],
      steps: ['打散鸡蛋', '番茄切块', '热锅下蛋', '加入番茄炒熟', '调味即可'],
      tips: '番茄要选熟的，蛋要嫩',
      image_url: 'https://via.placeholder.com/300x200?text=番茄炒蛋',
      views: 128,
      favorites: 56
    },
    {
      recipe_id: '2',
      title: '牛奶燕麦粥',
      description: '早餐首选，营养均衡',
      cooking_time: 10,
      difficulty: 'easy',
      target_age_group: 'adult',
      category: '补钙',
      nutrition_info: { calories: 200, protein: 10, fat: 8, carbs: 30 },
      mineral_content: { calcium: 300, protein: 10 },
      ingredients: ['牛奶', '燕麦', '蜂蜜'],
      steps: ['燕麦用热水泡开', '加入热牛奶', '搅拌成粥状', '加入蜂蜜调味'],
      tips: '可以提前一晚泡燕麦，更易消化',
      image_url: 'https://via.placeholder.com/300x200?text=牛奶燕麦粥',
      views: 256,
      favorites: 128
    },
    {
      recipe_id: '3',
      title: '红烧排骨',
      description: '经典家常菜，补钙补铁',
      cooking_time: 45,
      difficulty: 'medium',
      target_age_group: 'adult',
      category: '补钙',
      nutrition_info: { calories: 350, protein: 25, fat: 20, carbs: 10 },
      mineral_content: { calcium: 50, iron: 3, protein: 25 },
      ingredients: ['排骨', '冰糖', '生抽', '老抽', '姜', '八角'],
      steps: ['排骨焯水', '炒糖色', '下排骨翻炒', '加调料炖煮', '收汁'],
      tips: '炖煮时间要足，排骨才会软烂',
      image_url: 'https://via.placeholder.com/300x200?text=红烧排骨',
      views: 512,
      favorites: 256
    }
  ],
  constitutions: [
    {
      constitution_id: 1,
      name: '平和质',
      description: '阴阳气血调和，体态适中，面色红润，精力充沛',
      characteristics: ['体型适中', '面色润泽', '精力充沛', '睡眠良好'],
      diet_recommendations: ['饮食均衡', '不偏食', '粗细搭配'],
      therapy_recommendations: ['适度运动', '规律作息'],
      lifestyle_tips: ['保持心情舒畅', '避免过度劳累']
    },
    {
      constitution_id: 2,
      name: '阳虚质',
      description: '阳气不足，畏寒怕冷，手足不温',
      characteristics: ['畏寒怕冷', '手足不温', '面色苍白', '容易疲劳'],
      diet_recommendations: ['温补食物：羊肉、韭菜、姜', '忌生冷', '少食绿豆'],
      therapy_recommendations: ['艾灸关元、气海', '泡脚', '晒太阳'],
      lifestyle_tips: ['注意保暖', '避免熬夜', '适度运动']
    },
    {
      constitution_id: 3,
      name: '阴虚质',
      description: '阴液亏少，易生内热，手足心热',
      characteristics: ['手足心热', '口干咽燥', '盗汗', '易心烦'],
      diet_recommendations: ['滋阴食物：银耳、百合、梨', '忌辛辣', '少食羊肉'],
      therapy_recommendations: ['按揉太冲穴', '避免熬夜'],
      lifestyle_tips: ['保持心情平和', '避免暴晒']
    }
  ]
};

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock API运行中' });
});

// Mock认证接口
app.post('/api/auth/register', (req, res) => {
  const { phone, password, nickname } = req.body;
  const user = {
    user_id: 'mock-' + Date.now(),
    phone,
    nickname: nickname || '测试用户',
    created_at: new Date().toISOString()
  };
  const token = 'mock-token-' + Date.now();
  mockData.users.push(user);
  res.json({
    success: true,
    message: '注册成功（Mock模式）',
    data: { user, token }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body;
  const user = {
    user_id: 'mock-user-1',
    phone,
    nickname: '测试用户',
    gender: 'male',
    birthday: '1990-01-01',
    height: 175,
    weight: 70,
    age_group: 'adult',
    bmi: 22.86,
    created_at: new Date().toISOString()
  };
  const token = 'mock-token-valid';
  res.json({
    success: true,
    message: '登录成功（Mock模式）',
    data: { user, token }
  });
});

app.get('/api/auth/user', (req, res) => {
  res.json({
    success: true,
    data: {
      user_id: 'mock-user-1',
      phone: '13800138000',
      nickname: '测试用户',
      gender: 'male',
      birthday: '1990-01-01',
      height: 175,
      weight: 70,
      age_group: 'adult',
      bmi: 22.86
    }
  });
});

app.put('/api/auth/user', (req, res) => {
  res.json({
    success: true,
    message: '更新成功（Mock模式）',
    data: req.body
  });
});

// 营养接口
app.get('/api/nutrition/minerals', (req, res) => {
  res.json({ success: true, data: mockData.minerals });
});

app.get('/api/nutrition/minerals/:id', (req, res) => {
  const mineral = mockData.minerals.find(m => m.mineral_id === parseInt(req.params.id));
  if (mineral) {
    res.json({ success: true, data: mineral });
  } else {
    res.status(404).json({ success: false, error: '未找到' });
  }
});

app.get('/api/nutrition/recommendation', (req, res) => {
  const { age, gender } = req.query;
  res.json({
    success: true,
    data: mockData.minerals.map(m => ({
      ...m,
      recommendation: `根据${age}岁${gender}的推荐量：${m.daily_requirement_min}-${m.daily_requirement_max}${m.unit}`
    }))
  });
});

app.post('/api/nutrition/self-test', (req, res) => {
  const { symptoms, lifestyle, diet } = req.body;
  const risks = [
    { mineral: '钙', reason: '检测到可能的钙缺乏风险' },
    { mineral: '铁', reason: '建议增加铁的摄入' }
  ];
  res.json({
    success: true,
    data: {
      risks,
      recommendations: '建议：增加富含钙、铁的食物摄入'
    }
  });
});

// 食谱接口
app.get('/api/recipes', (req, res) => {
  const { page = 1, limit = 20, category, age_group, gender } = req.query;
  let recipes = [...mockData.recipes];
  
  if (category) {
    recipes = recipes.filter(r => r.category === category);
  }
  
  res.json({
    success: true,
    data: {
      recipes,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: recipes.length }
    }
  });
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = mockData.recipes.find(r => r.recipe_id === req.params.id);
  if (recipe) {
    res.json({ success: true, data: recipe });
  } else {
    res.status(404).json({ success: false, error: '食谱不存在' });
  }
});

app.get('/api/recipes/search/:keyword', (req, res) => {
  const keyword = req.params.keyword.toLowerCase();
  const recipes = mockData.recipes.filter(r =>
    r.title.toLowerCase().includes(keyword) ||
    r.description.toLowerCase().includes(keyword)
  );
  res.json({
    success: true,
    data: { recipes, keyword }
  });
});

app.post('/api/recipes/favorite', (req, res) => {
  res.json({ success: true, message: '收藏成功（Mock模式）' });
});

app.delete('/api/recipes/favorite/:recipeId', (req, res) => {
  res.json({ success: true, message: '取消收藏成功（Mock模式）' });
});

// 中医接口
app.get('/api/tcm/constitutions', (req, res) => {
  res.json({ success: true, data: mockData.constitutions });
});

app.get('/api/tcm/constitutions/:id', (req, res) => {
  const constitution = mockData.constitutions.find(c => c.constitution_id === parseInt(req.params.id));
  if (constitution) {
    res.json({ success: true, data: constitution });
  } else {
    res.status(404).json({ success: false, error: '体质不存在' });
  }
});

app.post('/api/tcm/assessment', (req, res) => {
  const { answers } = req.body;
  let constitution = mockData.constitutions[0];
  
  // 简单的体质判断
  if (answers && answers.includes('cold_hands_feet')) {
    constitution = mockData.constitutions[1]; // 阳虚质
  } else if (answers && answers.includes('dry_mouth')) {
    constitution = mockData.constitutions[2]; // 阴虚质
  }
  
  res.json({
    success: true,
    message: '评估完成（Mock模式）',
    data: {
      constitution: constitution.name,
      scores: { '平和质': 5, '阳虚质': 3, '阴虚质': 2 },
      details: constitution
    }
  });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║  🚀 Mock API服务已启动                            ║
║                                                      ║
║  📡 服务器地址: http://localhost:${PORT}               ║
║  💚 健康检查: http://localhost:${PORT}/health         ║
║  📝 模式: Mock（无需数据库）                     ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
  `);
});
