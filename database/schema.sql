-- 全生命周期健康管理App - 数据库Schema
-- PostgreSQL

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 用户表
-- ============================================
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  avatar_url TEXT,

  -- 基本信息
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  birthday DATE,
  height FLOAT CHECK (height > 0 AND height < 300),
  weight FLOAT CHECK (weight > 0 AND weight < 500),

  -- 健康信息（JSON格式）
  allergies JSONB DEFAULT '[]'::jsonb,          -- 过敏史
  chronic_diseases JSONB DEFAULT '[]'::jsonb,   -- 慢病史
  medications JSONB DEFAULT '[]'::jsonb,         -- 用药史

  -- 计算字段（通过触发器更新）
  age_group VARCHAR(20),                       -- 年龄段：infant, child, teen, adult, middle_age, elderly
  bmi FLOAT,

  -- 状态
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_age_group ON users(age_group);
CREATE INDEX idx_users_gender ON users(gender);

-- ============================================
-- 微量元素库
-- ============================================
CREATE TABLE minerals (
  mineral_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  name_cn VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('mineral', 'vitamin', 'other')),
  description TEXT,

  -- 营养信息
  daily_requirement_min FLOAT,           -- 最低每日需求量
  daily_requirement_max FLOAT,           -- 最高每日需求量
  unit VARCHAR(10),                     -- 单位：mg, mcg, IU

  -- 知识库
  food_sources JSONB,                   -- 食物来源
  deficiency_symptoms JSONB,            -- 缺乏症状
  excess_risks JSONB,                   -- 过量风险
  notes TEXT,                          -- 注意事项

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例数据
INSERT INTO minerals (name, name_cn, type, description, daily_requirement_min, daily_requirement_max, unit, food_sources, deficiency_symptoms, excess_risks) VALUES
('Calcium', '钙', 'mineral', '骨骼和牙齿的主要成分，参与神经传导和肌肉收缩', 800, 1200, 'mg',
  '["牛奶", "奶酪", "豆制品", "深绿色蔬菜", "芝麻"]'::jsonb,
  '["骨质疏松", "牙齿松动", "肌肉抽搐", "发育迟缓"]'::jsonb,
  '["肾结石", "便秘", "钙化"]'::jsonb
),
('Iron', '铁', 'mineral', '血红蛋白的重要组成部分，参与氧气运输', 8, 18, 'mg',
  '["红肉", "动物肝脏", "菠菜", "黑木耳", "红枣"]'::jsonb,
  '["贫血", "疲劳", "免疫力下降", "注意力不集中"]'::jsonb,
  '["肝脏损伤", "心脏毒性"]'::jsonb
),
('Zinc', '锌', 'mineral', '参与免疫、生长发育和伤口愈合', 8, 11, 'mg',
  '["牡蛎", "牛肉", "南瓜籽", "坚果", "全谷物"]'::jsonb,
  '["免疫力下降", "伤口愈合慢", "味觉减退", "生长发育迟缓"]'::jsonb,
  '["铜吸收减少", "恶心呕吐"]'::jsonb
),
('Magnesium', '镁', 'mineral', '参与300多种酶反应，维持神经肌肉功能', 310, 420, 'mg',
  '["坚果", "全谷物", "深绿色蔬菜", "豆类"]'::jsonb,
  '["肌肉痉挛", "失眠", "焦虑", "心律失常"]'::jsonb,
  '["腹泻", "电解质失衡"]'::jsonb
),
('Vitamin A', '维生素A', 'vitamin', '维持视力、皮肤和免疫系统健康', 600, 900, 'mcg',
  '["动物肝脏", "胡萝卜", "菠菜", "红薯", "蛋黄"]'::jsonb,
  '["夜盲症", "皮肤干燥", "免疫力下降"]'::jsonb,
  '["肝毒性", "骨骼疼痛", "皮肤干燥"]'::jsonb
),
('Vitamin C', '维生素C', 'vitamin', '强效抗氧化剂，增强免疫力，促进铁吸收', 75, 90, 'mg',
  '["柑橘类", "猕猴桃", "草莓", "青椒", "西兰花"]'::jsonb,
  '["牙龈出血", "免疫力下降", "伤口愈合慢"]'::jsonb,
  '["腹泻", "肾结石"]'::jsonb
),
('Vitamin D', '维生素D', 'vitamin', '促进钙吸收，维持骨骼健康', 10, 15, 'mcg',
  '["阳光", "鱼肝油", "三文鱼", "蛋黄", "强化牛奶"]'::jsonb,
  '["佝偻病", "骨质疏松", "肌肉无力"]'::jsonb,
  '["高钙血症", "肾结石"]'::jsonb
);

