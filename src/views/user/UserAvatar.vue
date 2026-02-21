<template>
  <PageContainer title="更换头像">
    <div class="avatar-container">
      <!-- 头像预览区域：优先渲染用户头像，不存在则显示默认样式 -->
      <div
        class="avatar-preview"
        :class="{ 'dashed-border': !currentAvatar }"
        @click="handleSelect"
      >
        <template v-if="currentAvatar">
          <img :src="currentAvatar" alt="头像预览" class="preview-img" />
        </template>
        <template v-else>
          <span class="placeholder-text">点击选择头像</span>
        </template>
      </div>

      <!-- 操作按钮 -->
      <div class="avatar-actions">
        <el-button type="primary" @click="handleSelect">+ 选择图片</el-button>
        <el-button
          type="success"
          :disabled="!selectedFile"
          @click="handleUpload"
        >
          <el-icon><Upload /></el-icon>
          上传头像
        </el-button>
      </div>

      <!-- 隐藏的文件选择框 -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleFileChange"
      />
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { updateUserAvatarRequest } from '@/api/user'

const userstore = useUserStore()
const fileInputRef = ref(null)
const selectedFile = ref(null)
const avatarUrl = ref('')

// 核心：优先渲染用户头像，不存在则用本地预览，都不存在则显示默认样式
const currentAvatar = computed(() => {
  return avatarUrl.value || userstore.user?.user_pic || ''
})

// 选择图片
const handleSelect = () => {
  fileInputRef.value?.click()
}

// 监听文件选择，生成本地预览地址
const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  selectedFile.value = file
  avatarUrl.value = URL.createObjectURL(file)
}

// 把图片转成 base64
const fileToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
  })
}

// 上传头像（仅这里调用接口，之前都是本地预览）
const handleUpload = async () => {
  if (!selectedFile.value) return

  const base64 = await fileToBase64(selectedFile.value)
  await updateUserAvatarRequest({ avatar: base64 })
  // 更新仓库头像
  userstore.setUserInfo({ ...userstore.user, user_pic: base64 })
  ElMessage.success('头像上传成功')
  // 重置状态
  selectedFile.value = null
  avatarUrl.value = ''
}
</script>

<style scoped>
.avatar-container {
  padding: 20px;
}

.avatar-preview {
  width: 300px;
  height: 300px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  overflow: hidden;
  cursor: pointer;
}

.dashed-border {
  border: 2px dashed #dcdfe6;
  background-color: #f5f7fa;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-text {
  color: #c0c4cc;
  font-size: 24px;
}

.avatar-actions {
  display: flex;
  gap: 16px;
}
</style>
