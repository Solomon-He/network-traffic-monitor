import { Request, Response } from 'express';
import { NetworkService } from '../services/network.service';

// 创建网络服务实例
const networkService = new NetworkService();

// 获取网络接口列表
export const getNetworkInterfaces = async (req: Request, res: Response) => {
  try {
    const interfaces = await networkService.getNetworkInterfaces();
    res.json(interfaces);
  } catch (error) {
    console.error('获取网络接口失败:', error);
    res.status(500).json({ error: '获取网络接口失败' });
  }
};

// 获取网络流量统计
export const getNetworkStats = async (req: Request, res: Response) => {
  try {
    const stats = await networkService.getNetworkStats();
    res.json(stats);
  } catch (error) {
    console.error('获取网络统计失败:', error);
    res.status(500).json({ error: '获取网络统计失败' });
  }
};

// 获取历史网络流量统计数据
export const getNetworkStatsHistory = async (req: Request, res: Response) => {
  try {
    const { interface: interfaceName, duration } = req.query;
    
    if (!interfaceName) {
      return res.status(400).json({ error: '缺少网络接口名称参数' });
    }
    
    // 将持续时间转换为毫秒
    const durationMs = duration ? parseInt(duration as string) * 1000 : 3600000;
    
    // 从请求对象中获取监控服务
    const monitorService = (req as any).monitorService;
    
    const history = monitorService.getStatsHistory(interfaceName as string, durationMs);
    res.json(history);
  } catch (error) {
    console.error('获取历史网络统计失败:', error);
    res.status(500).json({ error: '获取历史网络统计失败' });
  }
};

// 获取历史网络流量速率数据
export const getNetworkSpeedHistory = async (req: Request, res: Response) => {
  try {
    const { interface: interfaceName, duration } = req.query;
    
    if (!interfaceName) {
      return res.status(400).json({ error: '缺少网络接口名称参数' });
    }
    
    // 将持续时间转换为毫秒
    const durationMs = duration ? parseInt(duration as string) * 1000 : 3600000;
    
    // 从请求对象中获取监控服务
    const monitorService = (req as any).monitorService;
    
    const history = monitorService.getSpeedHistory(interfaceName as string, durationMs);
    res.json(history);
  } catch (error) {
    console.error('获取历史网络速率失败:', error);
    res.status(500).json({ error: '获取历史网络速率失败' });
  }
};
