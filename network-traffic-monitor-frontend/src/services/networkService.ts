import api from './api'
import type {
  NetworkInterface,
  NetworkStats,
  NetworkSpeed,
  HistoryQueryParams,
} from '@/types/network'

/**
 * 网络服务
 */
export const networkService = {
  /**
   * 获取网络接口列表
   * @returns 网络接口列表
   */
  async getInterfaces(): Promise<NetworkInterface[]> {
    const response = await api.get<NetworkInterface[]>('/api/network/interfaces')
    return response.data
  },

  /**
   * 获取网络流量统计
   * @returns 网络流量统计数据
   */
  async getStats(): Promise<NetworkStats[]> {
    const response = await api.get<NetworkStats[]>('/api/network/stats')
    return response.data
  },

  /**
   * 获取历史网络流量统计数据
   * @param params 查询参数
   * @returns 历史网络流量统计数据
   */
  async getStatsHistory(params: HistoryQueryParams): Promise<NetworkStats[]> {
    const response = await api.get<NetworkStats[]>('/api/network/stats/history', { params })
    return response.data
  },

  /**
   * 获取历史网络流量速率数据
   * @param params 查询参数
   * @returns 历史网络流量速率数据
   */
  async getSpeedHistory(params: HistoryQueryParams): Promise<NetworkSpeed[]> {
    const response = await api.get<NetworkSpeed[]>('/api/network/speed/history', { params })
    return response.data
  },
}
