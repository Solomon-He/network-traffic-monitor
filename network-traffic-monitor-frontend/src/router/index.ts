import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: '仪表盘',
      },
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: () => import('../views/DetailedMonitor.vue'),
      meta: {
        title: '详细监控',
      },
    },
    // 重定向到仪表盘
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '网络流量监测工具'}`
  next()
})

export default router
