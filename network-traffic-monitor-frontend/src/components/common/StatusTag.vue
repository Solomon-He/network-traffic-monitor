<template>
  <span class="status-tag" :class="[`status-tag--${type}`, { 'status-tag--pulsing': pulsing }]">
    <span v-if="icon" class="status-tag__icon">{{ icon }}</span>
    <span class="status-tag__text">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
defineOptions({
  name: 'StatusTag',
})

// 定义组件属性
defineProps<{
  text: string
  type?: 'success' | 'warning' | 'error' | 'info' | 'default'
  icon?: string
  pulsing?: boolean
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: vars.$border-radius-sm;
  font-size: 0.8rem;
  font-weight: vars.$font-weight-normal;
  line-height: 1.5;

  &--default {
    background-color: var(--border-color);
    color: var(--text-color-secondary);
  }

  &--success {
    background-color: var(--success-color);
    color: white;
  }

  &--warning {
    background-color: var(--warning-color);
    color: white;
  }

  &--error {
    background-color: var(--error-color);
    color: white;
  }

  &--info {
    background-color: var(--info-color);
    color: white;
  }

  &--pulsing {
    animation: pulse 2s infinite;
  }

  &__icon {
    margin-right: 4px;
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
