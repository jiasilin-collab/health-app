import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Empty, message, Modal, Input } from 'antd';
import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Nutrition.css';

const Nutrition = () => {
  const [minerals, setMinerals] = useState([]);
  const [filteredMinerals, setFilteredMinerals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedMineral, setSelectedMineral] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMinerals();
  }, []);

  useEffect(() => {
    if (searchKeyword) {
      const filtered = minerals.filter(m =>
        m.name_cn.includes(searchKeyword) ||
        m.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredMinerals(filtered);
    } else {
      setFilteredMinerals(minerals);
    }
  }, [searchKeyword, minerals]);

  const fetchMinerals = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/nutrition/minerals');
      if (response.data.success) {
        setMinerals(response.data.data);
        setFilteredMinerals(response.data.data);
      }
    } catch (error) {
      message.error('加载微量元素失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };

  const showDetail = (mineral) => {
    setSelectedMineral(mineral);
    setDetailModalVisible(true);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'mineral': return 'blue';
      case 'vitamin': return 'green';
      default: return 'default';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'mineral': return '矿物质';
      case 'vitamin': return '维生素';
      default: return '其他';
    }
  };

  return (
    <div className="nutrition-container">
      <Card className="search-card">
        <Input
          placeholder="搜索微量元素（如：钙、铁、维生素D）"
          prefix={<SearchOutlined />}
          size="large"
          value={searchKeyword}
          onChange={handleSearch}
          allowClear
        />
      </Card>

      <Card loading={loading} title="微量元素列表" className="minerals-card">
        {filteredMinerals.length === 0 && !loading ? (
          <Empty description="暂无数据" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredMinerals.map(mineral => (
              <Col xs={24} sm={12} md={8} lg={6} key={mineral.mineral_id}>
                <Card
                  hoverable
                  className="mineral-card"
                  onClick={() => showDetail(mineral)}
                >
                  <div className="mineral-header">
                    <h3>{mineral.name_cn}</h3>
                    <Tag color={getTypeColor(mineral.type)}>
                      {getTypeText(mineral.type)}
                    </Tag>
                  </div>
                  <p className="mineral-description">
                    {mineral.description || '暂无描述'}
                  </p>
                  <div className="mineral-requirement">
                    <span>日需求量：{mineral.daily_requirement_min}-{mineral.daily_requirement_max} {mineral.unit}</span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={
          <span>
            <InfoCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            {selectedMineral?.name_cn} ({selectedMineral?.name})
          </span>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedMineral && (
          <div className="mineral-detail">
            <div className="detail-section">
              <h4>基本信息</h4>
              <p><strong>类型：</strong>{getTypeText(selectedMineral.type)}</p>
              <p><strong>日需求量：</strong>{selectedMineral.daily_requirement_min}-{selectedMineral.daily_requirement_max} {selectedMineral.unit}</p>
              <p><strong>描述：</strong>{selectedMineral.description}</p>
            </div>

            <div className="detail-section">
              <h4>食物来源</h4>
              <div className="food-sources">
                {Array.isArray(selectedMineral.food_sources) ? (
                  selectedMineral.food_sources.map((source, index) => (
                    <Tag key={index} color="success">{source}</Tag>
                  ))
                ) : (
                  <p>暂无数据</p>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h4>缺乏症状</h4>
              <div className="symptoms">
                {Array.isArray(selectedMineral.deficiency_symptoms) ? (
                  selectedMineral.deficiency_symptoms.map((symptom, index) => (
                    <Tag key={index} color="warning">{symptom}</Tag>
                  ))
                ) : (
                  <p>暂无数据</p>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h4>过量风险</h4>
              <div className="risks">
                {Array.isArray(selectedMineral.excess_risks) ? (
                  selectedMineral.excess_risks.map((risk, index) => (
                    <Tag key={index} color="error">{risk}</Tag>
                  ))
                ) : (
                  <p>暂无数据</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Nutrition;
