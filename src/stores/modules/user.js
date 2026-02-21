import { userInfoRequest } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
  'userstore',
  () => {
    const token = ref('')
    const setToken = (newVal) => {
      token.value = newVal
      // 保留之前加的本地存储（双保险）
      localStorage.setItem('token', newVal)
    }
    const removeToken = () => {
      token.value = ''
      localStorage.removeItem('token')
    }

    const user = ref({})
    // 核心微调：适配本地接口的返回格式
    const getUserInfo = async () => {
      const res = await userInfoRequest()
      // 本地接口返回 res.data 是用户信息对象，不用再取 res.data.data
      // 兼容写法：同时适配本地/黑马接口（防止后续切回黑马）
      user.value = res.data?.data || res.data
    }
    const setUserInfo = (obj) => (user.value = { ...user.value, ...obj })

    return {
      token,
      setToken,
      removeToken,

      user,
      getUserInfo,
      setUserInfo
    }
  },
  { persist: true }
)
