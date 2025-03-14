import si, { Systeminformation } from 'systeminformation';
import { NetworkInterface, NetworkStats } from '../models/network.model';
import { logger } from '../utils/logger';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';

// 将 exec 转换为 Promise 版本
const execPromise = promisify(exec);

export class NetworkService {
  // 获取网络接口列表
  async getNetworkInterfaces(): Promise<NetworkInterface[]> {
    try {
      const networkInterfaces = await si.networkInterfaces();
      
      // 确保 networkInterfaces 是数组
      const interfacesArray = Array.isArray(networkInterfaces) ? networkInterfaces : [networkInterfaces];
      
      return interfacesArray.map((iface: Systeminformation.NetworkInterfacesData) => ({
        name: iface.iface,
        ip: iface.ip4,
        mac: iface.mac,
        isUp: iface.operstate === 'up'
      }));
    } catch (error) {
      console.error('获取网络接口失败:', error);
      throw error;
    }
  }

  // 获取网络流量统计
  async getNetworkStats(): Promise<NetworkStats[]> {
    try {
      // 获取 systeminformation 的网络统计数据
      const networkStats = await si.networkStats();
      const statsArray = Array.isArray(networkStats) ? networkStats : [networkStats];
      
      // 获取 Windows netstat -e 命令的数据包信息
      let packetsInfo = { rx: 0, tx: 0 };
      if (os.platform() === 'win32') {
        packetsInfo = await this.getPacketsFromNetstat();
      }
      
      // 合并数据
      return statsArray.map((stat: Systeminformation.NetworkStatsData) => {
        
        // 分配数据包数量
        const rx_packets = packetsInfo.rx
        const tx_packets = packetsInfo.tx
        
        return {
          interface: stat.iface,
          timestamp: Date.now(),
          rx_bytes: stat.rx_bytes,
          tx_bytes: stat.tx_bytes,
          rx_packets,
          tx_packets,
          rx_errors: stat.rx_errors,
          tx_errors: stat.tx_errors,
          rx_sec: stat.rx_sec || 0,
          tx_sec: stat.tx_sec || 0
        };
      });
    } catch (error) {
      console.error('获取网络统计失败:', error);
      throw error;
    }
  }
  
  /**
   * 从 netstat -e 命令获取数据包信息
   * @returns 接收和发送的数据包数量
   */
  private async getPacketsFromNetstat(): Promise<{ rx: number, tx: number }> {
    try {
      // 执行 netstat -e 命令
      const { stdout } = await execPromise('netstat -e', { encoding: 'utf8' });
      const lines = stdout.split('\n');
      
      let rxPackets = 0;
      let txPackets = 0;
      
      // 查找包含数字的行
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // 检查是否包含数字
        if (/\d+/.test(line)) {
          const numbers = line.match(/\d+/g);
          if (numbers && numbers.length >= 2) {
            // 根据行号判断数据类型
            // 第6行通常是单播数据包行
            if (i === 5 || i === 6) {
              rxPackets += parseInt(numbers[numbers.length - 2].replace(/,/g, ''), 10);
              txPackets += parseInt(numbers[numbers.length - 1].replace(/,/g, ''), 10);
              // logger.debug(`解析单播数据包: rx=${rxPackets}, tx=${txPackets}`);
            }
            // 第7行通常是非单播数据包行
            else if (i === 6 || i === 7) {
              rxPackets += parseInt(numbers[numbers.length - 2].replace(/,/g, ''), 10);
              txPackets += parseInt(numbers[numbers.length - 1].replace(/,/g, ''), 10);
              // logger.debug(`解析非单播数据包: rx=${rxPackets}, tx=${txPackets}`);
            }
          }
        }
      }
      
      // logger.debug(`最终数据包数量: rx=${rxPackets}, tx=${txPackets}`);
      return { rx: rxPackets, tx: txPackets };
    } catch (error) {
      logger.error('获取数据包信息失败:', error);
      return { rx: 0, tx: 0 };
    }
  }
}
