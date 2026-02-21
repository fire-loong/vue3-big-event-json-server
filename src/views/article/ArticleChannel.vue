<script setup>
import { articleCatesRequest, deleteArticleCateRequest } from '@/api/article'
import { ref, provide } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage } from 'element-plus'

// 加载
const loading = ref(true)

// 获取分类列表
const channelList = ref([])
const getChannelList = async () => {
  loading.value = true
  const res = await articleCatesRequest()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const title = ref('添加分类')
const mode = ref('add')
const editId = ref('')

// 改变弹窗表单内容
const setChannelForm = (key, val) => {
  if (!Object.keys(ChannelForm.value).includes(key)) return
  ChannelForm.value[key] = val
}

// 向子组件传递 弹窗显示变量 弹窗显示修改函数
provide('setChannelForm', setChannelForm)
provide('getChannelList', getChannelList)
// 添加 or 编辑
const channelmode = ref()
// 新增分类
const onAddChannel = () => {
  mode.value = 'add'
  title.value = '添加分类'
  channelmode.value.open({ mode: mode.value })
}

// 编辑 删除
const onEditChannel = (row) => {
  mode.value = 'edit'
  title.value = '编辑分类'
  editId.value = row.id
  channelmode.value.open({
    mode: mode.value,
    cate_name: row.cate_name,
    cate_alias: row.cate_alias
  })
}
const onDeleteChannel = (row) => {
  ElMessageBox.confirm('你确认要删除该分类吗?', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await deleteArticleCateRequest(row.id)
      console.log('响应成功')

      ElMessage.success(res.data.message)
      getChannelList()
    })
    .catch(() => {
      console.log('失败')

      ElMessage({
        type: 'info',
        message: '操作取消'
      })
    })
}

// 弹窗表单
const ChannelForm = ref({
  cate_name: '',
  cate_alias: ''
})
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>

    <!-- 表格组件 按钮组件 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作">
        <template #default="{ row, $index }">
          <el-button
            type="primary"
            :icon="Edit"
            circle
            plain
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            @click="onDeleteChannel(row, $index)"
          />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 弹窗组件 -->
    <ChannelEdit
      :title="title"
      :mode="mode"
      :form="ChannelForm"
      :id="Number(editId)"
      ref="channelmode"
    >
      <template #content>
        <el-form :model="ChannelForm">
          <el-form-item>
            <template #label>
              <span><i style="color: red">*</i> 分类名称</span>
            </template>
            <el-input v-model="ChannelForm.cate_name"></el-input>
          </el-form-item>
          <el-form-item>
            <template #label>
              <span><i style="color: red">*</i> 分类别名</span>
            </template>
            <el-input v-model="ChannelForm.cate_alias"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </ChannelEdit>
  </PageContainer>
</template>
