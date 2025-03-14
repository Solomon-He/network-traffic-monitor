<template>
  <div class="network-speed-chart">
    <div class="network-speed-chart__header">
      <div class="network-speed-chart__title">
        <h3>
          网络速度
          <span v-if="processedData.length > 0" class="network-speed-chart__count">
            ({{ processedData.length }}个数据点)
          </span>
        </h3>
      </div>
      <div class="network-speed-chart__controls">
        <el-radio-group v-model="activeTab" size="small">
          <el-radio-button label="bps">比特/秒</el-radio-button>
          <el-radio-button label="Bps">字节/秒</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="network-speed-chart__content">
      <!-- 加载状态 -->
      <div v-if="loading" class="network-speed-chart__loading">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 错误状态 -->
      <el-alert
        v-else-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="network-speed-chart__error"
      />

      <!-- 无数据状态 -->
      <el-empty
        v-else-if="!hasData"
        description="暂无网络速度数据"
        :image-size="100"
        class="network-speed-chart__empty"
      />

      <!-- 图表 -->
      <div v-else ref="chartRef" class="network-speed-chart__chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { NetworkSpeed } from '@/types/network'
import { formatTimeLabel } from '@/utils/dataProcessor'

// 注册必要的ECharts组件
echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  CanvasRenderer,
])

defineOptions({
  name: 'NetworkSpeedChart',
})

// 定义组件属性
const props = defineProps<{
  data: NetworkSpeed[]
  interval: number
  loading?: boolean
  error?: string
}>()

// 当前激活的标签页（比特/秒或字节/秒）
const activeTab = ref<'bps' | 'Bps'>('Bps')

// 图表DOM引用
const chartRef = ref<HTMLElement | null>(null)

// 图表实例
let chartInstance: echarts.ECharts | null = null

// 处理后的数据点类型
interface ProcessedSpeedDataPoint {
  timestamp: number
  rx_speed: number
  tx_speed: number
  time_label: string
}

// 计算属性：处理后的数据
const processedData = computed<ProcessedSpeedDataPoint[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return processNetworkSpeedData(props.data, props.interval)
})

// 计算属性：是否有数据
const hasData = computed(() => {
  return processedData.value.length > 0
})

// 计算属性：图表数据系列
const chartSeries = computed(() => {
  return {
    timestamps: processedData.value.map((point) => point.time_label),
    rx: processedData.value.map((point) =>
      activeTab.value === 'bps' ? point.rx_speed * 8 : point.rx_speed,
    ),
    tx: processedData.value.map((point) =>
      activeTab.value === 'bps' ? point.tx_speed * 8 : point.tx_speed,
    ),
  }
})

/**
 * 处理网络速度数据
 * @param originalData 原始网络速度数据
 * @param interval 数据条数间隔
 * @returns 处理后的数据点数组
 */
function processNetworkSpeedData(
  originalData: NetworkSpeed[],
  interval: number,
): ProcessedSpeedDataPoint[] {
  if (!originalData || originalData.length === 0) {
    console.warn('原始数据为空，无法处理')
    return []
  }

  console.log(`开始处理网络速度数据，原始数据条数: ${originalData.length}, 间隔: ${interval}条`)

  // 确保数据按时间戳排序
  const sortedData = [...originalData].sort((a, b) => a.timestamp - b.timestamp)

  // 存储处理后的数据点
  const processedData: ProcessedSpeedDataPoint[] = []

  // 按照指定的数据条数间隔分组处理
  for (let i = 0; i < sortedData.length; i += interval) {
    // 确保有足够的数据形成一个完整的间隔
    if (i + interval <= sortedData.length) {
      // 直接使用每组最后一条数据
      const lastPoint = sortedData[i + interval - 1]

      // 创建数据点
      processedData.push({
        timestamp: lastPoint.timestamp,
        rx_speed: lastPoint.rx_speed,
        tx_speed: lastPoint.tx_speed,
        time_label: formatTimeLabel(lastPoint.timestamp),
      })
    }
  }

  // 处理剩余不足一个完整间隔的数据
  const remainingCount = sortedData.length % interval
  if (remainingCount > 0) {
    const lastPoint = sortedData[sortedData.length - 1]

    processedData.push({
      timestamp: lastPoint.timestamp,
      rx_speed: lastPoint.rx_speed,
      tx_speed: lastPoint.tx_speed,
      time_label: formatTimeLabel(lastPoint.timestamp),
    })
  }

  console.log(`网络速度数据处理完成，生成了 ${processedData.length} 个数据点`)
  return processedData
}

/**
 * 格式化速率
 * @param value 速率值（字节/秒或比特/秒）
 * @returns 格式化后的速率字符串
 */
