import type { NetworkStats } from '@/types/network'

/**
 * 网络流量数据处理模块
 * 用于处理原始网络流量数据，生成图表所需的数据格式
 */

/**
 * 处理后的流量统计数据点类型
 */
export interface ProcessedDataPoint {
  timestamp: number
  rx_bytes: number
  tx_bytes: number
  rx_packets: number
  tx_packets: number
  time_label?: string // 格式化后的时间标签，可选
}

/**
 * 按数据条数间隔处理网络流量数据
 * @param originalData 原始网络流量数据
 * @param interval 数据条数间隔
 * @returns 处理后的数据点数组
 */
export function processNetworkData(
  originalData: NetworkStats[],
  interval: number,
): ProcessedDataPoint[] {
  if (!originalData || originalData.length === 0) {
    console.warn('原始数据为空，无法处理')
    return []
  }

  console.log(`开始处理网络数据，原始数据条数: ${originalData.length}, 间隔: ${interval}条`)

  // 确保数据按时间戳排序
  const sortedData = [...originalData].sort((a, b) => a.timestamp - b.timestamp)

  // 存储处理后的数据点
  const processedData: ProcessedDataPoint[] = []

  // 按照指定的数据条数间隔分组处理
  for (let i = 0; i < sortedData.length; i += interval) {
    // 确保有足够的数据形成一个完整的间隔
    if (i + interval <= sortedData.length) {
      const firstPoint = sortedData[i] // 间隔中的第一条数据
      const lastPoint = sortedData[i + interval - 1] // 间隔中的最后一条数据

      // 创建数据点
      processedData.push({
        timestamp: lastPoint.timestamp, // 使用最后一条数据的时间戳
        rx_bytes: lastPoint.rx_bytes - firstPoint.rx_bytes, // 接收字节数变化量
        tx_bytes: lastPoint.tx_bytes - firstPoint.tx_bytes, // 发送字节数变化量
        rx_packets: lastPoint.rx_packets - firstPoint.rx_packets, // 接收数据包数变化量
        tx_packets: lastPoint.tx_packets - firstPoint.tx_packets, // 发送数据包数变化量
      })
    }
  }

  // 处理剩余不足一个完整间隔的数据
  const remainingCount = sortedData.length % interval
  if (remainingCount > 1) {
    const firstPoint = sortedData[sortedData.length - remainingCount]
    const lastPoint = sortedData[sortedData.length - 1]

    processedData.push({
      timestamp: lastPoint.timestamp,
      rx_bytes: lastPoint.rx_bytes - firstPoint.rx_bytes,
      tx_bytes: lastPoint.tx_bytes - firstPoint.tx_bytes,
      rx_packets: lastPoint.rx_packets - firstPoint.rx_packets,
      tx_packets: lastPoint.tx_packets - firstPoint.tx_packets,
    })
  }

  console.log(`数据处理完成，生成了 ${processedData.length} 个数据点`)
  return processedData
}

/**
 * 为数据点添加格式化的时间标签
 * @param data 处理后的数据点数组
 * @returns 添加了时间标签的数据点数组
 */
export function addTimeLabels(data: ProcessedDataPoint[]): ProcessedDataPoint[] {
  return data.map((point) => ({
    ...point,
    time_label: formatTimeLabel(point.timestamp),
  }))
}

/**
 * 格式化时间戳为"时:分:秒"格式
 * @param timestamp 时间戳（秒）
 * @returns 格式化后的时间字符串
 */
export function formatTimeLabel(timestamp: number): string {
  // 检查时间戳是否合理
  const now = Math.floor(Date.now() / 1000)
  const oneDay = 24 * 60 * 60 // 一天的秒数

  // 如果时间戳与当前时间相差超过一天，可能是时间戳格式有问题
  // 这种情况下尝试将时间戳视为毫秒级时间戳
  let date
  if (Math.abs(now - timestamp) > oneDay) {
    // console.warn(`时间戳 ${timestamp} 可能不是秒级时间戳，尝试作为毫秒级时间戳处理`)
    date = new Date(timestamp) // 直接作为毫秒级时间戳处理
  } else {
    date = new Date(timestamp * 1000) // 秒级时间戳转换为毫秒
  }

  // 使用padStart确保每部分都是两位数
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}

/**
 * 获取图表所需的数据系列
 * @param data 处理后的数据点数组
 * @param dataType 数据类型，'bytes'表示字节数，'packets'表示数据包数
 * @returns 图表数据系列对象
 */
export function getChartSeries(data: ProcessedDataPoint[], dataType: 'bytes' | 'packets') {
  const timestamps = data.map((point) => point.time_label || formatTimeLabel(point.timestamp))

  if (dataType === 'bytes') {
    return {
      timestamps,
      rx: data.map((point) => point.rx_bytes),
      tx: data.map((point) => point.tx_bytes),
    }
  } else {
    return {
      timestamps,
      rx: data.map((point) => point.rx_packets),
      tx: data.map((point) => point.tx_packets),
    }
  }
}
