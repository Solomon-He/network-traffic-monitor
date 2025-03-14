import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore(
  'theme',
  () => {
    // 主题模式：light 或 dark
    const themeMode = ref<'light' | 'dark'>('light')

    // 自定义主题色
    const primaryColor = ref('#1890ff')

    // 初始化主题
    const initTheme = () => {
      // 从本地存储获取主题设置
      const savedTheme = localStorage.getItem('theme-mode')
      const savedColor = localStorage.getItem('theme-primary-color')

      // 如果有保存的主题设置，则使用它
      if (savedTheme === 'light' || savedTheme === 'dark') {
        themeMode.value = savedTheme
      } else {
        // 否则，检查系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        themeMode.value = prefersDark ? 'dark' : 'light'
      }

      // 如果有保存的主题色，则使用它
      if (savedColor) {
        primaryColor.value = savedColor
      }

      // 应用主题
      applyTheme()
    }

    // 切换主题
    const toggleTheme = () => {
      themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
    }

    // 设置主题色
    const setPrimaryColor = (color: string) => {
      primaryColor.value = color
      applyPrimaryColor()
    }

    // 应用主题
    const applyTheme = () => {
      // 应用暗色/亮色主题
      if (themeMode.value === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      // 应用主题色
      applyPrimaryColor()

      // 保存设置到本地存储
      localStorage.setItem('theme-mode', themeMode.value)
    }

    // 应用主题色
    const applyPrimaryColor = () => {
      // 设置主题色CSS变量
      document.documentElement.style.setProperty('--primary-color', primaryColor.value)

      // 计算主题色的亮色和暗色变体
      const lightenColor = lightenDarkenColor(primaryColor.value, 20)
      const darkenColor = lightenDarkenColor(primaryColor.value, -20)

      document.documentElement.style.setProperty('--primary-color-light', lightenColor)
      document.documentElement.style.setProperty('--primary-color-dark', darkenColor)

      // 保存设置到本地存储
      localStorage.setItem('theme-primary-color', primaryColor.value)
    }

    // 辅助函数：调整颜色亮度
    const lightenDarkenColor = (color: string, amount: number): string => {
      let usePound = false

      if (color[0] === '#') {
        color = color.slice(1)
        usePound = true
      }

      const num = parseInt(color, 16)

      let r = (num >> 16) + amount
      r = Math.max(Math.min(r, 255), 0)

      let g = ((num >> 8) & 0x00ff) + amount
      g = Math.max(Math.min(g, 255), 0)

      let b = (num & 0x0000ff) + amount
      b = Math.max(Math.min(b, 255), 0)

      return (usePound ? '#' : '') + (b | (g << 8) | (r << 16)).toString(16).padStart(6, '0')
    }

    // 监听主题变化
    watch(themeMode, () => {
      applyTheme()
    })

    return {
      themeMode,
      primaryColor,
      initTheme,
      toggleTheme,
      setPrimaryColor,
    }
  },
  {
    persist: true,
  },
)
