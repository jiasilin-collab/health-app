import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './App.css';

// 页面组件
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Nutrition from './pages/Nutrition';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Tcm from './pages/Tcm';
import Profile from './pages/Profile';
import MineralDetail from './pages/MineralDetail';
import ConstitutionAssessment from './pages/ConstitutionAssessment';
import ConstitutionResult from './pages/ConstitutionResult';

// 布局组件
import MainLayout from './components/Layout/MainLayout';

// 路由守卫
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          {/* 公共路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 主应用路由（带导航栏） */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/nutrition" element={<MainLayout><Nutrition /></MainLayout>} />
          <Route path="/nutrition/mineral/:id" element={<MainLayout><MineralDetail /></MainLayout>} />
          <Route path="/recipes" element={<MainLayout><Recipes /></MainLayout>} />
          <Route path="/recipes/:id" element={<MainLayout><RecipeDetail /></MainLayout>} />
          <Route path="/tcm" element={<MainLayout><Tcm /></MainLayout>} />
          <Route path="/tcm/assessment" element={<MainLayout><ConstitutionAssessment /></MainLayout>} />
          <Route path="/tcm/result/:id" element={<MainLayout><ConstitutionResult /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />

          {/* 默认重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
