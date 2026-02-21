<script setup>
import { ref } from 'vue' // 新增nextTick
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { updateUserInfoRequest } from '@/api/user'

const userstore = useUserStore()
userstore.getUserInfo() // 获取用户信息
const formRef = ref(null)

// 1. 初始值用仓库兜底，避免报错
const form = ref({
  username: userstore.user?.username || '',
  nickname: userstore.user?.nickname || '',
  email: userstore.user?.email || ''
})

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称长度为2-10位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ]
}

const onSubmit = async () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (valid) {
      const reqData = {
        id: userstore.user?.id,
        username: form.value.username,
        nickname: form.value.nickname,
        email: form.value.email
      }
      // 1. 提交更新请求
      await updateUserInfoRequest(reqData)
      // 2. 更新仓库数据（合并，避免覆盖成空）
      userstore.setUserInfo(reqData)
      ElMessage.success('提交成功')
    } else {
      ElMessage.error('请检查表单错误')
    }
  })
}
</script>

<template>
  <PageContainer title="基本资料">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="登录名称">
        <el-input v-model="form.username" disabled />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入2-10位昵称" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入正确格式的邮箱" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交修改</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
