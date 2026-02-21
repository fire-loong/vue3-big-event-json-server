<script setup>
import { ref, inject } from 'vue'
import { addArticleCateRequest, updateArticleCateRequest } from '@/api/article'
import { ElMessage } from 'element-plus'

const setChannelForm = inject('setChannelForm')
const getChannelList = inject('getChannelList')
// 定制弹窗
const props = defineProps({
  title: {
    required: true,
    type: String
  },
  mode: {
    required: true,
    type: String
  },
  form: {
    required: true,
    type: Object
  },
  id: {
    required: true,
    type: Number
  }
})
// 弹窗
const visible = ref(false)

const open = ({ mode, cate_name, cate_alias } = {}) => {
  visible.value = true

  if (mode === 'edit') {
    setChannelForm('cate_name', cate_name)
    setChannelForm('cate_alias', cate_alias)
  } else {
    setChannelForm('cate_name', '')
    setChannelForm('cate_alias', '')
  }
}
const confirm = async () => {
  visible.value = false
  if (props.mode === 'add') {
    await addArticleCateRequest(props.form.cate_name, props.form.cate_alias)
    getChannelList()
    ElMessage.success(`成功添加分类${props.form.cate_name}`)
  } else {
    await updateArticleCateRequest(
      props.id,
      props.form.cate_name,
      props.form.cate_alias
    )
    getChannelList()
    ElMessage.success('修改成功')
  }
}
// 对外暴露方法 添加 or 编辑
defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="30%">
    <slot name="content"></slot>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
