import React from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  HomeOutlined,
  HeartOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/nutrition', icon: <HeartOutlined />, label: '微量元素' },
    { key: '/recipes', icon: <BookOutlined />, label: '营养食谱' },
    { key: '/tcm', icon: <MedicineBoxOutlined />, label: '中医理疗' },
    { key: '/profile', icon: <UserOutlined />, label: '我的' }
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#52c41a',
            marginRight: '40px'
          }}>
            🌿 全生命周期健康
          </span>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: 'none', flex: 1 }}
          />
        </div>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar
            icon={<UserOutlined />}
            style={{
              cursor: 'pointer',
              background: '#52c41a'
            }}
          />
        </Dropdown>
      </Header>

      <Content style={{
        padding: '24px',
        minHeight: 'calc(100vh - 64px)',
        background: '#f5f5f5'
      }}>
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;
