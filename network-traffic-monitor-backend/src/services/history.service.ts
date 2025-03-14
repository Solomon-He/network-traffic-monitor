import { NetworkStats, NetworkSpeed } from '../models/network.model';
import { logger } from '../utils/logger';

/**
 * 历史数据存储服务
 * 用于存储和查询历史网络流量数据
 */
export class HistoryService {
  // 存储网络统计数据的历史记录
  private statsHistory: Map<string, NetworkStats[]> = new Map();
  // 存储网络速率数据的历史记录
  private speedHistory: Map<string, NetworkSpeed[]> = new Map();
  // 历史数据保留时间（毫秒）
  private retentionTime: number = 3600000; // 默认保留1小时
  // 清理定时器
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor(retentionTime: number = 3600000) {
    this.retentionTime = retentionTime;
    this.startCleanupTimer();
  }
  
  /**
   * 添加网络统计数据到历史记录
   * @param stats 网络统计数据
   */
  addNetworkStats(stats: NetworkStats[]): void {
    stats.forEach(stat => {
      const interfaceName = stat.interface;
      
      if (!this.statsHistory.has(interfaceName)) {
        this.statsHistory.set(interfaceName, []);
      }
      
      const history = this.statsHistory.get(interfaceName);
      if (history) {
        history.push(stat);
      }
    });
  }
  
  /**
   * 添加网络速率数据到历史记录
   * @param speeds 网络速率数据
   */
  addNetworkSpeeds(speeds: NetworkSpeed[]): void {
    speeds.forEach(speed => {
      const interfaceName = speed.interface;
      
      if (!this.speedHistory.has(interfaceName)) {
        this.speedHistory.set(interfaceName, []);
      }
      
      const history = this.speedHistory.get(interfaceName);
      if (history) {
        history.push(speed);
      }
    });
  }
  
  /**
   * 获取指定网络接口的历史统计数据
   * @param interfaceName 网络接口名称
   * @param duration 查询时长（毫秒），默认为1小时
   * @returns 历史统计数据
   */
  getStatsHistory(interfaceName: string, duration: number = 3600000): NetworkStats[] {
    const history = this.statsHistory.get(interfaceName) || [];
    const now = Date.now();
    
    // 过滤出指定时间范围内的数据
    return history.filter(stat => now - stat.timestamp <= duration);
  }
  
  /**
   * 获取指定网络接口的历史速率数据
   * @param interfaceName 网络接口名称
   * @param duration 查询时长（毫秒），默认为1小时
   * @returns 历史速率数据
   */
  getSpeedHistory(interfaceName: string, duration: number = 3600000): NetworkSpeed[] {
    const history = this.speedHistory.get(interfaceName) || [];
    const now = Date.now();
    
    // 过滤出指定时间范围内的数据
    return history.filter(speed => now - speed.timestamp <= duration);
  }
  
  /**
   * 清理过期的历史数据
   */
  private cleanupHistory(): void {
    const now = Date.now();
    
    // 清理统计数据历史记录
    this.statsHistory.forEach((history, interfaceName) => {
      const filteredHistory = history.filter(stat => now - stat.timestamp <= this.retentionTime);
      this.statsHistory.set(interfaceName, filteredHistory);
    });
    
    // 清理速率数据历史记录
    this.speedHistory.forEach((history, interfaceName) => {
      const filteredHistory = history.filter(speed => now - speed.timestamp <= this.retentionTime);
      this.speedHistory.set(interfaceName, filteredHistory);
    });
    
    logger.debug(`已清理过期历史数据，当前保留时间: ${this.retentionTime}ms`);
  }
  
  /**
   * 启动定时清理任务
   */
  private startCleanupTimer(): void {
    // 每10分钟清理一次过期数据
    this.cleanupInterval = setInterval(() => {
      this.cleanupHistory();
    }, 600000);
  }
  
  /**
   * 停止定时清理任务
   */
  stopCleanupTimer(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
} 