<template>
  <div class="interface-info-card card">
    <h2 class="interface-info-card__title">网络接口信息</h2>

    <div v-if="loading" class="interface-info-card__loading">
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="interface-info-card__error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!interfaceData" class="interface-info-card__empty">
      <p>未选择网络接口</p>
    </div>

    <div v-else class="interface-info-card__content">
      <div class="interface-info-card__item">
        <span class="interface-info-card__label">名称：</span>
        <span class="interface-info-card__value">{{ interfaceData.name }}</span>
      </div>

      <div class="interface-info-card__item">
        <span class="interface-info-card__label">IP地址：</span>
        <span class="interface-info-card__value">{{ interfaceData.ip }}</span>
      </div>

      <div class="interface-info-card__item">
        <span class="interface-info-card__label">MAC地址：</span>
        <span class="interface-info-card__value">{{ interfaceData.mac }}</span>
      </div>

      <div class="interface-info-card__item">
        <span class="interface-info-card__label">状态：</span>
        <span class="interface-info-card__value">
          <span
            class="interface-info-card__status"
            :class="{ 'interface-info-card__status--active': interfaceData.isUp }"
          >
            {{ interfaceData.isUp ? '活动' : '非活动' }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NetworkInterface } from '@/types/network'

defineOptions({
  name: 'InterfaceInfoCard',
})

// 定义组件属性
const props = defineProps<{
  interfaceData: NetworkInterface | undefined
  loading?: boolean
  error?: string
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.interface-info-card {
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
    gap: vars.$spacing-sm;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: vars.$spacing-sm 0;
  }

  &__label {
    flex: 0 0 80px;
    color: var(--text-color-secondary);
  }

  &__value {
    flex: 1;
    color: var(--text-color-primary);
  }

  &__status {
    display: inline-block;
    padding: 2px 8px;
    border-radius: vars.$border-radius-sm;
    background-color: var(--border-color);
    color: var(--text-color-secondary);
    font-size: 0.9rem;

    &--active {
      background-color: var(--success-color);
      color: white;
    }
  }
}
</style>
