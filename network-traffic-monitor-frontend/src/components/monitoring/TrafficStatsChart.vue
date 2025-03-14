<template>
  <div class="traffic-stats-chart">
    <div class="traffic-stats-chart__header">
      <div class="traffic-stats-chart__title">
        <h3>
          流量统计
          <span v-if="processedData.length > 0" class="traffic-stats-chart__count">
            ({{ processedData.length }}个数据点)
          </span>
        </h3>
      </div>
      <div class="traffic-stats-chart__controls">
        <el-radio-group v-model="activeTab" size="small">
          <el-radio-button label="bytes">字节数</el-radio-button>
          <el-radio-button label="packets">数据包数</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="traffic-stats-chart__content">
      <!-- 加载状态 -->
      <div v-if="loading" class="traffic-stats-chart__loading">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 错误状态 -->
      <el-alert
        v-else-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="traffic-stats-chart__error"
      />

      <!-- 无数据状态 -->
      <el-empty
        v-else-if="!hasData"
        description="暂无流量统计数据"
        :image-size="100"
        class="traffic-stats-chart__empty"
      />

      <!-- 图表 -->
      <div v-else ref="chartRef" class="traffic-stats-chart__chart"></div>
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
import type { NetworkStats } from '@/types/network'
import { formatBytes } from '@/utils/formatter'
import { processNetworkData, addTimeLabels, getChartSeries } from '@/utils/dataProcessor'

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
  name: 'TrafficStatsChart',
})

// 定义组件属性
const props = defineProps<{
  data: NetworkStats[]
  interval: number
  loading?: boolean
  error?: string
}>()

// 当前激活的标签页（字节数/数据包数）
const activeTab = ref<'bytes' | 'packets'>('bytes')

// 图表DOM引用
const chartRef = ref<HTMLElement | null>(null)

// 图表实例
let chartInstance: echarts.ECharts | null = null

// 计算属性：处理后的数据
const processedData = computed(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  // 使用数据处理模块处理原始数据
  const processed = processNetworkData(props.data, props.interval)
  return addTimeLabels(processed)
})

// 计算属性：是否有数据
const hasData = computed(() => {
  return processedData.value.length > 0
})

// 计算属性：图表数据系列
const chartSeries = computed(() => {
  return getChartSeries(processedData.value, activeTab.value)
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) {
    console.warn('图表DOM引用未获取，无法初始化图表')
    return
  }

  try {
    console.log('开始初始化图表')

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
    const yAxisName = activeTab.value === 'bytes' ? '流量 (字节)' : '数据包数'

    // 设置图表选项
    const option = {
      color: ['#9A60B4', '#EE6666'],
      title: {
        text: activeTab.value === 'bytes' ? '网络流量统计 (字节)' : '网络流量统计 (数据包)',
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
              const formattedValue =
                activeTab.value === 'bytes' ? formatBytes(value) : `${value} 个数据包`

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
          formatter: function (value: string) {
            // 保留完整的"时:分:秒"格式
            return value
          },
        },
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        axisLabel: {
          formatter: function (value: number) {
            return activeTab.value === 'bytes' ? formatBytes(value) : value
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
    console.log('图表更新成功')
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
.traffic-stats-chart {
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
