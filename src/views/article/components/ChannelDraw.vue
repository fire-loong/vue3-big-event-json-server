<script setup>
import { ref, defineEmits } from 'vue'
import {
  articleDetailRequest,
  addArticleRequest,
  updateArticleRequest
} from '@/api/article'
import { formatTime } from '@/utils/format'
import { Plus } from '@element-plus/icons-vue'
import ChannelSelect from './ChannelSelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update:articles'])
const visible = ref(false)
const mode = ref('look')
const id = ref('')
const quill = ref()
const coverFile = ref()
const open = (newmode, newid) => {
  form.value = {
    title: '',
    cate_id: '',
    cover_img: '',
    content: '',
    state: ''
  }
  quill.value?.setText('')
  mode.value = newmode
  if (newid) id.value = newid
  visible.value = true
  if ((newmode === 'edit' || newmode === 'look') && newid) {
    getArticleDetail()
  }
}
// 新增：链接转File对象的工具函数
const urlToFile = async (url, fileName = 'cover.jpg') => {
  // 🔥 兼容本地接口：如果是本地测试，直接返回url（避免跨域）
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return url
  }
  const fullUrl = 'http://big-event-vue-api-t.itheima.net' + url
  const response = await fetch(fullUrl)
  const blob = await response.blob()
  return new File([blob], fileName, { type: blob.type })
}
// 文章详情
const articleDetail = ref({})
// 获取文章详情
const getArticleDetail = async () => {
  const res = await articleDetailRequest(id.value)
  articleDetail.value = res.data.data
  if (mode.value === 'edit') {
    form.value.title = articleDetail.value.title || ''
    form.value.cate_id = articleDetail.value.cate_id || ''
    form.value.content = articleDetail.value.content || ''
    form.value.cover_img = articleDetail.value.cover_img || ''
    // 🔥 编辑时如果没有封面，不强制赋值
    if (articleDetail.value.cover_img) {
      coverFile.value = await urlToFile(articleDetail.value.cover_img)
    }
  }
}
// 表单
const form = ref({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
})
defineExpose({
  open
})

const changeCover = (upload) => {
  form.value.cover_img = URL.createObjectURL(upload.raw)
  coverFile.value = upload.raw
}

const onPublish = async (state) => {
  // 1. 前端校验（只校验后端要求的必填项）
  if (!form.value.title.trim()) {
    ElMessage.error('文章标题不能为空')
    return
  }
  if (!form.value.cate_id) {
    ElMessage.error('请选择文章分类')
    return
  }
  if (!form.value.content.trim()) {
    ElMessage.error('文章内容不能为空')
    return
  }

  // 2. 构建提交数据（使用普通对象，不使用FormData）
  const articleData = {
    title: form.value.title.trim(),
    cate_id: form.value.cate_id,
    content: form.value.content.trim(),
    state: state
  }
  // 封面可选上传（由于是本地接口，暂时只传封面图片的URL）
  if (form.value.cover_img) {
    articleData.cover_img = form.value.cover_img
  }

  // 3. 提交
  try {
    if (mode.value === 'add') {
      const res = await addArticleRequest(articleData)
      console.log('新增成功：', res)
      ElMessage.success(state === '已发布' ? '发布成功' : '存入草稿')
      visible.value = false
      emit('update:articles')
    } else {
      articleData.id = Number(id.value)
      const res = await updateArticleRequest(articleData)
      console.log('修改成功：', res)
      ElMessage.success('修改成功')
      visible.value = false
      emit('update:articles')
    }
  } catch (err) {
    ElMessage.error('提交失败：' + (err.message || '服务器错误'))
    console.error('提交错误：', err)
  }
}
</script>

<template>
  <el-drawer
    size="50%"
    v-model="visible"
    title="文章预览"
    direction="rtl"
    v-if="mode === 'look'"
  >
    <div class="container">
      <h1>{{ articleDetail.title }}</h1>
      <div class="info" style="border-bottom: 1px solid black; height: 30px">
        作者：{{ articleDetail.username }} 发布时间：{{
          formatTime(articleDetail.pub_date || articleDetail.create_time)
        }}
        文章分类：{{ articleDetail.cate_name }}
      </div>
      <img
        v-if="articleDetail.cover_img"
        :src="articleDetail.cover_img"
        alt=""
        class="cover"
        style="width: 178px; height: 178px; object-fit: cover"
      />
      <div class="content" v-html="articleDetail.content"></div>
    </div>
  </el-drawer>
  <el-drawer
    size="50%"
    v-model="visible"
    :title="mode === 'add' ? '添加文章' : '编辑文章'"
    direction="rtl"
    v-else
  >
    <el-form :model="form">
      <el-form-item>
        <template #label>
          <span><i style="color: red">* </i> 文章标题</span>
        </template>
        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span><i style="color: red">* </i> 文章分类</span>
        </template>
        <ChannelSelect v-model="form.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span> 文章封面（可选）</span>
          <!-- 🔥 改为可选 -->
        </template>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="changeCover"
        >
          <img
            v-if="
              form.cover_img || (mode === 'edit' && articleDetail.cover_img)
            "
            :src="
              form.cover_img ||
              (articleDetail.cover_img.startsWith('http')
                ? articleDetail.cover_img
                : '' + articleDetail.cover_img)
            "
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span><i style="color: red">* </i> 文章内容</span>
        </template>
        <div class="editor">
          <quill-editor
            theme="snow"
            v-model:content="form.content"
            contentType="html"
            ref="quill"
            placeholder="请输入文章内容"
          >
          </quill-editor>
        </div>
        <div style="margin-top: 50px">
          <el-button type="primary" @click="onPublish('已发布')"
            >发布</el-button
          >
          <el-button @click="onPublish('草稿')">草稿</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.avatar {
  width: 178px;
  height: 178px;
  object-fit: cover;
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
