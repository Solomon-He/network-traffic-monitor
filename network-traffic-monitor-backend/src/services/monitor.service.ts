import { Server } from 'socket.io';
import { NetworkService } from './network.service';
import { HistoryService } from './history.service';
import { AlertService } from './alert.service';
import { NetworkStats, NetworkSpeed, AlertThreshold } from '../models/network.model';
import { logger } from '../utils/logger';

export class MonitorService {
  private networkService: NetworkService;
  private historyService: HistoryService;
  private alertService: AlertService;
  private io: Server;
  private monitorInterval: NodeJS.Timeout | null = null;
  private intervalTime: number = 1000; // 默认1秒更新一次
  private previousStats: Map<string, NetworkStats> = new Map();
  
  constructor(io: Server) {
    this.networkService = new NetworkService();
    this.historyService = new HistoryService();
    this.alertService = new AlertService(io);
    this.io = io;
  }

  /**
   * 启动网络监控
   * @param interval 更新间隔（毫秒）
   */
  startMonitoring(interval: number = 1000): void {
    this.intervalTime = interval;
    
    // 如果已经在监控，先停止
    if (this.monitorInterval) {
      this.stopMonitoring();
    }
    
    logger.info(`开始网络监控，更新间隔: ${interval}ms`);
    
    // 启动定时器，定期收集网络数据
    this.monitorInterval = setInterval(async () => {
      try {
        // 获取当前网络统计数据
        const currentStats = await this.networkService.getNetworkStats();
        
        // 计算网络速率
        const speeds = this.calculateSpeeds(currentStats);
        
        // 保存到历史记录
        this.historyService.addNetworkStats(currentStats);
        this.historyService.addNetworkSpeeds(speeds);
        
        // 检查告警
        this.alertService.checkAlerts(speeds);
        
        // 通过 WebSocket 推送数据
        this.io.emit('network-stats', currentStats);
        this.io.emit('network-speeds', speeds);
        
        // 更新上一次的统计数据
        currentStats.forEach(stat => {
          this.previousStats.set(stat.interface, stat);
        });
      } catch (error) {
        logger.error('监控网络数据失败:', error);
      }
    }, this.intervalTime);
  }

  /**
   * 停止网络监控
   */
  stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      logger.info('停止网络监控');
    }
  }

  /**
   * 获取指定网络接口的历史统计数据
   * @param interfaceName 网络接口名称
   * @param duration 查询时长（毫秒）
   * @returns 历史统计数据
   */
  getStatsHistory(interfaceName: string, duration: number = 3600000): NetworkStats[] {
    return this.historyService.getStatsHistory(interfaceName, duration);
  }

  /**
   * 获取指定网络接口的历史速率数据
   * @param interfaceName 网络接口名称
   * @param duration 查询时长（毫秒）
   * @returns 历史速率数据
   */
  getSpeedHistory(interfaceName: string, duration: number = 3600000): NetworkSpeed[] {
    return this.historyService.getSpeedHistory(interfaceName, duration);
  }

  /**
   * 设置告警阈值
   * @param threshold 告警阈值配置
   */
  setAlertThreshold(threshold: AlertThreshold): void {
    this.alertService.setThreshold(threshold);
  }

  /**
   * 获取告警阈值
   * @param interfaceName 网络接口名称
   * @returns 告警阈值配置
   */
  getAlertThreshold(interfaceName: string): AlertThreshold | undefined {
    return this.alertService.getThreshold(interfaceName);
  }

  /**
   * 获取所有告警阈值
   * @returns 所有告警阈值配置
   */
  getAllAlertThresholds(): AlertThreshold[] {
    return this.alertService.getAllThresholds();
  }

  /**
   * 删除告警阈值
   * @param interfaceName 网络接口名称
   */
  removeAlertThreshold(interfaceName: string): void {
    this.alertService.removeThreshold(interfaceName);
  }

  /**
   * 获取所有告警
   * @param includeResolved 是否包含已解决的告警
   * @returns 告警列表
   */
  getAlerts(includeResolved: boolean = false): any[] {
    return this.alertService.getAlerts(includeResolved);
  }

  /**
   * 计算网络速率
   * @param currentStats 当前网络统计数据
   * @returns 网络速率数据
   */
  private calculateSpeeds(currentStats: NetworkStats[]): NetworkSpeed[] {
    const speeds: NetworkSpeed[] = [];
    
    currentStats.forEach(current => {
      // 直接使用 systeminformation 提供的速率值
      // 注意：第一次调用时，rx_sec 和 tx_sec 可能为 null
      const rx_speed = current.rx_sec !== null ? current.rx_sec : 0;
      const tx_speed = current.tx_sec !== null ? current.tx_sec : 0;
      
      speeds.push({
        interface: current.interface,
        timestamp: current.timestamp,
        rx_speed,
        tx_speed
      });
    });
    
    return speeds;
  }
} 