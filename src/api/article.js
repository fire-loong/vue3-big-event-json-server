import request from '@/utils/request'

// ========== 核心修改：统一指向本地接口（http://localhost:3000） ==========
// 注意：需要确保你的 request.js 里的 baseURL 已经改为 'http://localhost:3000'
// 如果 request.js 没改 baseURL，也可以在每个接口里直接写完整地址

// 获取文章分类
export const articleCatesRequest = () => request.get('/my/cate/list')

// 获取文章分类详情 (文章分类id)
export const articleCateDetailRequest = (id) =>
  request({
    url: '/my/cate/info',
    method: 'GET', // 显式指定 GET 方法（和本地接口对齐）
    params: {
      id
    }
  })

// 增加文章分类 (文章分类名字,文章分类别名)
export const addArticleCateRequest = (cate_name, cate_alias) =>
  request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })

// 更新文章分类 (文章分类id,文章分类名字,文章分类别名)
export const updateArticleCateRequest = (id, cate_name, cate_alias) =>
  request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })

// 删除文章分类 (文章分类id)
export const deleteArticleCateRequest = (id) =>
  request({
    url: '/my/cate/del',
    method: 'DELETE',
    data: {
      // 本地接口是从 body 取 id，不是 params
      id
    }
  })

// 获取文章列表
export const articleListRequest = (o) =>
  request({
    url: '/my/article/list',
    method: 'GET',
    params: {
      ...o
    }
  })

// 发布文章
export const addArticleRequest = (articleData) =>
  request({
    url: '/my/article/add',
    method: 'POST',
    data: articleData
  })

// 获取文章详情
export const articleDetailRequest = (id) =>
  request({
    url: '/my/article/info',
    method: 'GET',
    params: {
      id
    }
  })

// 更新文章
export const updateArticleRequest = (articleData) =>
  request({
    url: '/my/article/info',
    method: 'PUT',
    data: articleData
  })

// 删除文章
export const deleteArticleRequest = (id) =>
  request({
    url: '/my/article/info',
    method: 'DELETE',
    data: {
      // 本地接口是从 body 取 id，不是 params
      id
    }
  })
