<template>
  <div class="data-interval-selector">
    <div class="data-interval-selector__row">
      <div class="data-interval-selector__item">
        <span class="data-interval-selector__label">数据条数间隔:</span>
        <el-select
          v-model="selectedInterval"
          size="small"
          class="data-interval-selector__select"
          placeholder="请选择数据条数间隔"
          @change="handleIntervalChange"
        >
          <el-option
            v-for="item in intervalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="data-interval-selector__item">
        <span class="data-interval-selector__label">历史数据时长:</span>
        <el-select
          v-model="selectedDuration"
          size="small"
          class="data-interval-selector__select"
          placeholder="请选择历史数据时长"
          @change="handleDurationChange"
        >
          <el-option
            v-for="item in durationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <div class="data-interval-selector__row">
      <div class="data-interval-selector__item data-interval-selector__auto-refresh">
        <span class="data-interval-selector__label">自动刷新:</span>
        <el-switch v-model="autoRefresh" @change="handleAutoRefreshChange" />
        <span class="data-interval-selector__status">
          {{ autoRefresh ? '已开启' : '已关闭' }}
        </span>
      </div>

      <div v-if="autoRefresh" class="data-interval-selector__item">
        <span class="data-interval-selector__label">刷新间隔:</span>
        <el-select
          v-model="refreshInterval"
          size="small"
          class="data-interval-selector__select"
          @change="handleRefreshIntervalChange"
        >
          <el-option
            v-for="item in refreshIntervalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

defineOptions({
  name: 'DataIntervalSelector',
})

// 定义组件的属性
const props = defineProps<{
  modelValue?: {
    interval: number
    duration: number
    autoRefresh: boolean
    refreshInterval: number
  }
}>()

// 定义组件的事件
const emit = defineEmits<{
  (
    e: 'update:modelValue',
    value: {
      interval: number
      duration: number
      autoRefresh: boolean
      refreshInterval: number
    },
  ): void
  (e: 'refresh'): void
}>()

// 数据条数间隔选项
const intervalOptions = [
  { value: 5, label: '5条数据' },
  { value: 10, label: '10条数据' },
  { value: 20, label: '20条数据' },
  { value: 50, label: '50条数据' },
  { value: 100, label: '100条数据' },
]

// 历史数据时长选项（秒）
const durationOptions = [
  { value: 300, label: '5分钟' },
  { value: 600, label: '10分钟' },
  { value: 900, label: '15分钟' },
  { value: 1800, label: '30分钟' },
  { value: 3600, label: '1小时' },
]

// 刷新间隔选项（毫秒）
const refreshIntervalOptions = [
  { value: 5000, label: '5秒' },
  { value: 10000, label: '10秒' },
  { value: 30000, label: '30秒' },
  { value: 60000, label: '1分钟' },
]

// 响应式数据
const selectedInterval = ref(props.modelValue?.interval || 10)
const selectedDuration = ref(props.modelValue?.duration || 900)
const autoRefresh = ref(
  props.modelValue?.autoRefresh !== undefined ? props.modelValue.autoRefresh : true,
)
const refreshInterval = ref(props.modelValue?.refreshInterval || 30000)

// 刷新定时器
let refreshTimer: number | null = null

// 方法
const handleIntervalChange = () => {
  console.log('数据条数间隔变更前:', selectedInterval.value, '条')
  updateModelValue()
  console.log('数据条数间隔变更后，发出事件:', selectedInterval.value, '条')
  // 间隔变更时立即刷新数据
  emit('refresh')
}

const handleDurationChange = () => {
  console.log('历史数据时长变更前:', selectedDuration.value, '秒')
  updateModelValue()
  console.log('历史数据时长变更后，发出事件:', selectedDuration.value, '秒')
  // 历史数据时长变更时立即刷新数据
  emit('refresh')
}

const handleAutoRefreshChange = (value: boolean) => {
  if (value) {
    startRefreshTimer()
  } else {
    stopRefreshTimer()
  }
  updateModelValue()
}

const handleRefreshIntervalChange = () => {
  stopRefreshTimer()
  startRefreshTimer()
  updateModelValue()
}

const updateModelValue = () => {
  const newValue = {
    interval: selectedInterval.value,
    duration: selectedDuration.value,
    autoRefresh: autoRefresh.value,
    refreshInterval: refreshInterval.value,
  }
  console.log('更新父组件的设置:', newValue)
  emit('update:modelValue', newValue)
}

const startRefreshTimer = () => {
  if (autoRefresh.value) {
    stopRefreshTimer()
    refreshTimer = window.setInterval(() => {
      emit('refresh')
    }, refreshInterval.value)
  }
}

const stopRefreshTimer = () => {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 监听属性变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedInterval.value = newValue.interval
      selectedDuration.value = newValue.duration
      autoRefresh.value = newValue.autoRefresh
      refreshInterval.value = newValue.refreshInterval

      if (autoRefresh.value) {
        startRefreshTimer()
      } else {
        stopRefreshTimer()
      }
    }
  },
  { deep: true },
)

// 生命周期钩子
onMounted(() => {
  updateModelValue()
  if (autoRefresh.value) {
    startRefreshTimer()
  }
})

onUnmounted(() => {
  stopRefreshTimer()
})
</script>

<style lang="scss" scoped>
.data-interval-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    @media (max-width: 767px) {
      flex-direction: column;
      gap: 10px;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    background-color: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 8px 12px;
    box-shadow: var(--el-box-shadow-lighter);
  }

  &__label {
    font-weight: bold;
    margin-right: 8px;
    white-space: nowrap;
    color: var(--el-text-color-primary);
  }

  &__select {
    flex: 1;
    min-width: 0;
  }

  &__auto-refresh {
    .data-interval-selector__label {
      margin-right: 8px;
    }
  }

  &__status {
    margin-left: 8px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}
</style>
