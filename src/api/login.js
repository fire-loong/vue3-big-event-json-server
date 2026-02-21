import request from '@/utils/request'

// 2. 注册请求（和你原来的逻辑一致，只是换了请求实例）
export const registerRequest = ({ username, password, repassword }) =>
  request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })

// 3. 登录请求（同理）
export const loginRequest = ({ username, password }) =>
  request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
