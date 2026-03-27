import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, message } from 'antd';
import {
  HeartOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalMinerals: 0,
    myFavorites: 0
  });
  const [recentRecipes, setRecentRecipes] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 获取食谱列表
      const recipesResponse = await axios.get('http://localhost:3000/api/recipes?limit=3');
      if (recipesResponse.data.success) {
        setRecentRecipes(recipesResponse.data.data.recipes);
      }

      // 模拟统计数据（实际应该从API获取）
      setStats({
        totalUsers: 1280,
        totalRecipes: 256,
        totalMinerals: 7,
        myFavorites: 12
      });
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const nutritionLevel = 85; // 模拟营养均衡度

  return (
    <div className="home-container">
      <div className="home-welcome">
        <h1>👋 欢迎回来</h1>
        <p>今天也要保持健康的生活方式哦</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="食谱总数"
              value={stats.totalRecipes}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="微量元素"
              value={stats.totalMinerals}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="我的收藏"
              value={stats.myFavorites}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 营养均衡度 */}
      <Card className="nutrition-card" title="今日营养均衡度">
        <div className="nutrition-progress">
          <Progress
            type="circle"
            percent={nutritionLevel}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068'
            }}
            width={200}
            format={(percent) => `${percent}%`}
          />
          <div className="nutrition-tips">
            <h3>营养状态：良好</h3>
            <p>建议补充：维生素D、钙</p>
          </div>
        </div>
      </Card>

      {/* 推荐食谱 */}
      <Card className="recipes-card" title="推荐食谱" extra={<a href="/recipes">查看全部 →</a>}>
        <Row gutter={[16, 16]}>
          {recentRecipes.map(recipe => (
            <Col xs={24} sm={12} md={8} key={recipe.recipe_id}>
              <Card
                hoverable
                className="recipe-card"
                cover={
                  <img
                    alt={recipe.title}
                    src={recipe.image_url || 'https://via.placeholder.com/300x200?text=Recipe'}
                    className="recipe-image"
                  />
                }
              >
                <Card.Meta
                  title={recipe.title}
                  description={
                    <div className="recipe-info">
                      <span>⏱️ {recipe.cooking_time}分钟</span>
                      <span className="recipe-favorites">❤️ {recipe.favorites || 0}</span>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default Home;
