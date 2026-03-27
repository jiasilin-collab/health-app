import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, message, Row, Col, Avatar, Statistic } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import './Profile.css';

const { Option } = Select;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        form.setFieldsValue({
          nickname: userData.nickname,
          phone: userData.phone,
          gender: userData.gender,
          birthday: userData.birthday ? dayjs(userData.birthday) : null,
          height: userData.height,
          weight: userData.weight
        });
      }
    } catch (error) {
      message.error('加载用户信息失败');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/api/auth/user', {
        nickname: values.nickname,
        gender: values.gender,
        birthday: values.birthday ? values.birthday.format('YYYY-MM-DD') : null,
        height: values.height,
        weight: values.weight
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        message.success('更新成功');
        setUser(response.data.data);
      }
    } catch (error) {
      message.error(error.response?.data?.error || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <Card loading={!user} className="profile-header">
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={6}>
            <div className="avatar-section">
              <Avatar size={100} icon={<UserOutlined />} style={{ background: '#52c41a' }} />
            </div>
          </Col>
          <Col xs={24} md={18}>
            <h1 className="user-name">{user?.nickname || '用户'}</h1>
            <p className="user-phone">📱 {user?.phone}</p>
            {user?.bmi && (
              <div className="user-bmi">
                <Statistic
                  title="BMI指数"
                  value={user.bmi.toFixed(1)}
                  suffix={user.bmi < 18.5 ? '偏瘦' : user.bmi > 24 ? '偏胖' : '正常'}
                  valueStyle={{
                    color: user.bmi < 18.5 || user.bmi > 24 ? '#faad14' : '#52c41a'
                  }}
                />
              </div>
            )}
          </Col>
        </Row>
      </Card>

      <Card title="基本信息" className="profile-form">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="昵称"
                name="nickname"
                rules={[{ required: true, message: '请输入昵称' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入昵称" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="性别"
                name="gender"
              >
                <Select placeholder="请选择性别" allowClear>
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="出生日期"
                name="birthday"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择出生日期"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="手机号"
                name="phone"
              >
                <Input prefix={<PhoneOutlined />} disabled placeholder="手机号" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="身高（cm）"
                name="height"
              >
                <Input type="number" placeholder="请输入身高" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="体重（kg）"
                name="weight"
              >
                <Input type="number" placeholder="请输入体重" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              icon={<SaveOutlined />}
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
