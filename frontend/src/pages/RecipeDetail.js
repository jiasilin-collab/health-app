import React from 'react';
import { Card, Row, Col, Tag, Button, Descriptions, message } from 'antd';
import { HeartOutlined, ClockCircleOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import axios from 'axios';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const [loading, setLoading] = React.useState(false);
  const [recipe, setRecipe] = React.useState(null);
  const [isFavorited, setIsFavorited] = React.useState(false);
  const recipeId = window.location.pathname.split('/').pop();

  React.useEffect(() => {
    fetchRecipeDetail();
  }, [recipeId]);

  const fetchRecipeDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`);
      if (response.data.success) {
        setRecipe(response.data.data);
      }
    } catch (error) {
      message.error('加载食谱详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.warning('请先登录');
        return;
      }

      if (isFavorited) {
        await axios.delete(`http://localhost:3000/api/recipes/favorite/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('取消收藏成功');
      } else {
        await axios.post('http://localhost:3000/api/recipes/favorite', {
          recipeId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('收藏成功');
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return difficulty;
    }
  };

  if (loading || !recipe) {
    return <div className="loading-container">加载中...</div>;
  }

  return (
    <div className="recipe-detail-container">
      <Card loading={loading} className="recipe-header">
        <div className="recipe-cover">
          <img
            src={recipe.image_url || 'https://via.placeholder.com/800x400?text=Recipe'}
            alt={recipe.title}
          />
        </div>
        <div className="recipe-title-section">
          <h1>{recipe.title}</h1>
          <div className="recipe-meta">
            <Tag icon={<ClockCircleOutlined />}>{recipe.cooking_time}分钟</Tag>
            <Tag color={getDifficultyColor(recipe.difficulty)}>
              {getDifficultyText(recipe.difficulty)}
            </Tag>
            <Tag icon={<FireOutlined />}>{recipe.views || 0}次浏览</Tag>
            <Tag icon={<HeartOutlined />}>{recipe.favorites || 0}收藏</Tag>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="食材" className="ingredients-card">
            <div className="ingredients-list">
              {Array.isArray(recipe.ingredients) ? (
                recipe.ingredients.map((ingredient, index) => (
                  <Tag key={index} color="blue" className="ingredient-tag">
                    {ingredient}
                  </Tag>
                ))
              ) : (
                <p>暂无食材信息</p>
              )}
            </div>
          </Card>

          <Card title="烹饪步骤" className="steps-card">
            <div className="steps-list">
              {Array.isArray(recipe.steps) ? (
                recipe.steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">{step}</div>
                  </div>
                ))
              ) : (
                <p>暂无步骤信息</p>
              )}
            </div>
          </Card>

          {recipe.tips && (
            <Card title="小贴士" className="tips-card">
              <p>{recipe.tips}</p>
            </Card>
          )}
        </Col>

        <Col xs={24} md={8}>
          <Card className="action-card">
            <Button
              type="primary"
              size="large"
              icon={isFavorited ? <StarOutlined /> : <HeartOutlined />}
              onClick={handleFavorite}
              block
              style={{ marginBottom: 16 }}
            >
              {isFavorited ? '已收藏' : '收藏食谱'}
            </Button>
          </Card>

          <Card title="营养信息" className="nutrition-info-card">
            {recipe.nutrition_info && (
              <Descriptions column={1} bordered>
                {Object.entries(recipe.nutrition_info).map(([key, value]) => (
                  <Descriptions.Item key={key} label={key}>
                    {value}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            )}
          </Card>

          <Card title="微量元素" className="minerals-info-card">
            {recipe.mineral_content && (
              <div className="minerals-list">
                {Object.entries(recipe.mineral_content).map(([key, value]) => (
                  <div key={key} className="mineral-item">
                    <strong>{key}：</strong>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RecipeDetail;
