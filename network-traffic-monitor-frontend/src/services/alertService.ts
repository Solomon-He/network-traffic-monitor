import api from './api'
import type { AlertThreshold, Alert, AlertQueryParams } from '@/types/alert'

/**
 * 告警服务
 */
export const alertService = {
  /**
   * 设置告警阈值
   * @param threshold 告警阈值设置
   * @returns 设置结果
   */
  async setThreshold(threshold: AlertThreshold): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      '/api/alert/thresholds',
      threshold,
    )
    return response.data
  },

  /**
   * 获取所有告警阈值
   * @returns 所有告警阈值设置
   */
  async getAllThresholds(): Promise<AlertThreshold[]> {
    const response = await api.get<AlertThreshold[]>('/api/alert/thresholds')
    return response.data
  },

  /**
   * 获取特定接口的告警阈值
   * @param interfaceName 网络接口名称
   * @returns 特定接口的告警阈值设置
   */
  async getThreshold(interfaceName: string): Promise<AlertThreshold> {
    const response = await api.get<AlertThreshold>(`/api/alert/thresholds/${interfaceName}`)
    return response.data
  },

  /**
   * 删除告警阈值
   * @param interfaceName 网络接口名称
   * @returns 删除结果
   */
  async deleteThreshold(interfaceName: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/alert/thresholds/${interfaceName}`,
    )
    return response.data
  },

  /**
   * 获取所有告警
   * @param params 查询参数
   * @returns 告警列表
   */
  async getAlerts(params?: AlertQueryParams): Promise<Alert[]> {
    const response = await api.get<Alert[]>('/api/alert/alerts', { params })
    return response.data
  },
}
