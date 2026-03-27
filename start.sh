#!/bin/bash

echo ""
echo "========================================"
echo "  全生命周期健康管理App"
echo "  一键启动脚本"
echo "========================================"
echo ""

# 检查PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "[错误] 未检测到PostgreSQL，请先安装"
    echo "下载地址: https://www.postgresql.org/download/"
    exit 1
fi
echo "[✓] PostgreSQL 已安装"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到Node.js，请先安装"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi
echo "[✓] Node.js 已安装"

# 检查后端依赖
echo ""
echo "[1/4] 检查后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "正在安装后端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[错误] 后端依赖安装失败"
        exit 1
    fi
    echo "[✓] 后端依赖安装完成"
else
    echo "[✓] 后端依赖已存在"
fi

# 检查.env文件
echo ""
echo "[2/4] 检查环境配置..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "[✓] 已创建 .env 文件"
        echo ""
        echo "[!] 请编辑 backend/.env 文件，配置数据库信息："
        echo "    - DB_HOST: localhost"
        echo "    - DB_PORT: 5432"
        echo "    - DB_NAME: health_app"
        echo "    - DB_USER: postgres"
        echo "    - DB_PASSWORD: [你的数据库密码]"
        echo ""
        exit 0
    else
        echo "[错误] 缺少 .env.example 文件"
        exit 1
    fi
else
    echo "[✓] 环境配置文件已存在"
fi

# 检查数据库
echo ""
echo "[3/4] 检查数据库..."
read -p "请输入PostgreSQL密码（或直接回车跳过）: " DB_PASSWORD

if [ -n "$DB_PASSWORD" ]; then
    export PGPASSWORD=$DB_PASSWORD
    echo "正在检查数据库..."
    DB_EXISTS=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='health_app';")
    if [ "$DB_EXISTS" != "1" ]; then
        echo "正在创建数据库..."
        psql -U postgres -c "CREATE DATABASE health_app;" -q
        echo "[✓] 数据库创建成功"
    else
        echo "[✓] 数据库已存在"
    fi

    echo "正在导入数据表..."
    psql -U postgres -d health_app -f ../database/schema.sql -q
    if [ $? -eq 0 ]; then
        echo "[✓] 数据表导入完成"
    else
        echo "[警告] 数据表导入可能已存在"
    fi
    unset PGPASSWORD
fi

# 检查前端依赖
echo ""
echo "[4/4] 检查前端依赖..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "正在安装前端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[错误] 前端依赖安装失败"
        exit 1
    fi
    echo "[✓] 前端依赖安装完成"
else
    echo "[✓] 前端依赖已存在"
fi

# 完成提示
echo ""
echo "========================================"
echo "  [✓] 准备工作全部完成！"
echo "========================================"
echo ""
echo "启动方式："
echo ""
echo "方式1（推荐）: 分别启动前后端"
echo "  终端1: cd backend && npm run dev"
echo "  终端2: cd frontend && npm start"
echo ""
echo "方式2: 使用 ./start-all.sh 同时启动"
echo ""
echo "访问地址："
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:3000/health"
echo ""
