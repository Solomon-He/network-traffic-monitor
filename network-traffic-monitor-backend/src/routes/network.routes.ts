import { Router } from 'express';
import { RequestHandler } from 'express';
import { 
  getNetworkInterfaces, 
  getNetworkStats,
  getNetworkStatsHistory,
  getNetworkSpeedHistory
} from '../controllers/network.controller';

const router = Router();

// 获取网络接口列表
router.get('/interfaces', getNetworkInterfaces as RequestHandler);

// 获取网络流量统计
router.get('/stats', getNetworkStats as RequestHandler);

// 获取历史网络流量统计数据
router.get('/stats/history', getNetworkStatsHistory as RequestHandler);

// 获取历史网络流量速率数据
router.get('/speed/history', getNetworkSpeedHistory as RequestHandler);

export default router;
