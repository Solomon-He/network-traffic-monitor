/**
 * 告警阈值设置
 */
export interface AlertThreshold {
  interface: string // 网络接口名称
  rx_speed_threshold: number // 接收速率阈值 (bytes/s)
  tx_speed_threshold: number // 发送速率阈值 (bytes/s)
  enabled: boolean // 是否启用告警
}

/**
 * 告警信息
 */
export interface Alert {
  id: string // 告警ID
  interface: string // 网络接口名称
  timestamp: number // 时间戳
  type: 'rx_speed' | 'tx_speed' // 告警类型
  value: number // 当前值
  threshold: number // 阈值
  message: string // 告警消息
  resolved: boolean // 是否已解决
  resolvedAt?: number // 解决时间
}

/**
 * 告警查询参数
 */
export interface AlertQueryParams {
  resolved?: boolean // 是否包含已解决的告警，默认为 false
}
