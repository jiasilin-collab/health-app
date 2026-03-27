import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Input, Select, Empty, message, Spin } from 'antd';
import { SearchOutlined, FireOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Recipes.css';

const { Search } = Input;
const { Option } = Select;

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12, total: 0 });
  const [filters, setFilters] = useState({ category: '', age_group: '', gender: '' });

  useEffect(() => {
    fetchRecipes();
  }, [pagination.current, filters]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/recipes', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          ...filters
        }
      });

      if (response.data.success) {
        setRecipes(response.data.data.recipes);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination.total
        }));
      }
    } catch (error) {
      message.error('加载食谱失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    if (value) {
      searchRecipes(value);
    }
  };

  const searchRecipes = async (keyword) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/recipes/search/${encodeURIComponent(keyword)}`);
      if (response.data.success) {
        setRecipes(response.data.data.recipes);
        setPagination(prev => ({ ...prev, total: response.data.data.recipes.length }));
      }
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
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

  const handleRecipeClick = (recipeId) => {
    window.location.href = `/recipes/${recipeId}`;
  };

  return (
    <div className="recipes-container">
      <Card className="search-card">
        <Search
          placeholder="搜索食谱（如：补钙、番茄炒蛋）"
          enterButton="搜索"
          size="large"
          onSearch={handleSearch}
          allowClear
        />
      </Card>

      <Card className="filter-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <span className="filter-label">分类：</span>
            <Select
              style={{ width: '100%' }}
              placeholder="选择分类"
              allowClear
              value={filters.category || undefined}
              onChange={(value) => handleFilterChange('category', value)}
            >
              <Option value="补钙">补钙</Option>
              <Option value="补铁">补铁</Option>
              <Option value="补锌">补锌</Option>
              <Option value="助眠">助眠</Option>
              <Option value="提高免疫力">提高免疫力</Option>
              <Option value="美容养颜">美容养颜</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <span className="filter-label">年龄段：</span>
            <Select
              style={{ width: '100%' }}
              placeholder="选择年龄段"
              allowClear
              value={filters.age_group || undefined}
              onChange={(value) => handleFilterChange('age_group', value)}
            >
              <Option value="infant">婴幼儿 (0-3岁)</Option>
              <Option value="child">儿童 (4-12岁)</Option>
              <Option value="teen">青少年 (13-18岁)</Option>
              <Option value="adult">成人 (19-45岁)</Option>
              <Option value="middle_age">中年 (46-65岁)</Option>
              <Option value="elderly">老年 (66岁+)</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <span className="filter-label">性别：</span>
            <Select
              style={{ width: '100%' }}
              placeholder="选择性别"
              allowClear
              value={filters.gender || undefined}
              onChange={(value) => handleFilterChange('gender', value)}
            >
              <Option value="male">男性</Option>
              <Option value="female">女性</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        {recipes.length === 0 && !loading ? (
          <Empty description="暂无食谱数据" style={{ marginTop: 60 }} />
        ) : (
          <>
            <Row gutter={[16, 16]} className="recipes-grid">
              {recipes.map(recipe => (
                <Col xs={24} sm={12} md={8} lg={6} key={recipe.recipe_id}>
                  <Card
                    hoverable
                    className="recipe-card"
                    onClick={() => handleRecipeClick(recipe.recipe_id)}
                    cover={
                      <div className="recipe-cover">
                        <img
                          alt={recipe.title}
                          src={recipe.image_url || 'https://via.placeholder.com/300x200?text=Recipe'}
                        />
                        <div className="recipe-overlay">
                          <FireOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
                          <span>{recipe.views || 0} 次浏览</span>
                        </div>
                      </div>
                    }
                  >
                    <Card.Meta
                      title={recipe.title}
                      description={
                        <div className="recipe-meta">
                          <div className="recipe-tags">
                            <Tag color={getDifficultyColor(recipe.difficulty)}>
                              {getDifficultyText(recipe.difficulty)}
                            </Tag>
                            <Tag color="blue">⏱️ {recipe.cooking_time}分钟</Tag>
                          </div>
                          <div className="recipe-favorites">
                            ❤️ {recipe.favorites || 0} 收藏
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Spin>
    </div>
  );
};

export default Recipes;
