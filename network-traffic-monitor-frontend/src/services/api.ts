import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 在发送请求之前做些什么
    // 例如：添加token、显示加载状态等

    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // 对响应数据做点什么
    return response
  },
  (error: AxiosError): Promise<AxiosError> => {
    // 对响应错误做点什么
    if (error.response) {
      // 服务器返回了错误状态码
      const status = error.response.status

      switch (status) {
        case 400:
          console.error('请求参数错误')
          break
        case 401:
          console.error('未授权，请重新登录')
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error(`未知错误，状态码: ${status}`)
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，无法连接到服务器')
    } else {
      // 请求配置有误
      console.error('请求配置错误:', error.message)
    }

    return Promise.reject(error)
  },
)

export default api
