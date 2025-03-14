// 网络接口数据结构
export interface NetworkInterface {
  name: string;          // 网络接口名称
  ip: string;            // IP地址
  mac: string;           // MAC地址
  isUp: boolean;         // 是否启用
}

// 网络流量数据结构
export interface NetworkStats {
  interface: string;     // 网络接口名称
  timestamp: number;     // 时间戳
  rx_bytes: number;      // 接收字节数
  tx_bytes: number;      // 发送字节数
  rx_packets: number;    // 接收数据包数
  tx_packets: number;    // 发送数据包数
  rx_errors: number;     // 接收错误数
  tx_errors: number;     // 发送错误数
  rx_sec: number;        // 接收速率 (bytes/s)
  tx_sec: number;        // 发送速率 (bytes/s)
}

// 网络流量速率
export interface NetworkSpeed {
  interface: string;     // 网络接口名称
  timestamp: number;     // 时间戳
  rx_speed: number;      // 接收速率 (bytes/s)
  tx_speed: number;      // 发送速率 (bytes/s)
}

// 告警阈值配置
export interface AlertThreshold {
  interface: string;     // 网络接口名称
  rx_speed_threshold: number;  // 接收速率阈值 (bytes/s)
  tx_speed_threshold: number;  // 发送速率阈值 (bytes/s)
  enabled: boolean;      // 是否启用告警
}

// 告警数据
export interface Alert {
  id: string;            // 告警ID
  interface: string;     // 网络接口名称
  timestamp: number;     // 时间戳
  type: 'rx_speed' | 'tx_speed';  // 告警类型
  value: number;         // 当前值
  threshold: number;     // 阈值
  message: string;       // 告警消息
  resolved: boolean;     // 是否已解决
  resolvedAt?: number;   // 解决时间
}
