<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from './components/common/AppLayout.vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
})
</script>

<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<style scoped></style>
