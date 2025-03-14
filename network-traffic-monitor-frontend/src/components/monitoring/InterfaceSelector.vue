<template>
  <div class="interface-selector">
    <div class="interface-selector__content">
      <div class="interface-selector__label">当前网络接口:</div>
      <div class="interface-selector__value">
        <template v-if="loading">
          <div class="interface-selector__skeleton"></div>
        </template>
        <template v-else-if="!currentInterfaceData">
          <span class="interface-selector__empty-text">无可用网络接口</span>
        </template>
        <template v-else>
          <span class="interface-selector__name">{{ currentInterfaceData.name }}</span>
          <el-tag
            size="small"
            :type="currentInterfaceData.isUp ? 'success' : 'danger'"
            class="interface-selector__status"
          >
            {{ currentInterfaceData.isUp ? '活动' : '非活动' }}
          </el-tag>
        </template>
      </div>
      <el-button
        size="small"
        :loading="refreshLoading"
        @click="refreshInterfaces"
        class="interface-selector__refresh"
      >
        刷新
      </el-button>
    </div>

    <div v-if="error" class="interface-selector__error">
      <el-alert type="error" :title="error" :closable="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useNetworkStore } from '@/stores/network'

const networkStore = useNetworkStore()

// 计算属性
const interfaces = computed(() => networkStore.interfaces)
const currentInterfaceData = computed(() => networkStore.currentInterfaceData)
const loading = computed(() => networkStore.loading.interfaces)
const error = computed(() => networkStore.error.interfaces)

// 添加单独的刷新按钮加载状态
const refreshLoading = ref(false)

// 方法
const refreshInterfaces = async () => {
  refreshLoading.value = true
  await networkStore.fetchInterfaces()
  refreshLoading.value = false
}

// 生命周期钩子
onMounted(async () => {
  if (interfaces.value.length === 0) {
    await refreshInterfaces()
  }
})
</script>

<style lang="scss" scoped>
.interface-selector {
  margin-bottom: 10px;

  &__content {
    display: flex;
    align-items: center;
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

  &__value {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  &__skeleton {
    width: 120px;
    height: 20px;
    background: linear-gradient(
      90deg,
      var(--el-skeleton-color) 25%,
      var(--el-skeleton-to-color) 50%,
      var(--el-skeleton-color) 75%
    );
    background-size: 400% 100%;
    border-radius: 4px;
    animation: skeleton-loading 1.4s ease infinite;
  }

  &__name {
    font-weight: 500;
    margin-right: 8px;
    color: var(--el-text-color-primary);
  }

  &__status {
    margin-right: 8px;
  }

  &__empty-text {
    color: var(--el-text-color-secondary);
    font-style: italic;
  }

  &__refresh {
    margin-left: auto;
  }

  &__error {
    margin-top: 8px;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
