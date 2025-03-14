import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// 导入路由
import networkRoutes from './routes/network.routes';
import alertRoutes from './routes/alert.routes';
import { MonitorService } from './services/monitor.service';

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app: Express = express();
const httpServer = createServer(app);

// 设置中间件
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置 Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 初始化监控服务
const monitorService = new MonitorService(io);

// 自动启动监控服务
monitorService.startMonitoring(1000);
console.log('监控服务已自动启动');

// 处理 WebSocket 连接
io.on('connection', (socket) => {
  console.log('客户端已连接:', socket.id);
  
  // 客户端连接时，发送网络接口列表
  socket.emit('welcome', { message: '欢迎连接到网络流量监测工具' });
  socket.emit('monitoring-status', { status: 'started', interval: 1000 });
  
  // 客户端请求开始监控
  socket.on('start-monitoring', (data) => {
    const interval = data?.interval || 1000;
    monitorService.startMonitoring(interval);
    socket.emit('monitoring-status', { status: 'started', interval });
  });
  
  // 客户端请求停止监控
  socket.on('stop-monitoring', () => {
    monitorService.stopMonitoring();
    socket.emit('monitoring-status', { status: 'stopped' });
  });
  
  socket.on('disconnect', () => {
    console.log('客户端已断开连接:', socket.id);
  });
});

// 将监控服务添加到请求对象中
app.use((req: any, res, next) => {
  req.monitorService = monitorService;
  next();
});

// 设置路由
app.use('/api/network', networkRoutes);
app.use('/api/alert', alertRoutes);

// 根路由
app.get('/', (req, res) => {
  res.send('网络流量监测工具 API');
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('服务器错误');
});

// 导出 HTTP 服务器和 Socket.IO 实例
export { httpServer, io };
