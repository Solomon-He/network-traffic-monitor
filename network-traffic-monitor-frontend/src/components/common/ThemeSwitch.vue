<template>
  <div class="theme-switch">
    <button
      class="theme-switch__button"
      @click="toggleTheme"
      :title="themeMode === 'light' ? '切换到暗色模式' : '切换到亮色模式'"
      :aria-label="themeMode === 'light' ? '切换到暗色模式' : '切换到亮色模式'"
    >
      <span v-if="themeMode === 'light'" class="theme-switch__icon">🌙</span>
      <span v-else class="theme-switch__icon">☀️</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { themeMode } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>

<style lang="scss" scoped>
.theme-switch {
  display: inline-block;

  &__button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--background-color-light);
    }
  }

  &__icon {
    font-size: 1.2rem;
  }
}
</style>
