import axios from 'axios'
import { useUserStore } from '@/stores/modules/user'
import router from '@/router'
// 注意：补充导入 ElMessage（你的代码里用了但没导入，会报错）
import { ElMessage } from 'element-plus'

// 使用相对路径，适用于本地和部署环境
const baseURL = ''

const instance = axios.create({
  baseURL,
  timeout: 100000
})

// 添加请求拦截器（逻辑完全不变）
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 添加响应拦截器（逻辑完全不变）
instance.interceptors.response.use(
  (res) => {
    // 接口文档code === 0 才返回成功
    if (res.data.code === 0) {
      return res
    }
    ElMessage({ message: res.data.message || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  (err) => {
    ElMessage({
      message: err.response.data.message || '服务异常',
      type: 'error'
    })
    console.log(err)
    // 拦截回登录页面
    if (err.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
