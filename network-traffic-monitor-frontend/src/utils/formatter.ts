/**
 * 格式化时间戳为日期时间字符串
 * @param timestamp 时间戳（毫秒）
 * @param format 格式化模式，默认为 'datetime'
 * @returns 格式化后的日期时间字符串
 */
export const formatTimestamp = (
  timestamp: number,
  format: 'datetime' | 'date' | 'time' | 'full' = 'datetime',
): string => {
  const date = new Date(timestamp)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`
    case 'time':
      return `${hours}:${minutes}:${seconds}`
    case 'full':
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    case 'datetime':
    default:
      return `${month}-${day} ${hours}:${minutes}`
  }
}

/**
 * 格式化字节数为可读格式
 * @param bytes 字节数
 * @param decimals 小数位数，默认为2
 * @returns 格式化后的字符串
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

/**
 * 格式化速率为可读格式
 * @param bytesPerSecond 每秒字节数
 * @param decimals 小数位数，默认为2
 * @returns 格式化后的字符串
 */
export const formatSpeed = (bytesPerSecond: number, decimals: number = 2): string => {
  return formatBytes(bytesPerSecond, decimals) + '/s'
}

/**
 * 格式化数字为千分位
 * @param num 数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化持续时间（秒）为可读格式
 * @param seconds 秒数
 * @returns 格式化后的字符串
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ''}`
  } else if (minutes > 0) {
    return `${minutes}分钟${remainingSeconds > 0 ? ` ${remainingSeconds}秒` : ''}`
  } else {
    return `${remainingSeconds}秒`
  }
}
