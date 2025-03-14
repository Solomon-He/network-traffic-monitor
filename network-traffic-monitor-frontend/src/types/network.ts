/**
 * 网络接口信息
 */
export interface NetworkInterface {
  name: string // 网络接口名称
  ip: string // IP地址
  mac: string // MAC地址
  isUp: boolean // 是否启用
}

/**
 * 网络流量统计数据
 */
export interface NetworkStats {
  interface: string // 网络接口名称
  timestamp: number // 时间戳
  rx_bytes: number // 接收字节数
  tx_bytes: number // 发送字节数
  rx_packets: number // 接收数据包数
  tx_packets: number // 发送数据包数
  rx_errors: number // 接收错误数
  tx_errors: number // 发送错误数
  rx_sec: number // 接收速率 (bytes/s)
  tx_sec: number // 发送速率 (bytes/s)
}

/**
 * 网络流量速率数据
 */
export interface NetworkSpeed {
  interface: string // 网络接口名称
  timestamp: number // 时间戳
  rx_speed: number // 接收速率 (bytes/s)
  tx_speed: number // 发送速率 (bytes/s)
}

/**
 * 历史数据查询参数
 */
export interface HistoryQueryParams {
  interface: string // 网络接口名称
  duration?: number // 查询时长（秒），默认为3600（1小时）
}
