import { httpServer } from './app';
import { logger } from './utils/logger';

// 获取端口
const PORT = process.env.PORT || 3000;

// 启动服务器
httpServer.listen(PORT, () => {
  logger.info(`服务器运行在 http://localhost:${PORT}`);
});
