import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, message } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Tcm.css';

const Tcm = () => {
  const navigate = useNavigate();
  const [constitutions, setConstitutions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConstitutions();
  }, []);

  const fetchConstitutions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/tcm/constitutions');
      if (response.data.success) {
        setConstitutions(response.data.data);
      }
    } catch (error) {
      message.error('加载体质类型失败');
    } finally {
      setLoading(false);
    }
  };

  const getConstitutionEmoji = (name) => {
    const emojis = {
      '平和质': '⚖️',
      '阳虚质': '❄️',
      '阴虚质': '🔥',
      '气虚质': '💨',
      '痰湿质': '💧',
      '湿热质': '🌡️',
      '血瘀质': '🩸',
      '气郁质': '😔',
      '特禀质': '⭐'
    };
    return emojis[name] || '🧘';
  };

  return (
    <div className="tcm-container">
      <Card loading={loading} className="intro-card" title="中医体质辨识">
        <p>中医认为，不同体质的人有不同的养生方法。通过体质辨识，您可以了解自己的身体状况，并获得个性化的养生建议。</p>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/tcm/assessment')}
          style={{ marginTop: 16 }}
        >
          开始体质测试
        </Button>
      </Card>

      <Card title="九种体质类型" className="constitutions-card">
        <Row gutter={[16, 16]}>
          {constitutions.map(constitution => (
            <Col xs={24} sm={12} md={8} key={constitution.constitution_id}>
              <Card
                hoverable
                className="constitution-card"
                onClick={() => navigate(`/tcm/result/${constitution.constitution_id}`)}
              >
                <div className="constitution-emoji">
                  {getConstitutionEmoji(constitution.name)}
                </div>
                <h3>{constitution.name}</h3>
                <p className="constitution-desc">
                  {constitution.description}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default Tcm;
