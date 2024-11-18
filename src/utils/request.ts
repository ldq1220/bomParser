import axios from 'axios'
import { ElMessage } from 'element-plus'
import useBomParserStore from '@/store/bomParser'

const bomParserStore = useBomParserStore()

let proxy = ''
const env = import.meta.env.VITE_ENV

if (env === 'development') {
  proxy = JSON.parse(JSON.stringify(localStorage.getItem('proxy')))
} else {
  proxy = import.meta.env.VITE_SERVE
}

// 创建axios实例
const request = axios.create({
  baseURL: proxy || '/api',
  timeout: 15000
})

// axios请求拦截器
request.interceptors.request.use(
  async (config) => {
    // 配置请求头
    const authorization = ''
    console.log('x-api-key', bomParserStore.xApiKey)
    config.headers['x-api-key'] = bomParserStore.xApiKey
    // 验证token
    if (authorization) {
      config.headers.authorization = 'Bearer ' + authorization
    }

    return config
  },
  (e) => Promise.reject(e)
)

// axios响应式拦截器
request.interceptors.response.use(
  (res) => res.data,
  (e) => {
    ElMessage.closeAll() // 关闭所有提示

    if (e.code == 'ECONNABORTED') {
      ElMessage.error('当前网络不佳，请重试！')
      return Promise.reject(e)
    }

    const message = e.response.data.message || e.message
    const code = e.response.data.code
    const { status } = e.response
    if (status === 401 || code === 'A0005') {
      ElMessage.error('登录已过期，请重新登录！')
      return Promise.reject(e)
    }

    if (message == '没有权限操作') {
      ElMessage.error('没有权限操作，请设置密钥🔐！')
      return Promise.reject(e)
    }

    ElMessage.error(message)
    return Promise.reject(e)
  }
)

export default request as any
