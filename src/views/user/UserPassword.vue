<template>
  <PageContainer title="重置密码">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="pwd-form"
    >
      <!-- 输入框加size="large"，放大尺寸 -->
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          v-model="form.old_pwd"
          type="password"
          placeholder="请输入6-15位旧密码"
          show-password
          size="large"
          class="pwd-input"
        />
      </el-form-item>

      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="form.new_pwd"
          type="password"
          placeholder="请输入6-15位新密码"
          show-password
          size="large"
          class="pwd-input"
        />
      </el-form-item>

      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input
          v-model="form.re_pwd"
          type="password"
          placeholder="请再次输入新密码"
          show-password
          size="large"
          class="pwd-input"
        />
      </el-form-item>

      <el-form-item>
        <!-- 按钮加size="large"，放大尺寸 -->
        <el-button type="primary" @click="onSubmit" size="large"
          >修改密码</el-button
        >
        <el-button @click="resetForm" size="large">重置</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/PageContainer.vue'
import { updateUserPwdRequest } from '@/api/user'

const formRef = ref(null)
const form = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 自定义校验规则：确认新密码必须与新密码一致
const validateRePwd = (rule, value, callback) => {
  if (value !== form.value.new_pwd) {
    callback(new Error('两次输入的新密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度为6-15位', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度为6-15位', trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateRePwd, trigger: 'blur' }
  ]
}

// 提交修改密码
const onSubmit = async () => {
  await formRef.value.validate()
  await updateUserPwdRequest({
    old_pwd: form.value.old_pwd,
    new_pwd: form.value.new_pwd,
    re_pwd: form.value.re_pwd
  })
  ElMessage.success('密码修改成功')
  resetForm()
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped>
/* 输入框宽度设为原来的一半（默认约400px，改为200px） */
.pwd-input {
  width: 400px; /* 核心：输入框缩短到一半 */
}

/* 可选：给表单加个间距，布局更宽松 */
.pwd-form {
  padding: 20px 0;
}
</style>
