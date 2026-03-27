#!/bin/bash

# 启动后端服务
cd backend
gnome-terminal -- npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 5

# 启动前端服务
cd ../frontend
gnome-terminal -- npm start &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  [✓] 服务已启动"
echo "========================================"
echo ""
echo "后端: http://localhost:3000"
echo "前端: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 等待任意键停止
read
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "服务已停止"
