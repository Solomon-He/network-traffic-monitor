import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertThreshold, NetworkSpeed } from '../models/network.model';
import { logger } from '../utils/logger';

export class AlertService {
  private io: Server;
  private thresholds: Map<string, AlertThreshold> = new Map();
  private alerts: Alert[] = [];
  private activeAlerts: Map<string, Alert> = new Map(); // 当前活跃的告警
  
  constructor(io: Server) {
    this.io = io;
  }
  
  /**
   * 设置告警阈值
   * @param threshold 告警阈值配置
   */
  setThreshold(threshold: AlertThreshold): void {
    this.thresholds.set(threshold.interface, threshold);
    logger.info(`设置告警阈值: ${JSON.stringify(threshold)}`);
  }
  
  /**
   * 获取告警阈值
   * @param interfaceName 网络接口名称
   * @returns 告警阈值配置
   */
  getThreshold(interfaceName: string): AlertThreshold | undefined {
    return this.thresholds.get(interfaceName);
  }
  
  /**
   * 获取所有告警阈值
   * @returns 所有告警阈值配置
   */
  getAllThresholds(): AlertThreshold[] {
    return Array.from(this.thresholds.values());
  }
  
  /**
   * 删除告警阈值
   * @param interfaceName 网络接口名称
   */
  removeThreshold(interfaceName: string): void {
    this.thresholds.delete(interfaceName);
    logger.info(`删除告警阈值: ${interfaceName}`);
  }
  
  /**
   * 检查网络速率是否超过阈值
   * @param speeds 网络速率数据
   */
  checkAlerts(speeds: NetworkSpeed[]): void {
    speeds.forEach(speed => {
      const threshold = this.thresholds.get(speed.interface);
      
      if (threshold && threshold.enabled) {
        // 检查接收速率
        if (speed.rx_speed > threshold.rx_speed_threshold) {
          this.createAlert(speed.interface, 'rx_speed', speed.rx_speed, threshold.rx_speed_threshold, speed.timestamp);
        } else {
          this.resolveAlert(speed.interface, 'rx_speed');
        }
        
        // 检查发送速率
        if (speed.tx_speed > threshold.tx_speed_threshold) {
          this.createAlert(speed.interface, 'tx_speed', speed.tx_speed, threshold.tx_speed_threshold, speed.timestamp);
        } else {
          this.resolveAlert(speed.interface, 'tx_speed');
        }
      }
    });
  }
  
  /**
   * 创建告警
   * @param interfaceName 网络接口名称
   * @param type 告警类型
   * @param value 当前值
   * @param threshold 阈值
   * @param timestamp 时间戳
   */
  private createAlert(
    interfaceName: string,
    type: 'rx_speed' | 'tx_speed',
    value: number,
    threshold: number,
    timestamp: number
  ): void {
    // 检查是否已经存在相同类型的活跃告警
    const alertKey = `${interfaceName}-${type}`;
    
    if (!this.activeAlerts.has(alertKey)) {
      const alert: Alert = {
        id: uuidv4(),
        interface: interfaceName,
        timestamp,
        type,
        value,
        threshold,
        message: `${interfaceName} 的 ${type === 'rx_speed' ? '接收' : '发送'}速率 ${(value / 1024).toFixed(2)} KB/s 超过阈值 ${(threshold / 1024).toFixed(2)} KB/s`,
        resolved: false
      };
      
      // 添加到告警列表
      this.alerts.push(alert);
      // 添加到活跃告警
      this.activeAlerts.set(alertKey, alert);
      
      // 通过 WebSocket 推送告警
      this.io.emit('alert', alert);
      
      logger.warn(`告警: ${alert.message}`);
    } else {
      // 更新现有告警的值
      const existingAlert = this.activeAlerts.get(alertKey);
      if (existingAlert) {
        existingAlert.value = value;
        existingAlert.message = `${interfaceName} 的 ${type === 'rx_speed' ? '接收' : '发送'}速率 ${(value / 1024).toFixed(2)} KB/s 超过阈值 ${(threshold / 1024).toFixed(2)} KB/s`;
        
        // 通过 WebSocket 推送更新的告警
        this.io.emit('alert-update', existingAlert);
      }
    }
  }
  
  /**
   * 解决告警
   * @param interfaceName 网络接口名称
   * @param type 告警类型
   */
  private resolveAlert(interfaceName: string, type: 'rx_speed' | 'tx_speed'): void {
    const alertKey = `${interfaceName}-${type}`;
    const alert = this.activeAlerts.get(alertKey);
    
    if (alert) {
      // 更新告警状态
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      
      // 从活跃告警中移除
      this.activeAlerts.delete(alertKey);
      
      // 通过 WebSocket 推送告警解决消息
      this.io.emit('alert-resolved', alert);
      
      logger.info(`告警已解决: ${alert.message}`);
    }
  }
  
  /**
   * 获取所有告警
   * @param resolved 是否包含已解决的告警
   * @returns 告警列表
   */
  getAlerts(resolved: boolean = false): Alert[] {
    if (resolved) {
      return this.alerts;
    } else {
      return this.alerts.filter(alert => !alert.resolved);
    }
  }
} 