<template>
  <div class="interface-selector">
    <label class="interface-selector__label" for="interface-select">选择网络接口:</label>
    <div class="interface-selector__select-wrapper">
      <select
        id="interface-select"
        v-model="selectedInterface"
        class="interface-selector__select"
        :disabled="loading || interfaces.length === 0"
        @change="handleChange"
      >
        <option v-if="interfaces.length === 0" value="" disabled>无可用接口</option>
        <option v-for="iface in interfaces" :key="iface.name" :value="iface.name">
          {{ iface.name }} ({{ iface.ip }})
        </option>
      </select>
      <div class="interface-selector__select-arrow">▼</div>
    </div>
    <div v-if="loading" class="interface-selector__loading">加载中...</div>
    <div v-if="error" class="interface-selector__error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NetworkInterface } from '@/types/network'

defineOptions({
  name: 'InterfaceSelector',
})

// 定义组件属性
const props = defineProps<{
  interfaces: NetworkInterface[]
  currentInterface: string
  loading?: boolean
  error?: string
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'change', interfaceName: string): void
}>()

// 选中的接口
const selectedInterface = ref(props.currentInterface)

// 监听当前接口变化
watch(
  () => props.currentInterface,
  (newValue) => {
    selectedInterface.value = newValue
  },
)

// 处理选择变化
const handleChange = () => {
  emit('change', selectedInterface.value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.interface-selector {
  margin-bottom: vars.$spacing-md;

  &__label {
    display: block;
    margin-bottom: vars.$spacing-xs;
    color: var(--text-color-secondary);
    font-size: 0.9rem;
  }

  &__select-wrapper {
    position: relative;
  }

  &__select {
    width: 100%;
    padding: vars.$spacing-sm vars.$spacing-md;
    border: vars.$border-width solid var(--border-color);
    border-radius: vars.$border-radius-sm;
    background-color: var(--background-color-component);
    color: var(--text-color-primary);
    font-size: 1rem;
    appearance: none;
    cursor: pointer;
    transition: border-color vars.$transition-fast;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__select-arrow {
    position: absolute;
    right: vars.$spacing-md;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
    font-size: 0.8rem;
    pointer-events: none;
  }

  &__loading {
    margin-top: vars.$spacing-xs;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
  }

  &__error {
    margin-top: vars.$spacing-xs;
    font-size: 0.9rem;
    color: var(--error-color);
  }
}
</style>
