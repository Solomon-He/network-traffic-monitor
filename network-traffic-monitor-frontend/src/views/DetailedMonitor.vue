<template>
  <div class="detailed-monitor">
    <div class="detailed-monitor__header">
      <div class="detailed-monitor__title-row">
        <h2 class="detailed-monitor__title">网络流量详细监测</h2>
        <div class="detailed-monitor__status">
          <StatusTag
            text="监测中"
            icon="●"
            type="success"
            :pulsing="true"
            v-if="networkStore.currentInterface && !loading"
          />
          <StatusTag text="加载中" icon="●" type="info" :pulsing="true" v-else-if="loading" />
          <StatusTag text="未选择接口" type="warning" v-else />
        </div>
      </div>
      <div class="detailed-monitor__controls">
        <InterfaceSelector />
        <DataIntervalSelector
          :model-value="dataSettings"
          @update:model-value="handleDataSettingsUpdate"
          @refresh="refreshData"
        />
      </div>
    </div>

    <div class="detailed-monitor__content">
      <el-card v-if="loading" class="detailed-monitor__loading">
        <el-skeleton :rows="10" animated />
      </el-card>

      <template v-else-if="!networkStore.currentInterface">
        <el-empty description="请先选择一个网络接口" :image-size="200">
          <template #description>
            <p>请先选择一个网络接口以查看详细监测数据</p>
          </template>
        </el-empty>
      </template>

      <template v-else>
        <!-- 流量统计图表 -->
        <div class="detailed-monitor__section">
          <!-- 添加调试信息 -->
          <div class="detailed-monitor__debug" v-if="showDebugInfo">
            <p></p>
            <p>原始数据条数: {{ networkStore.historicalStats.length }}</p>
            <p>数据条数间隔: {{ dataSettings.interval }}条</p>
            <p>
              历史数据时长: {{ dataSettings.duration }}秒 ({{
                formatDuration(dataSettings.duration)
              }})
            </p>
            <p>
              理论数据点数量:
              {{ Math.ceil(networkStore.historicalStats.length / dataSettings.interval) }}
            </p>
            <p>
              数据时间范围:
              {{
                networkStore.historicalStats.length > 0
                  ? `${new Date(networkStore.historicalStats[0].timestamp * 1000).toLocaleString()} 至
                  ${new Date(networkStore.historicalStats[networkStore.historicalStats.length - 1].timestamp * 1000).toLocaleString()}`
                  : '无数据'
              }}
            </p>
            <p>
              数据示例:
              {{
                networkStore.historicalStats.length > 0
                  ? JSON.stringify(networkStore.historicalStats[0])
                  : '无数据'
              }}
            </p>
            <p>最近请求参数: {{ lastRequestParams }}</p>
            <p>加载状态: {{ loading ? '加载中' : '已加载' }}</p>
            <p>网络错误: {{ networkStore.error.historicalStats || '无' }}</p>
            <el-button size="small" @click="refreshData">手动刷新数据</el-button>
            <el-button size="small" @click="forceUpdateChart" type="primary"
              >强制重新绘制图表</el-button
            >
            <el-button size="small" @click="showDebugInfo = false">隐藏调试信息</el-button>
          </div>
          <TrafficStatsChart
            :data="networkStore.historicalStats"
            :interval="dataSettings.interval"
            :loading="loading"
            :error="networkStore.error.historicalStats"
          />
        </div>

        <!-- 网络速度图表（待实现） -->
        <div class="detailed-monitor__section">
          <NetworkSpeedChart
            :data="networkStore.speedData"
            :interval="dataSettings.interval"
            :loading="loading"
            :error="networkStore.error.speedData"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import InterfaceSelector from '@/components/monitoring/InterfaceSelector.vue'
import DataIntervalSelector from '@/components/monitoring/DataIntervalSelector.vue'
import TrafficStatsChart from '@/components/monitoring/TrafficStatsChart.vue'
import NetworkSpeedChart from '@/components/monitoring/NetworkSpeedChart.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { useNetworkStore } from '@/stores/network'
import { formatDuration } from '@/utils/formatter'