-- ============================================
-- 年龄段营养需求表
-- ============================================
CREATE TABLE age_nutrition_requirements (
  id SERIAL PRIMARY KEY,
  age_min INT NOT NULL CHECK (age_min >= 0),
  age_max INT NOT NULL CHECK (age_max > age_min),
  age_group_name VARCHAR(20) NOT NULL,  -- infant, child, teen, adult, middle_age, elderly
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  mineral_id INT NOT NULL REFERENCES minerals(mineral_id),
  daily_requirement_min FLOAT,
  daily_requirement_max FLOAT,
  unit VARCHAR(10),
  notes TEXT
);

-- 插入示例数据
INSERT INTO age_nutrition_requirements (age_min, age_max, age_group_name, gender, mineral_id, daily_requirement_min, daily_requirement_max, unit, notes) VALUES
(0, 3, 'infant', 'male', 1, 200, 260, 'mg', '婴幼儿期钙需求较高'),
(0, 3, 'infant', 'female', 1, 200, 260, 'mg', '婴幼儿期钙需求较高'),
(4, 12, 'child', 'male', 1, 800, 1000, 'mg', '儿童生长发育期'),
(4, 12, 'child', 'female', 1, 800, 1000, 'mg', '儿童生长发育期'),
(13, 18, 'teen', 'male', 1, 1000, 1300, 'mg', '青春期快速生长'),
(13, 18, 'teen', 'female', 1, 1000, 1300, 'mg', '青春期快速生长'),
(19, 45, 'adult', 'male', 1, 800, 1000, 'mg', '成人期维持骨量'),
(19, 45, 'adult', 'female', 1, 800, 1000, 'mg', '成人期维持骨量'),
(46, 65, 'middle_age', 'male', 1, 800, 1000, 'mg', '中年期预防骨质流失'),
(46, 65, 'middle_age', 'female', 1, 1000, 1200, 'mg', '女性绝经后需求增加'),
(66, 120, 'elderly', 'male', 1, 800, 1200, 'mg', '老年期补充钙质'),
(66, 120, 'elderly', 'female', 1, 800, 1200, 'mg', '老年期补充钙质');

-- ============================================
-- 食谱表
-- ============================================
CREATE TABLE recipes (
  recipe_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  cooking_time INT,                        -- 烹饪时间（分钟）
  difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),

  -- 目标人群
  target_age_group VARCHAR(50),
  target_gender VARCHAR(10),
  seasons JSONB,                          -- 适用季节

  -- 营养信息
  nutrition_info JSONB,                     -- 热量、蛋白质、脂肪、碳水
  mineral_content JSONB,                    -- 微量元素含量

  -- 内容
  ingredients JSONB,                       -- 食材列表
  steps JSONB,                            -- 烹饪步骤
  tips TEXT,                              -- 小贴士

  -- 媒体
  image_url TEXT,
  video_url TEXT,

  -- 分类
  category VARCHAR(50),                     -- 分类：补钙、补铁、助眠等
  tags JSONB,                             -- 标签

  -- 统计
  views INT DEFAULT 0,
  favorites INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_recipes_age_group ON recipes(target_age_group);
CREATE INDEX idx_recipes_category ON recipes(category);

