import { Request, Response } from 'express';
import { AlertThreshold } from '../models/network.model';

// 设置告警阈值
export const setAlertThreshold = async (req: Request, res: Response) => {
  try {
    const threshold: AlertThreshold = req.body;
    
    if (!threshold.interface) {
      return res.status(400).json({ error: '缺少网络接口名称' });
    }
    
    // 从请求对象中获取监控服务
    const monitorService = (req as any).monitorService;
    
    monitorService.setAlertThreshold(threshold);
    res.json({ success: true, message: '设置告警阈值成功' });
  } catch (error) {
    console.error('设置告警阈值失败:', error);
    res.status(500).json({ error: '设置告警阈值失败' });
  }
};

// 获取告警阈值
export const getAlertThreshold = async (req: Request, res: Response) => {
  try {
    const { interface: interfaceName } = req.params;
    
    if (!interfaceName) {
      return res.status(400).json({ error: '缺少网络接口名称' });
    }
    
    // 从请求对象中获取监控服务
    const monitorService = (req as any).monitorService;
    
    const threshold = monitorService.getAlertThreshold(interfaceName);
    
    if (!threshold) {
      return res.status(404).json({ error: '未找到告警阈值' });
    }
    
    res.json(threshold);
  } catch (error) {
    console.error('获取告警阈值失败:', error);
    res.status(500).json({ error: '获取告警阈值失败' });
  }
};

// 获取所有告警阈值
export const getAllAlertThresholds = async (req: Request, res: Response) => {
  try {
    // 从请求对象中获取监控服务
    const monitorService = (req as any).monitorService;
    
    const thresholds = monitorService.getAllAlertThresholds();
    res.json(thresholds);
  } catch (error) {
    console.error('获取所有告警阈值失败:', error);
    res.status(500).json({ error: '获取所有告警阈值失败' });
  }
};

// 删除告警阈值
export const deleteAlertThreshold = async (req: Request, res: Response) => {
  try {
    const { interface: interfaceName } = req.params;
    
    if (!interfaceName) {
      return res.status(400).json({ error: '缺少网络接口名称' });
    }
    
    // 从请求对象中获取监控服务
    const monitorService = (req as any).monitorService;
    
    monitorService.removeAlertThreshold(interfaceName);
    res.json({ success: true, message: '删除告警阈值成功' });
  } catch (error) {
    console.error('删除告警阈值失败:', error);
    res.status(500).json({ error: '删除告警阈值失败' });
  }
};

// 获取所有告警
export const getAlerts = async (req: Request, res: Response) => {
  try {
    const { resolved } = req.query;
    const includeResolved = resolved === 'true';
    
    // 从请求对象中获取监控服务
    const monitorService = (req as any).monitorService;
    
    const alerts = monitorService.getAlerts(includeResolved);
    res.json(alerts);
  } catch (error) {
    console.error('获取告警失败:', error);
    res.status(500).json({ error: '获取告警失败' });
  }
}; 