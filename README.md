# 🌐 网络流量监测工具

<div align="center">
  
  ![版本](https://img.shields.io/badge/版本-1.0.0-blue)
  ![许可证](https://img.shields.io/badge/许可证-MIT-green)
  ![Node](https://img.shields.io/badge/Node.js-v18+-yellow)
  ![Vue](https://img.shields.io/badge/Vue-v3.5+-42b883)
  
</div>

一个实时监控和分析本机网络流量的工具，提供直观的数据可视化和告警功能。

---

## 📋 项目概述

网络流量监测工具是一个全栈应用程序，能够实时统计本机的网络流量信息，包括接收和发送的数据包数量、字节数等，并将统计结果以图表或数字的形式展示给用户。该工具还提供告警功能，当网络流量超过设定阈值时发出警报。

## ✨ 功能特点

- **📊 实时监控**：实时监控本机网络接口的流量数据
- **🔌 多接口支持**：支持监控系统上的多个网络接口
- **📈 数据可视化**：使用图表直观展示网络流量数据
- **🔍 历史数据查询**：查看历史网络流量统计和速率数据
- **⚠️ 告警功能**：设置流量阈值，超过阈值时发出警报
- **📝 告警日志**：记录和查看历史告警信息
- **🌓 主题切换**：支持明暗两套主题（Light/Dark mode）

## 🛠️ 技术栈

### 🖥️ 前端

- **框架**：Vue 3 (Composition API) <img src="https://api.iconify.design/logos:vue.svg" width="16" height="16"/>
- **状态管理**：Pinia <img src="https://api.iconify.design/logos:pinia.svg" width="16" height="16"/>
- **路由**：Vue Router
- **数据可视化**：ECharts <img src="https://api.iconify.design/logos:echarts.svg" width="16" height="16"/>
- **UI组件库**：Element Plus <img src="https://api.iconify.design/logos:element.svg" width="16" height="16"/>
- **样式**：SCSS <img src="https://api.iconify.design/logos:sass.svg" width="16" height="16"/>
- **类型检查**：TypeScript <img src="https://api.iconify.design/logos:typescript-icon.svg" width="16" height="16"/>
- **HTTP客户端**：Axios
- **实时通信**：Socket.io Client <img src="https://api.iconify.design/logos:socket-io.svg" width="16" height="16"/>
- **构建工具**：Vite <img src="https://api.iconify.design/logos:vitejs.svg" width="16" height="16"/>

### ⚙️ 后端

- **运行环境**：Node.js <img src="https://api.iconify.design/logos:nodejs-icon.svg" width="16" height="16"/>
- **框架**：Express <img src="https://api.iconify.design/logos:express.svg" width="16" height="16"/>
- **实时通信**：Socket.io <img src="https://api.iconify.design/logos:socket-io.svg" width="16" height="16"/>
- **系统信息获取**：systeminformation
- **日志记录**：Winston
- **类型检查**：TypeScript <img src="https://api.iconify.design/logos:typescript-icon.svg" width="16" height="16"/>
- **安全**：Helmet <img src="https://api.iconify.design/logos:helmet.svg" width="16" height="16"/>
- **跨域**：CORS

## 📥 安装步骤

### 前提条件

- Node.js (v18+) <img src="https://api.iconify.design/logos:nodejs-icon.svg" width="16" height="16"/>
- pnpm (前端) <img src="https://api.iconify.design/logos:pnpm.svg" width="16" height="16"/> 或 npm (后端) <img src="https://api.iconify.design/logos:npm-icon.svg" width="16" height="16"/>

### 后端安装

```bash
# 进入后端目录
cd network-traffic-monitor-backend

# 安装依赖
npm install

# 开发模式启动
npm run dev

# 构建生产版本
npm run build

# 启动生产版本
npm start
```

### 前端安装

```bash
# 进入前端目录
cd network-traffic-monitor-frontend

# 安装依赖
pnpm install

# 开发模式启动
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 📖 使用说明

1. 🚀 启动后端服务器
2. 🚀 启动前端应用
3. 🌐 在浏览器中访问前端应用（默认为 http://localhost:5173）
4. 📊 在仪表盘页面查看网络概览和实时流量数据
5. 📈 在详细监测页面查看详细的网络流量统计和速率数据
6. ⚙️ 通过告警设置功能设置流量阈值
7. 📝 查看告警日志了解历史告警信息

## 📂 项目结构

### 🖥️ 前端结构

```
network-traffic-monitor-frontend/
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 资源文件（图片、样式等）
│   ├── components/         # 可复用组件
│   ├── router/             # 路由配置
│   ├── services/           # API服务
│   ├── stores/             # Pinia状态管理
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   ├── views/              # 页面视图组件
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── .editorconfig           # 编辑器配置
├── .gitignore              # Git忽略文件
├── index.html              # HTML模板
├── package.json            # 项目依赖和脚本
├── tsconfig.json           # TypeScript配置
└── vite.config.ts          # Vite配置
```

### ⚙️ 后端结构

```
network-traffic-monitor-backend/
├── src/
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── middlewares/        # 中间件
│   ├── models/             # 数据模型
│   ├── routes/             # 路由定义
│   ├── services/           # 业务逻辑服务
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   ├── app.ts              # Express应用配置
│   └── index.ts            # 应用入口
├── logs/                   # 日志文件
├── .env                    # 环境变量
├── .gitignore              # Git忽略文件
├── package.json            # 项目依赖和脚本
└── tsconfig.json           # TypeScript配置
```

## 📚 API文档

详细的API文档请参考 [API文档](network-traffic-monitor-frontend/api-docs.md)。

## 💻 开发规范

- 🧩 使用 Vue 3 的 Composition API 进行开发
- 📦 模块化开发，遵循单一职责原则
- 🔒 使用 TypeScript 进行开发，确保类型安全
- ♻️ 组件设计遵循可复用性原则
- 🎨 使用 SCSS 进行样式开发，采用 BEM 命名规范
- 🌐 使用 Axios 进行网络请求，统一封装请求和响应拦截器
- 📊 使用 Pinia 进行状态管理，按功能模块拆分 store
- ♿ 遵循无障碍设计原则 (WCAG)，提高应用的可访问性

## 📄 许可证

[MIT](LICENSE) © 2024 