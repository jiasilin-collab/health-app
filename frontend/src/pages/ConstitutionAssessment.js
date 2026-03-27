import React, { useState, useEffect } from 'react';
import { Card, Form, Checkbox, Button, Progress, message, Spin } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ConstitutionAssessment.css';

const ConstitutionAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // 收集所有选中的答案
      const answers = Object.values(values).flat().filter(Boolean);

      const response = await axios.post('http://localhost:3000/api/tcm/assessment', {
        answers
      });

      if (response.data.success) {
        message.success('评估完成！');
        // 导航到结果页面
        navigate(`/tcm/result/${response.data.data.details.constitution_id}`, {
          state: { result: response.data.data }
        });
      }
    } catch (error) {
      message.error(error.response?.data?.error || '评估失败');
    } finally {
      setSubmitting(false);
    }
  };

  const questions = [
    {
      category: '体质特征',
      items: [
        { label: '容易手脚冰凉', value: 'cold_hands_feet' },
        { label: '怕冷，衣服比别人穿得多', value: 'fear_cold' },
        { label: '手脚心发热', value: 'palms_sole_heat' },
        { label: '口干咽燥', value: 'dry_mouth' },
        { label: '容易出汗', value: 'easy_sweat' },
        { label: '精神饱满，精力充沛', value: 'good_energy' }
      ]
    },
    {
      category: '饮食习惯',
      items: [
        { label: '食欲很好，吃什么都香', value: 'good_appetite' },
        { label: '喜欢吃温热食物', value: 'like_warm_food' },
        { label: '喜欢吃生冷食物', value: 'like_cold_food' },
        { label: '饮食不规律', value: 'irregular_diet' }
      ]
    },
    {
      category: '睡眠情况',
      items: [
        { label: '睡眠质量很好', value: 'good_sleep' },
        { label: '容易失眠', value: 'insomnia' },
        { label: '容易醒', value: 'easy_wake' },
        { label: '多梦', value: 'dreams' }
      ]
    }
  ];

  return (
    <div className="assessment-container">
      <Card title="中医体质辨识问卷" className="assessment-card">
        <p className="assessment-tip">请根据您最近一个月的身体状况，选择最符合您的情况</p>

        <Spin spinning={loading}>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
          >
            {questions.map((section, index) => (
              <div key={index} className="assessment-section">
                <h3>{section.category}</h3>
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row gutter={[16, 16]}>
                    {section.items.map((item, i) => (
                      <Col xs={24} sm={12} key={i}>
                        <Checkbox value={item.value}>
                          {item.label}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </div>
            ))}

            <div className="form-actions">
              <Button
                size="large"
                onClick={() => navigate('/tcm')}
              >
                取消
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={submitting}
                icon={<CheckCircleOutlined />}
              >
                提交评估
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default ConstitutionAssessment;
