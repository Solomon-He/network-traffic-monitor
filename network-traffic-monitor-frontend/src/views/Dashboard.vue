<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <h1 class="dashboard__title">网络流量监测仪表盘</h1>
      <StatusTag text="监测中" type="success" icon="●" :pulsing="true" />
    </div>

    <InterfaceSelector
      :interfaces="networkStore.interfaces"
      :current-interface="networkStore.currentInterface"
      :loading="networkStore.loading.interfaces"
      :error="networkStore.error.interfaces"
      @change="handleInterfaceChange"
    />

    <div class="dashboard__grid">
      <div class="dashboard__grid-item dashboard__grid-item--info">
        <InterfaceInfoCard
          :interface-data="networkStore.currentInterfaceData"
          :loading="networkStore.loading.interfaces"
          :error="networkStore.error.interfaces"
        />
      </div>

      <div class="dashboard__grid-item dashboard__grid-item--speed">
        <SpeedCard
          :speed="networkStore.currentSpeed"
          :loading="networkStore.loading.speedData"
          :error="networkStore.error.speedData"
        />
      </div>

      <div class="dashboard__grid-item dashboard__grid-item--stats">
        <TrafficStatsCard
          :stats="networkStore.currentStats"
          :loading="networkStore.loading.stats"
          :error="networkStore.error.stats"
        />
      </div>
    </div>

    <div class="dashboard__actions">
      <button class="dashboard__refresh-btn" @click="refreshData" :disabled="isRefreshing">
        {{ isRefreshing ? '刷新中...' : '刷新数据' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNetworkStore } from '@/stores/network'
import InterfaceSelector from '@/components/dashboard/InterfaceSelector.vue'
import InterfaceInfoCard from '@/components/dashboard/InterfaceInfoCard.vue'
import SpeedCard from '@/components/dashboard/SpeedCard.vue'
import TrafficStatsCard from '@/components/dashboard/TrafficStatsCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'

defineOptions({
  name: 'DashboardView',
})

// 网络状态管理
const networkStore = useNetworkStore()

// 刷新状态
const isRefreshing = ref(false)

// 自动刷新定时器
let refreshTimer: number | null = null

// 处理接口变更
const handleInterfaceChange = (interfaceName: string) => {
  networkStore.setCurrentInterface(interfaceName)
}

// 刷新数据
const refreshData = async () => {
  if (isRefreshing.value) return

  isRefreshing.value = true

  try {
    await Promise.all([networkStore.fetchStats(), networkStore.fetchSpeedData()])
  } finally {
    isRefreshing.value = false
  }
}

// 组件挂载时
onMounted(async () => {
  // 初始化数据
  await networkStore.initData()

  // 设置自动刷新定时器（每5秒刷新一次）
  refreshTimer = window.setInterval(() => {
    refreshData()
  }, 30000)
})

// 组件卸载时
onUnmounted(() => {
  // 清除自动刷新定时器
  if (refreshTimer !== null) {
    clearInterval(refreshTimer)
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.dashboard {
  padding: vars.$spacing-md;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: vars.$spacing-lg;
  }

  &__title {
    font-size: 1.5rem;
    color: var(--text-color-primary);
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: vars.$spacing-md;
    margin-bottom: vars.$spacing-lg;
  }

  &__grid-item {
    &--info {
      grid-column: 1;
    }

    &--speed {
      grid-column: 2;
    }

    &--stats {
      grid-column: 3;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__refresh-btn {
    padding: vars.$spacing-sm vars.$spacing-md;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: vars.$border-radius-sm;
    cursor: pointer;
    transition: background-color vars.$transition-fast;

    &:hover {
      background-color: var(--primary-color-light);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

@media (max-width: vars.$breakpoint-lg) {
  .dashboard {
    &__grid {
      grid-template-columns: repeat(2, 1fr);
    }

    &__grid-item {
      &--info {
        grid-column: 1;
      }

      &--speed {
        grid-column: 2;
      }

      &--stats {
        grid-column: 1 / span 2;
      }
    }
  }
}

@media (max-width: vars.$breakpoint-md) {
  .dashboard {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__grid-item {
      &--info,
      &--speed,
      &--stats {
        grid-column: 1;
      }
    }
  }
}
</style>
