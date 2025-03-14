<template>
  <div class="traffic-stats-card card">
    <h2 class="traffic-stats-card__title">流量统计</h2>

    <div v-if="loading" class="traffic-stats-card__loading">
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="traffic-stats-card__error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!stats" class="traffic-stats-card__empty">
      <p>暂无流量统计数据</p>
    </div>

    <div v-else class="traffic-stats-card__content">
      <div class="traffic-stats-card__row">
        <div class="traffic-stats-card__col">
          <div class="traffic-stats-card__stat">
            <div class="traffic-stats-card__stat-label">接收字节数</div>
            <div class="traffic-stats-card__stat-value traffic-stats-card__stat-value--rx">
              {{ formatBytes(stats.rx_bytes) }}
            </div>
          </div>
        </div>

        <div class="traffic-stats-card__col">
          <div class="traffic-stats-card__stat">
            <div class="traffic-stats-card__stat-label">发送字节数</div>
            <div class="traffic-stats-card__stat-value traffic-stats-card__stat-value--tx">
              {{ formatBytes(stats.tx_bytes) }}
            </div>
          </div>
        </div>
      </div>

      <div class="traffic-stats-card__row">
        <div class="traffic-stats-card__col">
          <div class="traffic-stats-card__stat">
            <div class="traffic-stats-card__stat-label">接收数据包</div>
            <div class="traffic-stats-card__stat-value traffic-stats-card__stat-value--rx">
              {{ formatNumber(stats.rx_packets) }}
            </div>
          </div>
        </div>

        <div class="traffic-stats-card__col">
          <div class="traffic-stats-card__stat">
            <div class="traffic-stats-card__stat-label">发送数据包</div>
            <div class="traffic-stats-card__stat-value traffic-stats-card__stat-value--tx">
              {{ formatNumber(stats.tx_packets) }}
            </div>
          </div>
        </div>
      </div>

      <div class="traffic-stats-card__row">
        <div class="traffic-stats-card__col">
          <div class="traffic-stats-card__stat">
            <div class="traffic-stats-card__stat-label">接收错误</div>
            <div class="traffic-stats-card__stat-value traffic-stats-card__stat-value--error">
              {{ formatNumber(stats.rx_errors) }}
            </div>
          </div>
        </div>

        <div class="traffic-stats-card__col">
          <div class="traffic-stats-card__stat">
            <div class="traffic-stats-card__stat-label">发送错误</div>
            <div class="traffic-stats-card__stat-value traffic-stats-card__stat-value--error">
              {{ formatNumber(stats.tx_errors) }}
            </div>
          </div>
        </div>
      </div>

      <div class="traffic-stats-card__footer">
        <div class="traffic-stats-card__timestamp">
          更新时间: {{ formatTimestamp(stats.timestamp, 'full') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NetworkStats } from '@/types/network'
import { formatBytes, formatNumber, formatTimestamp } from '@/utils/formatter'

defineOptions({
  name: 'TrafficStatsCard',
})

// 定义组件属性
defineProps<{
  stats: NetworkStats | undefined
  loading?: boolean
  error?: string
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.traffic-stats-card {
  &__title {
    font-size: 1.2rem;
    margin-bottom: vars.$spacing-md;
    color: var(--text-color-primary);
  }

  &__loading,
  &__error,
  &__empty {
    padding: vars.$spacing-md 0;
    text-align: center;
    color: var(--text-color-secondary);
  }

  &__error {
    color: var(--error-color);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-md;
  }

  &__row {
    display: flex;
    gap: vars.$spacing-md;
  }

  &__col {
    flex: 1;
  }

  &__stat {
    background-color: var(--background-color-light);
    border-radius: vars.$border-radius-sm;
    padding: vars.$spacing-md;
    height: 100%;
  }

  &__stat-label {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
    margin-bottom: vars.$spacing-xs;
  }

  &__stat-value {
    font-size: 1.2rem;
    font-weight: vars.$font-weight-bold;

    &--rx {
      color: var(--rx-color);
    }

    &--tx {
      color: var(--tx-color);
    }

    &--error {
      color: var(--error-rate-color);
    }
  }

  &__footer {
    margin-top: vars.$spacing-sm;
    text-align: right;
  }

  &__timestamp {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
  }
}

@media (max-width: vars.$breakpoint-sm) {
  .traffic-stats-card {
    &__row {
      flex-direction: column;
    }
  }
}
</style>
