<template>
  <div class="speed-card card">
    <h2 class="speed-card__title">实时速率</h2>

    <div v-if="loading" class="speed-card__loading">
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="speed-card__error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!speed" class="speed-card__empty">
      <p>暂无速率数据</p>
    </div>

    <div v-else class="speed-card__content">
      <div class="speed-card__speed-item">
        <div class="speed-card__speed-icon speed-card__speed-icon--rx">
          <span class="speed-card__speed-arrow">↓</span>
        </div>
        <div class="speed-card__speed-info">
          <div class="speed-card__speed-label">下载速率</div>
          <div class="speed-card__speed-value speed-card__speed-value--rx">
            {{ formatSpeed(speed.rx_speed) }}
          </div>
        </div>
      </div>

      <div class="speed-card__speed-item">
        <div class="speed-card__speed-icon speed-card__speed-icon--tx">
          <span class="speed-card__speed-arrow">↑</span>
        </div>
        <div class="speed-card__speed-info">
          <div class="speed-card__speed-label">上传速率</div>
          <div class="speed-card__speed-value speed-card__speed-value--tx">
            {{ formatSpeed(speed.tx_speed) }}
          </div>
        </div>
      </div>

      <div class="speed-card__footer">
        <div class="speed-card__timestamp">
          更新时间: {{ formatTimestamp(speed.timestamp, 'time') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NetworkSpeed } from '@/types/network'
import { formatSpeed, formatTimestamp } from '@/utils/formatter'

defineOptions({
  name: 'SpeedCard',
})

// 定义组件属性
defineProps<{
  speed: NetworkSpeed | null | undefined
  loading?: boolean
  error?: string
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.speed-card {
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

  &__speed-item {
    display: flex;
    align-items: center;
    gap: vars.$spacing-md;
    padding: vars.$spacing-sm;
    background-color: var(--background-color-light);
    border-radius: vars.$border-radius-sm;
  }

  &__speed-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;

    &--rx {
      background-color: rgba(var(--rx-color-rgb, 24, 144, 255), 0.1);
      color: var(--rx-color);
    }

    &--tx {
      background-color: rgba(var(--tx-color-rgb, 82, 196, 26), 0.1);
      color: var(--tx-color);
    }
  }

  &__speed-arrow {
    font-size: 1.2rem;
    font-weight: vars.$font-weight-bold;
  }

  &__speed-info {
    flex: 1;
  }

  &__speed-label {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
  }

  &__speed-value {
    font-size: 1.5rem;
    font-weight: vars.$font-weight-bold;

    &--rx {
      color: var(--rx-color);
    }

    &--tx {
      color: var(--tx-color);
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
</style>