-- ============================================
-- 中医体质表
-- ============================================
CREATE TABLE tcm_constitutions (
  constitution_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  characteristics JSONB,                    -- 体质特征
  diet_recommendations JSONB,                -- 饮食建议
  therapy_recommendations JSONB,              -- 理疗建议
  lifestyle_tips JSONB,                    -- 生活建议
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入中医体质数据
INSERT INTO tcm_constitutions (name, description, characteristics, diet_recommendations, therapy_recommendations, lifestyle_tips) VALUES
('平和质', '阴阳气血调和，体态适中，面色红润，精力充沛',
  '["体型适中", "面色润泽", "精力充沛", "睡眠良好"]'::jsonb,
  '["饮食均衡", "不偏食", "粗细搭配"]'::jsonb,
  '["适度运动", "规律作息"]'::jsonb,
  '["保持心情舒畅", "避免过度劳累"]'::jsonb
),
('阳虚质', '阳气不足，畏寒怕冷，手足不温',
  '["畏寒怕冷", "手足不温", "面色苍白", "容易疲劳"]'::jsonb,
  '["温补食物：羊肉、韭菜、姜", "忌生冷", "少食绿豆"]'::jsonb,
  '["艾灸关元、气海", "泡脚", "晒太阳"]'::jsonb,
  '["注意保暖", "避免熬夜", "适度运动"]'::jsonb
),
('阴虚质', '阴液亏少，易生内热，手足心热',
  '["手足心热", "口干咽燥", "盗汗", "易心烦"]'::jsonb,
  '["滋阴食物：银耳、百合、梨", "忌辛辣", "少食羊肉"]'::jsonb,
  '["按揉太冲穴", "避免熬夜"]'::jsonb,
  '["保持心情平和", "避免暴晒"]'::jsonb
);

-- ============================================
-- 用户体质记录表
-- ============================================
CREATE TABLE user_constitutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  constitution_id INT NOT NULL REFERENCES tcm_constitutions(constitution_id),

  -- 评估结果
  score INT NOT NULL,                      -- 得分
  assessment_date DATE NOT NULL,             -- 评估日期

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 健康数据记录表
-- ============================================
CREATE TABLE health_records (
  record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  -- 记录类型
  record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('weight', 'sleep', 'water', 'exercise', 'blood_pressure', 'blood_sugar')),

  -- 数据值（JSON格式）
  value JSONB NOT NULL,

  -- 备注
  notes TEXT,

  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_health_records_user ON health_records(user_id);
CREATE INDEX idx_health_records_type ON health_records(record_type);
CREATE INDEX idx_health_records_date ON health_records(recorded_at);

-- ============================================
-- 用户收藏表
-- ============================================
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(recipe_id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, recipe_id)
);

-- ============================================
-- 提醒记录表
-- ============================================
CREATE TABLE reminders (
  reminder_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  -- 提醒类型
  reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('water', 'exercise', 'medication', 'checkup', 'vaccine', 'menstrual')),

  -- 提醒内容
  title VARCHAR(100) NOT NULL,
  description TEXT,

  -- 时间设置
  reminder_time TIME NOT NULL,
  repeat_pattern VARCHAR(20) CHECK (repeat_pattern IN ('once', 'daily', 'weekly', 'monthly')),

  -- 状态
  is_active BOOLEAN DEFAULT true,
  next_remind_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 触发器：自动更新年龄组和BMI
-- ============================================
CREATE OR REPLACE FUNCTION update_user_age_group_and_bmi()
RETURNS TRIGGER AS $$
BEGIN
  -- 计算年龄
  IF NEW.birthday IS NOT NULL THEN
    NEW.age_group :=
      CASE
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.birthday)) < 3 THEN 'infant'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.birthday)) < 12 THEN 'child'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.birthday)) < 18 THEN 'teen'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.birthday)) < 46 THEN 'adult'
        WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.birthday)) < 66 THEN 'middle_age'
        ELSE 'elderly'
      END;
  END IF;

  -- 计算BMI
  IF NEW.height IS NOT NULL AND NEW.weight IS NOT NULL AND NEW.height > 0 AND NEW.weight > 0 THEN
    NEW.bmi := NEW.weight / POWER(NEW.height / 100, 2);
  END IF;

  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_info
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_age_group_and_bmi();

-- ============================================
-- 注释
-- ============================================
COMMENT ON TABLE users IS '用户表';
COMMENT ON TABLE minerals IS '微量元素库';
COMMENT ON TABLE age_nutrition_requirements IS '年龄段营养需求表';
COMMENT ON TABLE recipes IS '食谱表';
COMMENT ON TABLE tcm_constitutions IS '中医体质表';
COMMENT ON TABLE user_constitutions IS '用户体质评估记录';
COMMENT ON TABLE health_records IS '健康数据记录表';
COMMENT ON TABLE user_favorites IS '用户收藏表';
COMMENT ON TABLE reminders IS '提醒记录表';
