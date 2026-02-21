// src/api/user.js（必须是具名导出，不能改）
import request from '@/utils/request'

// ✅ 具名导出：export const xxx = ...
export const userInfoRequest = () => request.get('/my/userinfo')

export const updateUserInfoRequest = (data) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data
  })
}

export const updateUserAvatarRequest = (data) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data
  })
}

export const updateUserPwdRequest = (data) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data
  })
}