function formatSpeed(value: number, type: 'bps' | 'Bps' = 'Bps'): string {
  if (type === 'bps') {
    // 比特/秒
    if (value < 1000) return `${value.toFixed(2)} bps`
    if (value < 1000000) return `${(value / 1000).toFixed(2)} Kbps`
    if (value < 1000000000) return `${(value / 1000000).toFixed(2)} Mbps`
    return `${(value / 1000000000).toFixed(2)} Gbps`
  } else {
    // 字节/秒
    if (value < 1024) return `${value.toFixed(2)} B/s`
    if (value < 1048576) return `${(value / 1024).toFixed(2)} KB/s`
    if (value < 1073741824) return `${(value / 1048576).toFixed(2)} MB/s`
    return `${(value / 1073741824).toFixed(2)} GB/s`
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) {
    console.warn('图表DOM引用未获取，无法初始化图表')
    return
  }

  try {
    console.log('开始初始化网络速度图表')

    // 如果已存在图表实例，先销毁
    if (chartInstance) {
      console.log('销毁旧图表实例')
      chartInstance.dispose()
    }

    // 创建图表实例
    chartInstance = echarts.init(chartRef.value)
    console.log('图表实例创建成功')

    // 设置响应式
    window.addEventListener('resize', handleResize)

    // 更新图表
    updateChart()
  } catch (error) {
    console.error('初始化图表失败:', error)
  }
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) {
    console.warn('图表实例未创建，无法更新图表')
    return
  }

  if (!hasData.value) {
    console.warn('没有数据，无法更新图表')
    return
  }

  try {
    const series = chartSeries.value
    const yAxisName = activeTab.value === 'bps' ? '网络速度 (bps)' : '网络速度 (B/s)'

    // 设置图表选项
    const option = {
      title: {
        text: activeTab.value === 'bps' ? '网络速度 (比特/秒)' : '网络速度 (字节/秒)',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (
          params: Array<{
            axisValue: string
            value: number
            seriesName: string
            color: string
            dataIndex: number
          }>,
        ) {
          if (!params || params.length === 0) return ''

          const time = params[0].axisValue
          const dataIndex = params[0].dataIndex
          const originalTimestamp = processedData.value[dataIndex]?.timestamp || 0

          let html = `<div style="font-weight:bold">${time}</div>`
          html += `<div style="font-size:10px;color:#999">时间戳: ${originalTimestamp}</div>`

          params.forEach((param) => {
            if (param && typeof param.value === 'number') {
              const value = param.value
              const formattedValue = formatSpeed(value, activeTab.value)

              html += `<div style="display:flex;justify-content:space-between;align-items:center;margin:5px 0">
                <span style="margin-right:15px">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${param.color};margin-right:5px"></span>
                  ${param.seriesName}:
                </span>
                <span style="font-weight:bold">${formattedValue}</span>
              </div>`
            }
          })

          return html
        },
      },
      legend: {
        data: ['接收', '发送'],
        top: 30,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: { title: '保存为图片' },
          dataZoom: { title: '区域缩放' },
          restore: { title: '还原' },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
          bottom: '2%',
        },
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: series.timestamps,
        axisLabel: {
          rotate: 45,
          interval: function (index: number) {
            // 根据数据量动态调整显示间隔
            const totalPoints = series.timestamps.length
            // 如果数据点超过30个，则每隔几个显示一个标签
            if (totalPoints > 30) {
              return index % Math.ceil(totalPoints / 15) === 0
            }
            // 数据点较少时，全部显示
            return true
          },
        },
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        axisLabel: {
          formatter: function (value: number) {
            return formatSpeed(value, activeTab.value)
          },
        },
      },
      series: [
        {
          name: '接收',
          type: 'line',
          data: series.rx,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            opacity: 0.1,
          },
        },
        {
          name: '发送',
          type: 'line',
          data: series.tx,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            opacity: 0.1,
          },
        },
      ],
    }

    // 设置图表选项
    chartInstance.setOption(option)
    console.log('网络速度图表更新成功')
  } catch (error) {
    console.error('更新图表失败:', error)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 监听数据变化
watch(
  () => [props.data, props.interval],
  () => {
    console.log('数据或间隔变化，重新处理数据')
    if (chartInstance) {
      updateChart()
    }
  },
  { deep: true },
)

// 监听标签页变化
watch(activeTab, () => {
  console.log('标签页切换为:', activeTab.value)
  if (chartInstance) {
    updateChart()
  }
})

// 生命周期钩子
onMounted(() => {
  console.log('组件挂载，初始化图表')
  initChart()
})

onUnmounted(() => {
  console.log('组件卸载，清理资源')
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style lang="scss" scoped>
.network-speed-chart {
  width: 100%;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__title {
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }

  &__count {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    font-weight: normal;
    margin-left: 8px;
  }

  &__controls {
    display: flex;
    align-items: center;
  }

  &__content {
    position: relative;
  }

  &__chart {
    width: 100%;
    height: 400px;
  }

  &__loading,
  &__error,
  &__empty {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
