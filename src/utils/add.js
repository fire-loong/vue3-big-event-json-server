// 先确认接口导入正确
import { addArticleRequest } from '@/api/article'
import { ElMessage } from 'element-plus'

// 核心修复：简化数据生成，确保title绝对有值
const generateFakeArticle = (index) => {
  // 直接生成简单、确定的标题，避免模板取值异常
  const title = `测试文章_14538分类_${index + 1}_${Date.now()}` // 加时间戳避免重复
  return {
    title: title, // 明确赋值，确保非空
    cate_id: '14538', // 固定分类ID
    content: `这是第${index + 1}篇测试文章，分类ID：14538，发布时间：${new Date().toLocaleString()}`,
    // 修复：封面图可选（如果后端非必填，先注释/传空，避免文件格式问题导致其他字段失效）
    // cover_img: new File([''], `test_cover_${index + 1}.png`, { type: 'image/png' }),
    cover_img: new File(['fake image content'], `cover_${index + 1}.jpg`, {
      type: 'image/jpeg'
    }), // 先传空，优先保证基础字段能提交
    state: index % 2 === 0 ? '已发布' : '草稿'
  }
}

// 批量创建函数（重点修复FormData赋值）
export const batchCreateArticles = async (count = 20) => {
  ElMessage.info(`开始批量创建${count}篇文章（分类ID：14538）`)
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < count; i++) {
    try {
      const articleData = generateFakeArticle(i)
      const formData = new FormData()

      // 关键修复：手动逐个append，确保每个字段都正确传递
      formData.append('title', articleData.title) // 单独append title，避免遗漏
      formData.append('cate_id', articleData.cate_id)
      formData.append('content', articleData.content)
      formData.append('state', articleData.state)
      formData.append('cover_img', articleData.cover_img)
      // 封面图先注释，等基础字段成功后再加
      // if (articleData.cover_img) formData.append('cover_img', articleData.cover_img)

      // 调试：打印FormData内容，确认title有值
      console.log(`第${i + 1}篇title：`, articleData.title)
      for (let [key, value] of formData.entries()) {
        console.log(`FormData[${key}]：`, value)
      }

      // 发送请求（确保接口支持FormData）
      const res = await addArticleRequest(formData)
      console.log(`✅ 第${i + 1}篇创建成功：`, res.data)
      successCount++
    } catch (err) {
      console.error(`❌ 第${i + 1}篇创建失败：`, err.message || err)
      failCount++
    }
    // 延迟1秒，避免请求过快
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  ElMessage.success(
    `批量创建完成！成功：${successCount}篇，失败：${failCount}篇`
  )
  console.log(`📊 最终统计：成功${successCount}篇，失败${failCount}篇`)
}
