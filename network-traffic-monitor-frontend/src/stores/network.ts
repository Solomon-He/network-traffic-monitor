import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NetworkInterface, NetworkStats, NetworkSpeed } from '@/types/network'
import { networkService } from '@/services/networkService'
import { formatBytes, formatSpeed } from '@/utils/formatter'

export const useNetworkStore = defineStore(
  'network',
  () => {
    // 状态
    const interfaces = ref<NetworkInterface[]>([])
    const currentInterface = ref<string>('')
    const stats = ref<NetworkStats[]>([])
    const historicalStats = ref<NetworkStats[]>([])
    const speedData = ref<NetworkSpeed[]>([])
    const loading = ref({
      interfaces: false,
      stats: false,
      historicalStats: false,
      speedData: false,
    })
    const error = ref({
      interfaces: '',
      stats: '',
      historicalStats: '',
      speedData: '',
    })

    // 计算属性
    const currentInterfaceData = computed(() => {
      return interfaces.value.find((item) => item.name === currentInterface.value)
    })

    const currentStats = computed(() => {
      return stats.value.find((item) => item.interface === currentInterface.value)
    })

    // 获取当前接收和发送速率
    const currentSpeed = computed(() => {
      if (speedData.value.length === 0) return null

      // 获取最新的速率数据
      const latestSpeedData = [...speedData.value]
        .filter((item) => item.interface === currentInterface.value)
        .sort((a, b) => b.timestamp - a.timestamp)[0]

      return latestSpeedData
    })

    // 方法
    // 获取网络接口列表
    const fetchInterfaces = async () => {
      loading.value.interfaces = true
      error.value.interfaces = ''

      try {
        interfaces.value = await networkService.getInterfaces()

        // 如果没有选择当前接口，或者当前选择的接口不在列表中，则选择第一个接口
        if (
          !currentInterface.value ||
          !interfaces.value.find((item) => item.name === currentInterface.value)
        ) {
          const activeInterface = interfaces.value.find((item) => item.isUp)
          currentInterface.value = activeInterface
            ? activeInterface.name
            : interfaces.value[0]?.name || ''
        }
      } catch (err) {
        console.error('获取网络接口列表失败:', err)
        error.value.interfaces = '获取网络接口列表失败'
      } finally {
        loading.value.interfaces = false
      }
    }

    // 获取网络流量统计
    const fetchStats = async () => {
      loading.value.stats = true
      error.value.stats = ''

      try {
        stats.value = await networkService.getStats()
      } catch (err) {
        console.error('获取网络流量统计失败:', err)
        error.value.stats = '获取网络流量统计失败'
      } finally {
        loading.value.stats = false
      }
    }

    // 获取历史网络流量统计数据
    const fetchHistoricalStats = async (duration: number = 3600) => {
      if (!currentInterface.value) return

      loading.value.historicalStats = true
      error.value.historicalStats = ''

      try {
        historicalStats.value = await networkService.getStatsHistory({
          interface: currentInterface.value,
          duration,
        })
      } catch (err) {
        console.error('获取历史网络流量统计数据失败:', err)
        error.value.historicalStats = '获取历史网络流量统计数据失败'
      } finally {
        loading.value.historicalStats = false
      }
    }

    // 获取历史网络流量速率数据
    const fetchSpeedData = async (duration: number = 3600) => {
      if (!currentInterface.value) return

      loading.value.speedData = true
      error.value.speedData = ''

      try {
        speedData.value = await networkService.getSpeedHistory({
          interface: currentInterface.value,
          duration,
        })
      } catch (err) {
        console.error('获取历史网络流量速率数据失败:', err)
        error.value.speedData = '获取历史网络流量速率数据失败'
      } finally {
        loading.value.speedData = false
      }
    }

    // 设置当前选中的网络接口
    const setCurrentInterface = (interfaceName: string) => {
      currentInterface.value = interfaceName
      // 切换接口后，重新获取该接口的数据
      fetchHistoricalStats()
      fetchSpeedData()
    }

    // 初始化数据
    const initData = async () => {
      await fetchInterfaces()
      await fetchStats()
      if (currentInterface.value) {
        await Promise.all([fetchHistoricalStats(), fetchSpeedData()])
      }
    }

    return {
      // 状态
      interfaces,
      currentInterface,
      stats,
      historicalStats,
      speedData,
      loading,
      error,

      // 计算属性
      currentInterfaceData,
      currentStats,
      currentSpeed,

      // 方法
      formatBytes,
      formatSpeed,
      fetchInterfaces,
      fetchStats,
      fetchHistoricalStats,
      fetchSpeedData,
      setCurrentInterface,
      initData,
    }
  },
  {
    persist: true,
  },
)
