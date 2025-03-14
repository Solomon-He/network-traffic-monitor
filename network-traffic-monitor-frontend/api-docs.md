# 网络流量监测工具 API 文档

## 基本信息

- 基础URL: `http://localhost:3000`
- 所有请求和响应均使用 JSON 格式
- 所有时间戳使用毫秒级 UNIX 时间戳

## 目录

- [网络接口相关 API](#网络接口相关-api)
- [告警相关 API](#告警相关-api)

## 网络接口相关 API

### 获取网络接口列表

获取系统上所有可用的网络接口信息。

- **URL**: `/api/network/interfaces`
- **方法**: `GET`
- **参数**: 无

**响应示例**:

```json
[
  {
    "name": "WLAN",
    "ip": "10.15.25.106",
    "mac": "7c:21:4a:df:60:92",
    "isUp": true
  },
  {
    "name": "Loopback Pseudo-Interface 1",
    "ip": "127.0.0.1",
    "mac": "00:00:00:00:00:00",
    "isUp": false
  }
]
```

### 获取网络流量统计

获取当前网络流量统计数据。

- **URL**: `/api/network/stats`
- **方法**: `GET`
- **参数**: 无

**响应示例**:

```json
[
  {
    "interface": "WLAN",
    "timestamp": 1741752325104,
    "rx_bytes": 63568607,
    "tx_bytes": 9996913,
    "rx_packets": 0,
    "tx_packets": 0,
    "rx_errors": 0,
    "tx_errors": 0
  }
]
```

### 获取历史网络流量统计数据

获取指定网络接口的历史流量统计数据。

- **URL**: `/api/network/stats/history`
- **方法**: `GET`
- **参数**:
  - `interface` (必填): 网络接口名称
  - `duration` (可选): 查询时长（秒），默认为3600（1小时）

**响应示例**:

```json
[
  {
    "interface": "WLAN",
    "timestamp": 1741752325104,
    "rx_bytes": 63568607,
    "tx_bytes": 9996913,
    "rx_packets": 0,
    "tx_packets": 0,
    "rx_errors": 0,
    "tx_errors": 0
  },
  {
    "interface": "WLAN",
    "timestamp": 1741752326104,
    "rx_bytes": 63568807,
    "tx_bytes": 9997013,
    "rx_packets": 0,
    "tx_packets": 0,
    "rx_errors": 0,
    "tx_errors": 0
  }
]
```

### 获取历史网络流量速率数据

获取指定网络接口的历史流量速率数据。

- **URL**: `/api/network/speed/history`
- **方法**: `GET`
- **参数**:
  - `interface` (必填): 网络接口名称
  - `duration` (可选): 查询时长（秒），默认为3600（1小时）

**响应示例**:

```json
[
  {
    "interface": "WLAN",
    "timestamp": 1741752325104,
    "rx_speed": 1024,
    "tx_speed": 512
  },
  {
    "interface": "WLAN",
    "timestamp": 1741752326104,
    "rx_speed": 2048,
    "tx_speed": 1024
  }
]
```

## 告警相关 API

### 设置告警阈值

设置网络接口的流量告警阈值。

- **URL**: `/api/alert/thresholds`
- **方法**: `POST`
- **请求体**:

```json
{
  "interface": "WLAN",
  "rx_speed_threshold": 1000000,
  "tx_speed_threshold": 1000000,
  "enabled": true
}
```

**参数说明**:

- `interface`: 网络接口名称
- `rx_speed_threshold`: 接收速率阈值（字节/秒）
- `tx_speed_threshold`: 发送速率阈值（字节/秒）
- `enabled`: 是否启用告警

**响应示例**:

```json
{
  "success": true,
  "message": "设置告警阈值成功"
}
```

### 获取所有告警阈值

获取所有网络接口的告警阈值设置。

- **URL**: `/api/alert/thresholds`
- **方法**: `GET`
- **参数**: 无

**响应示例**:

```json
[
  {
    "interface": "WLAN",
    "rx_speed_threshold": 1000000,
    "tx_speed_threshold": 1000000,
    "enabled": true
  }
]
```

### 获取特定接口的告警阈值

获取指定网络接口的告警阈值设置。

- **URL**: `/api/alert/thresholds/:interface`
- **方法**: `GET`
- **参数**:
  - `interface` (路径参数): 网络接口名称

**响应示例**:

```json
{
  "interface": "WLAN",
  "rx_speed_threshold": 1000000,
  "tx_speed_threshold": 1000000,
  "enabled": true
}
```

### 删除告警阈值

删除指定网络接口的告警阈值设置。

- **URL**: `/api/alert/thresholds/:interface`
- **方法**: `DELETE`
- **参数**:
  - `interface` (路径参数): 网络接口名称

**响应示例**:

```json
{
  "success": true,
  "message": "删除告警阈值成功"
}
```

### 获取所有告警

获取所有告警信息。

- **URL**: `/api/alert/alerts`
- **方法**: `GET`
- **参数**:
  - `resolved` (可选): 是否包含已解决的告警，默认为 false

**响应示例**:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "interface": "WLAN",
    "timestamp": 1741752325104,
    "type": "rx_speed",
    "value": 1500000,
    "threshold": 1000000,
    "message": "WLAN 的接收速率 1464.84 KB/s 超过阈值 976.56 KB/s",
    "resolved": false
  }
]
```

## 数据结构

### NetworkInterface

```typescript
interface NetworkInterface {
  name: string // 网络接口名称
  ip: string // IP地址
  mac: string // MAC地址
  isUp: boolean // 是否启用
}
```

### NetworkStats

```typescript
interface NetworkStats {
  interface: string // 网络接口名称
  timestamp: number // 时间戳
  rx_bytes: number // 接收字节数
  tx_bytes: number // 发送字节数
  rx_packets: number // 接收数据包数
  tx_packets: number // 发送数据包数
  rx_errors: number // 接收错误数
  tx_errors: number // 发送错误数
}
```

### NetworkSpeed

```typescript
interface NetworkSpeed {
  interface: string // 网络接口名称
  timestamp: number // 时间戳
  rx_speed: number // 接收速率 (bytes/s)
  tx_speed: number // 发送速率 (bytes/s)
}
```

### AlertThreshold

```typescript
interface AlertThreshold {
  interface: string // 网络接口名称
  rx_speed_threshold: number // 接收速率阈值 (bytes/s)
  tx_speed_threshold: number // 发送速率阈值 (bytes/s)
  enabled: boolean // 是否启用告警
}
```

### Alert

```typescript
interface Alert {
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
```
