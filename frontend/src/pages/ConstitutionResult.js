import React from 'react';
import { Card, Row, Col, Tag, Empty } from 'antd';
import { useParams } from 'react-router-dom';
import './ConstitutionResult.css';

const ConstitutionResult = () => {
  const { id } = useParams();

  // 模拟数据（实际应该从location.state或API获取）
  const constitutionData = {
    1: {
      name: '平和质',
      emoji: '⚖️',
      description: '阴阳气血调和，体态适中，面色红润，精力充沛',
      characteristics: [
        '体型适中',
        '面色润泽',
        '精力充沛',
        '睡眠良好'
      ],
      dietRecommendations: [
        '饮食均衡',
        '不偏食',
        '粗细搭配'
      ],
      therapyRecommendations: [
        '适度运动',
        '规律作息'
      ],
      lifestyleTips: [
        '保持心情舒畅',
        '避免过度劳累'
      ]
    },
    2: {
      name: '阳虚质',
      emoji: '❄️',
      description: '阳气不足，畏寒怕冷，手足不温',
      characteristics: [
        '畏寒怕冷',
        '手足不温',
        '面色苍白',
        '容易疲劳'
      ],
      dietRecommendations: [
        '温补食物：羊肉、韭菜、姜',
        '忌生冷',
        '少食绿豆'
      ],
      therapyRecommendations: [
        '艾灸关元、气海',
        '泡脚',
        '晒太阳'
      ],
      lifestyleTips: [
        '注意保暖',
        '避免熬夜',
        '适度运动'
      ]
    },
    3: {
      name: '阴虚质',
      emoji: '🔥',
      description: '阴液亏少，易生内热，手足心热',
      characteristics: [
        '手足心热',
        '口干咽燥',
        '盗汗',
        '易心烦'
      ],
      dietRecommendations: [
        '滋阴食物：银耳、百合、梨',
        '忌辛辣',
        '少食羊肉'
      ],
      therapyRecommendations: [
        '按揉太冲穴',
        '避免熬夜'
      ],
      lifestyleTips: [
        '保持心情平和',
        '避免暴晒'
      ]
    }
  };

  const data = constitutionData[id] || constitutionData[1];

  if (!data) {
    return <Empty description="未找到体质数据" />;
  }

  return (
    <div className="result-container">
      <Card className="result-header">
        <div className="result-emoji">{data.emoji}</div>
        <h1>您的体质是：{data.name}</h1>
        <p>{data.description}</p>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="体质特征" className="result-card">
            <div className="result-content">
              {data.characteristics.map((item, index) => (
                <Tag key={index} color="blue" className="result-tag">
                  {item}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="饮食建议" className="result-card">
            <div className="result-content">
              {data.dietRecommendations.map((item, index) => (
                <div key={index} className="result-item">
                  <span className="item-icon">🥗</span>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="理疗建议" className="result-card">
            <div className="result-content">
              {data.therapyRecommendations.map((item, index) => (
                <div key={index} className="result-item">
                  <span className="item-icon">🧘</span>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="生活建议" className="result-card">
            <div className="result-content">
              {data.lifestyleTips.map((item, index) => (
                <div key={index} className="result-item">
                  <span className="item-icon">💡</span>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ConstitutionResult;