const networkStore = useNetworkStore()

// 数据设置
const dataSettings = reactive({
  interval: 20, // 默认20条数据为一个间隔
  duration: 900, // 默认15分钟
  autoRefresh: true,
  refreshInterval: 60000, // 默认1分钟
})

// 加载状态
const loading = ref(true)

// 调试信息显示控制
const showDebugInfo = ref(false)
const lastRequestParams = ref({})

// 处理数据设置更新
const handleDataSettingsUpdate = (newSettings: {
  interval: number
  duration: number
  autoRefresh: boolean
  refreshInterval: number
}) => {
  console.log('接收到数据设置更新:', newSettings)
  // 使用Object.assign而不是直接赋值，以确保reactive对象的响应性
  Object.assign(dataSettings, newSettings)
  console.log('更新后的数据设置:', dataSettings)
}

// 监听数据设置变化
watch(
  () => [dataSettings.interval, dataSettings.duration],
  (newValues, oldValues) => {
    console.log('监听到数据设置变化:', '旧值:', oldValues, '新值:', newValues)
    refreshData()
  },
  { deep: true },
)

// 刷新数据
const refreshData = async () => {
  // 如果没有选择网络接口，则不加载数据
  if (!networkStore.currentInterface) {
    console.warn('未选择网络接口，无法加载数据')
    loading.value = false
    return
  }

  loading.value = true

  // 记录请求参数
  lastRequestParams.value = {
    interface: networkStore.currentInterface,
    duration: dataSettings.duration,
    dataInterval: dataSettings.interval,
    timestamp: new Date().toLocaleString(),
  }

  try {
    console.log('开始获取数据，数据设置:', dataSettings)
    // 并行获取历史流量统计和速度数据
    await Promise.all([
      // 获取历史流量统计数据，用于流量统计图表
      networkStore.fetchHistoricalStats(dataSettings.duration),
      // 获取历史速度数据，用于网络速度图表（待实现）
      networkStore.fetchSpeedData(dataSettings.duration),
    ])
    console.log('获取数据完成，历史数据条数:', networkStore.historicalStats.length)

    // 确保有足够的时间渲染图表
    setTimeout(() => {
      loading.value = false
    }, 300)
  } catch (error) {
    console.error('刷新数据失败:', error)
    loading.value = false
  }
}

// 强制重新绘制图表
const forceUpdateChart = () => {
  // 触发图表组件重新渲染
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

// 生命周期钩子
onMounted(async () => {
  loading.value = true

  try {
    console.log('组件挂载，初始化数据')
    // 初始化网络接口数据
    if (networkStore.interfaces.length === 0) {
      await networkStore.fetchInterfaces()
    }

    // 确保有选中的网络接口
    if (!networkStore.currentInterface && networkStore.interfaces.length > 0) {
      const activeInterface = networkStore.interfaces.find((item) => item.isUp)
      const interfaceName = activeInterface
        ? activeInterface.name
        : networkStore.interfaces[0]?.name || ''

      if (interfaceName) {
        networkStore.setCurrentInterface(interfaceName)
      }
    }

    // 刷新数据
    await refreshData()
  } catch (error) {
    console.error('初始化数据失败:', error)
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.detailed-monitor {
  padding: 20px;

  &__header {
    margin-bottom: 20px;
  }

  &__title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
  }

  &__status {
    display: flex;
    align-items: center;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__content {
    margin-top: 20px;
  }

  &__loading {
    padding: 20px;
    margin-bottom: 20px;
  }

  &__section {
    margin-bottom: 30px;

    h2 {
      margin-bottom: 15px;
      font-size: 18px;
    }
  }

  &__placeholder {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
    }

    &-text {
      color: var(--el-text-color-secondary);
      font-style: italic;
      text-align: center;
      padding: 40px 0;
    }
  }

  &__debug {
    margin-bottom: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;

    p {
      margin: 4px 0;
    }
  }
}
</style>
