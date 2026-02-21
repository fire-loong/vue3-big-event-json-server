<script setup>
import { ref, provide } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import {
  articleCatesRequest,
  articleListRequest,
  deleteArticleRequest
} from '@/api/article'
import ChannelSelect from './components/ChannelSelect.vue'
import ChannelDraw from './components/ChannelDraw.vue'
import { formatTime } from '@/utils/format'

// 搜索表单
const SearchForm = ref({
  cate_id: '',
  state: ''
})
// 分类列表
const cateList = ref([])
const getCateList = async () => {
  const res = await articleCatesRequest()
  cateList.value = res.data.data
}
getCateList()
// 文章列表
const articleList = ref([])

// 当前页数
const pagenum = ref(1)
// 当前页需要数据条数
const pagesize = ref(10)
// 总条数
const total = ref(0)

const loading = ref(false)
// 搜索
const search = async () => {
  loading.value = true
  const o = {
    pagenum: pagenum.value,
    pagesize: pagesize.value,
    cate_id: SearchForm.value.cate_id,
    state: SearchForm.value.state
  }
  const res = await articleListRequest(o)
  articleList.value = res.data.data.articles || []
  total.value = res.data.data.total || 0 // 总条数取 data.total
  loading.value = false
}
search()
// 重置
const reset = () => {
  pagenum.value = 1
  pagesize.value = 10
  SearchForm.value.cate_id = ''
  SearchForm.value.state = ''
  search()
}

const setSearchForm = (key, value) => {
  if (!Object.keys(SearchForm.value).includes(key)) return
  SearchForm.value[key] = value
}
provide('setSearchForm', setSearchForm)

const handleSizeChange = () => {
  search()
}
const handleCurrentChange = () => {
  search()
}

const draw = ref()
// 查看文章
const lookArticle = (row) => {
  draw.value.open('look', row.id)
}
// 新增文章
const addArticle = () => {
  draw.value.open('add', '')
  pagenum.value = Math.ceil((total.value + 1) / pagesize.value)
  search()
}
// 编辑文章
const handleEdit = (row) => {
  draw.value.open('edit', row.id)
}
const handleDelete = (row) => {
  ElMessageBox.confirm('你确认要删除这篇文章吗？', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteArticleRequest(row.id)
      search()
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消'
      })
    })
}
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="addArticle">发布文章</el-button>
    </template>
    <!-- 搜索表单 -->
    <el-form :model="SearchForm" :inline="true">
      <el-form-item label="文章分类：" style="width: 300px">
        <ChannelSelect v-model="SearchForm.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：" style="width: 300px">
        <el-select v-model="SearchForm.state" placeholder="请选择">
          <el-option value="已发布">已发布</el-option>
          <el-option value="草稿">草稿</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 渲染文章列表表格 -->
    <div
      style="
        height: 500px;
        overflow-y: auto;
        margin-bottom: 10px;
        border: 1px solid #ebeef5;
        border-radius: 4px;
      "
    >
      <el-table :data="articleList" style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="文章标题">
          <template #default="{ row }">
            <el-link
              type="primary"
              underline="never"
              @click="lookArticle(row)"
              >{{ row.title }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="分类"></el-table-column>
        <el-table-column prop="pub_date" label="发布时间">
          <template #default="{ row }">
            {{ formatTime(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
              type="primary"
              :icon="Edit"
              circle
            ></el-button>
            <el-button
              size="small"
              @click="handleDelete(scope.row)"
              type="danger"
              :icon="Delete"
              circle
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div
      style="
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 20px 0;
        position: sticky; /* 粘性定位，滚动时固定 */
        bottom: 0; /* 固定在底部 */
        background: #fff; /* 白色背景防穿透 */
        z-index: 10; /* 确保在最上层 */
      "
    >
      <el-pagination
        v-model:current-page="pagenum"
        v-model:page-size="pagesize"
        :page-sizes="[10, 20, 30, 40]"
        :default-page-size="10"
        :background="true"
        layout="jumper, total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 抽屉 -->
    <ChannelDraw ref="draw" @update:articles="search"></ChannelDraw>
  </PageContainer>
</template>
