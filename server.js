const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json') // 可以保留空的 db.json，主要用自定义接口
const middlewares = jsonServer.defaults()
const fs = require('fs')
const path = require('path')

// 数据文件路径
const dataFile = path.join(__dirname, 'data.json')

// 读取数据文件
const readData = () => {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.error('读取数据文件失败:', err)
  }
  return null
}

// 保存数据到文件
const saveData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('保存数据文件失败:', err)
  }
}

// 添加日志中间件
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// 使用日志中间件
server.use(logRequest);

// 添加CORS中间件
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

server.use(middlewares)
server.use(jsonServer.bodyParser) // 解析 POST/PUT/PATCH 请求体

// ==================== 模拟数据库（文件存储，重启后保留） ====================
// 从文件读取数据，如果文件不存在则使用默认数据
let data = readData()

// 用户数据
let users = []
// 文章分类数据
let categories = []
// 文章数据
let articles = []

// 如果数据文件存在，使用文件中的数据
if (data) {
  users = data.users || []
  categories = data.categories || []
  articles = data.articles || []
} else {
  // 使用默认数据
  users = [
    {
      id: 1,
      username: 'admin',
      password: '123456',
      nickname: '测试管理员',
      user_pic: '',
      email: ''
    }
  ]

  categories = [
    { id: 1, cate_name: '科技', cate_alias: 'tech', is_delete: 0 },
    { id: 2, cate_name: '生活', cate_alias: 'life', is_delete: 0 },
    { id: 3, cate_name: '娱乐', cate_alias: 'ent', is_delete: 0 }
  ]

  articles = [
    {
      id: 1,
      title: '测试文章1',
      cate_id: 1,
      content: '这是本地测试文章内容1',
      state: '已发布',
      author_id: 1,
      create_time: '2026-02-21',
      update_time: '2026-02-21'
    },
    {
      id: 2,
      title: '测试文章2',
      cate_id: 1,
      content: '这是本地测试文章内容2',
      state: '已发布',
      author_id: 1,
      create_time: '2026-02-20',
      update_time: '2026-02-20'
    },
    {
      id: 3,
      title: '测试文章3',
      cate_id: 1,
      content: '这是本地测试文章内容3',
      state: '草稿',
      author_id: 1,
      create_time: '2026-02-19',
      update_time: '2026-02-19'
    },
    {
      id: 4,
      title: '测试文章4',
      cate_id: 2,
      content: '这是本地测试文章内容4',
      state: '已发布',
      author_id: 1,
      create_time: '2026-02-18',
      update_time: '2026-02-18'
    },
    {
      id: 5,
      title: '测试文章5',
      cate_id: 2,
      content: '这是本地测试文章内容5',
      state: '已发布',
      author_id: 1,
      create_time: '2026-02-17',
      update_time: '2026-02-17'
    },
    {
      id: 6,
      title: '测试文章6',
      cate_id: 2,
      content: '这是本地测试文章内容6',
      state: '草稿',
      author_id: 1,
      create_time: '2026-02-16',
      update_time: '2026-02-16'
    },
    {
      id: 7,
      title: '测试文章7',
      cate_id: 3,
      content: '这是本地测试文章内容7',
      state: '已发布',
      author_id: 1,
      create_time: '2026-02-15',
      update_time: '2026-02-15'
    },
    {
      id: 8,
      title: '测试文章8',
      cate_id: 3,
      content: '这是本地测试文章内容8',
      state: '已发布',
      author_id: 1,
      create_time: '2026-02-14',
      update_time: '2026-02-14'
    },
    {
      id: 9,
      title: '测试文章9',
      cate_id: 3,
      content: '这是本地测试文章内容9',
      state: '草稿',
      author_id: 1,
      create_time: '2026-02-13',
      update_time: '2026-02-13'
    },
    {
      id: 10,
      title: '测试文章10',
      cate_id: 1,
      content: '这是本地测试文章内容10',
      state: '已发布',
      author_id: 1,
      create_time: '2026-02-12',
      update_time: '2026-02-12'
    },
    {
      id: 11,
      title: '测试文章11',
      cate_id: 2,
      content: '这是本地测试文章内容11',
      state: '已发布',
      author_id: 1,
      create_time: '2026-02-11',
      update_time: '2026-02-11'
    },
    {
      id: 12,
      title: '测试文章12',
      cate_id: 3,
      content: '这是本地测试文章内容12',
      state: '草稿',
      author_id: 1,
      create_time: '2026-02-10',
      update_time: '2026-02-10'
    }
  ]
  
  // 保存初始数据到文件
  saveData({ users, categories, articles })
}

// 保存数据的函数
const saveAllData = () => {
  saveData({ users, categories, articles })
}

// ==================== 基础接口（登录/注册） ====================
// 注册接口
server.post('/api/reg', (req, res) => {
  const { username, password, repassword } = req.body
  if (!username || !password || !repassword) {
    return res.json({ code: 1, message: '请填写完整的注册信息', data: null })
  }
  if (password !== repassword) {
    return res.json({ code: 1, message: '两次密码不一致', data: null })
  }
  if (users.find((u) => u.username === username)) {
    return res.json({ code: 1, message: '用户名已存在', data: null })
  }
  const newUser = {
    id: users.length + 1,
    username,
    password,
    nickname: username,
    user_pic: '',
    email: ''
  }
  users.push(newUser)
  saveAllData()
  res.json({ code: 0, message: '注册成功！', data: { username } })
})

// 登录接口
server.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.json({ code: 1, message: '请填写用户名和密码', data: null })
  }
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) {
    return res.json({ code: 1, message: '用户名或密码错误', data: null })
  }
  res.json({
    code: 0,
    message: '登录成功！',
    data: {
      token: `Bearer_${Date.now()}_${user.id}`, // 本地 token 格式
      userInfo: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.user_pic
      }
    }
  })
})

// ==================== 用户相关接口（解决 /my/userinfo 404） ====================
// 获取用户信息
server.get('/my/userinfo', (req, res) => {
  const token = req.headers.authorization
  // 兼容：只校验开头是 Bearer，不限制分隔符（空格/下划线/短横线）
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  // 统一格式：把空格/短横线换成下划线，再分割取 userId
  const tokenStr = token.replace(/ |-/g, '_')
  const userId = tokenStr.split('_')[2]
  const user = users.find((u) => u.id == userId)
  if (!user) {
    return res.json({ code: 1, message: '用户不存在', data: null })
  }
  res.json({
    code: 0,
    message: '获取用户信息成功',
    data: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      user_pic: user.user_pic,
      email: user.email,
      user_name: user.username // 兼容黑马接口字段
    }
  })
})

// 更新用户基本资料
server.put('/my/userinfo', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const tokenStr = token.replace(/ |-/g, '_')
  const userId = tokenStr.split('_')[2]
  const user = users.find((u) => u.id == userId)
  if (!user) {
    return res.json({ code: 1, message: '用户不存在', data: null })
  }
  const { nickname, email } = req.body
  if (nickname) user.nickname = nickname
  if (email) user.email = email
  saveAllData()
  res.json({ code: 0, message: '更新基本资料成功', data: user })
})

// 更新用户头像
server.patch('/my/update/avatar', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const tokenStr = token.replace(/ |-/g, '_')
  const userId = tokenStr.split('_')[2]
  const user = users.find((u) => u.id == userId)
  if (!user) {
    return res.json({ code: 1, message: '用户不存在', data: null })
  }
  user.user_pic = req.body.avatar
  saveAllData()
  res.json({
    code: 0,
    message: '更新头像成功',
    data: { user_pic: user.user_pic }
  })
})

// 更新用户密码
server.patch('/my/updatepwd', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const tokenStr = token.replace(/ |-/g, '_')
  const userId = tokenStr.split('_')[2]
  const user = users.find((u) => u.id == userId)
  if (!user) {
    return res.json({ code: 1, message: '用户不存在', data: null })
  }
  const { old_pwd, new_pwd, re_pwd } = req.body
  if (user.password !== old_pwd) {
    return res.json({ code: 1, message: '原密码错误', data: null })
  }
  if (new_pwd !== re_pwd) {
    return res.json({ code: 1, message: '两次密码不一致', data: null })
  }
  user.password = new_pwd
  saveAllData()
  res.json({ code: 0, message: '更新密码成功', data: null })
})

// ==================== 文章分类接口（解决 /my/cate/list 404） ====================
// 获取分类列表
server.get('/my/cate/list', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  res.json({
    code: 0,
    message: '获取分类列表成功',
    data: categories.filter((c) => c.is_delete === 0)
  })
})

// 添加分类
server.post('/my/cate/add', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const { cate_name, cate_alias } = req.body
  if (!cate_name || !cate_alias) {
    return res.json({ code: 1, message: '分类名称和别名不能为空', data: null })
  }
  const newCate = {
    id: categories.length + 1,
    cate_name,
    cate_alias,
    is_delete: 0
  }
  categories.push(newCate)
  saveAllData()
  res.json({ code: 0, message: '添加分类成功', data: newCate })
})

// 修改分类
server.put('/my/cate/info', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const { id, cate_name, cate_alias } = req.body
  const cate = categories.find((c) => c.id == id)
  if (!cate) {
    return res.json({ code: 1, message: '分类不存在', data: null })
  }
  cate.cate_name = cate_name
  cate.cate_alias = cate_alias
  saveAllData()
  res.json({ code: 0, message: '修改分类成功', data: cate })
})

// 删除分类
server.delete('/my/cate/del', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const { id } = req.body
  const cate = categories.find((c) => c.id == id)
  if (!cate) {
    return res.json({ code: 1, message: '分类不存在', data: null })
  }
  // 检查该分类下是否存在文章
  const hasArticles = articles.some((art) => art.cate_id == id)
  if (hasArticles) {
    return res.json({ code: 1, message: '该分类下存在文章，禁止删除', data: null })
  }
  cate.is_delete = 1
  saveAllData()
  res.json({ code: 0, message: '删除分类成功', data: null })
})

// ==================== 文章管理接口（解决 /my/article/list 404） ====================
// 获取文章列表（支持分页/筛选）
server.get('/my/article/list', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  // 统一格式：处理 token 分隔符
  const tokenStr = token.replace(/ |-/g, '_')
  const userId = tokenStr.split('_')[2]

  // 解析分页和筛选参数
  const { pagenum = 1, pagesize = 10, cate_id = '', state = '' } = req.query

  // 筛选文章
  let filteredArticles = articles.filter((art) => {
    const matchCate = cate_id ? art.cate_id == cate_id : true
    const matchState = state ? art.state === state : true
    return matchCate && matchState && art.author_id == userId
  })

  // 处理文章数据，添加分类名称
  const processedArticles = filteredArticles.map((article) => {
    const category = categories.find((cate) => cate.id == article.cate_id)
    return {
      ...article,
      cate_name: category ? category.cate_name : ''
    }
  })

  // 分页处理
  const total = processedArticles.length
  const start = (pagenum - 1) * pagesize
  const end = start + Number(pagesize)
  const paginatedArticles = processedArticles.slice(start, end)

  res.json({
    code: 0,
    message: '获取文章列表成功',
    data: {
      total,
      articles: paginatedArticles
    }
  })
})

// 发布/添加文章
server.post('/my/article/add', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const tokenStr = token.replace(/ |-/g, '_')
  const userId = tokenStr.split('_')[2]

  // 🔥 关键修改1：解析 FormData（处理文件上传）
  const { title, cate_id, content, state } = req.body
  // 🔥 关键修改2：移除 cover_img 的必填校验（它不是核心字段）
  if (!title || !cate_id || !content || !state) {
    return res.json({
      code: 1,
      message: '文章标题/分类/内容/状态不能为空',
      data: null
    })
  }

  // 🔥 关键修改3：新增文章时，cover_img 可选存储（模拟文件上传）
  const newArticle = {
    id: articles.length + 1,
    title,
    cate_id,
    content,
    state,
    author_id: userId,
    create_time: new Date().toLocaleDateString(),
    update_time: new Date().toLocaleDateString(),
    cover_img: req.body.cover_img || '' // 存储封面（前端传了就存，没传就空）
  }
  articles.push(newArticle)
  saveAllData()
  res.json({ code: 0, message: '发布文章成功', data: newArticle })
})

// 获取文章详情
server.get('/my/article/info', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const tokenStr = token.replace(/ |-/g, '_')
  const userId = tokenStr.split('_')[2]

  const { id } = req.query
  const article = articles.find(
    (art) => art.id == id && art.author_id == userId
  )
  if (!article) {
    return res.json({ code: 1, message: '文章不存在', data: null })
  }
  // 添加分类名称
  const category = categories.find((cate) => cate.id == article.cate_id)
  const articleWithDetails = {
    ...article,
    cate_name: category ? category.cate_name : '',
    cover_img: article.cover_img || ''
  }
  res.json({ code: 0, message: '获取文章详情成功', data: articleWithDetails })
})

// 修改文章
server.put('/my/article/info', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const tokenStr = token.replace(/ |-/g, '_')
  const userId = tokenStr.split('_')[2]

  const { id, title, cate_id, content, state } = req.body
  const article = articles.find(
    (art) => art.id == id && art.author_id == userId
  )
  if (!article) {
    return res.json({ code: 1, message: '文章不存在', data: null })
  }
  article.title = title
  article.cate_id = cate_id
  article.content = content
  article.state = state
  article.update_time = new Date().toLocaleDateString()
  saveAllData()
  res.json({ code: 0, message: '修改文章成功', data: article })
})

// 删除文章
server.delete('/my/article/info', (req, res) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ code: 1, message: '未登录', data: null })
  }
  const tokenStr = token.replace(/ |-/g, '_')
  const userId = tokenStr.split('_')[2]

  const { id } = req.body
  const index = articles.findIndex(
    (art) => art.id == id && art.author_id == userId
  )
  if (index === -1) {
    return res.json({ code: 1, message: '文章不存在', data: null })
  }
  articles.splice(index, 1)
  saveAllData()
  res.json({ code: 0, message: '删除文章成功', data: null })
})

// ==================== 启动服务 ====================
// 添加静态文件服务配置（使用Node.js内置模块）
const serveStatic = (req, res, next) => {
  console.log(`[静态文件服务] 请求路径: ${req.url}`);
  
  // 检查dist目录是否存在
  const distDir = path.join(__dirname, 'dist');
  fs.access(distDir, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`[静态文件服务] 错误: dist目录不存在`);
      return res.status(500).send('Internal Server Error: dist directory not found');
    }
    
    // 处理根路径
    let filePath;
    if (req.url === '/') {
      filePath = path.join(distDir, 'index.html');
      console.log(`[静态文件服务] 根路径请求，返回: ${filePath}`);
    } else {
      // 对于带有特殊字符的路径，直接尝试拼接
      filePath = path.join(distDir, req.url);
      console.log(`[静态文件服务] 尝试访问: ${filePath}`);
    }
    
    // 检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`[静态文件服务] 文件不存在: ${filePath}`);
        
        // 对于所有请求，都返回index.html（支持SPA路由）
        const indexPath = path.join(distDir, 'index.html');
        fs.access(indexPath, fs.constants.F_OK, (err) => {
          if (err) {
            console.error(`[静态文件服务] 错误: index.html不存在`);
            return res.status(404).send('Not Found: index.html not found');
          }
          console.log(`[静态文件服务] 返回index.html: ${indexPath}`);
          fs.readFile(indexPath, (err, data) => {
            if (err) {
              console.error(`[静态文件服务] 错误: 读取index.html失败: ${err.message}`);
              return res.status(500).send('Internal Server Error: failed to read index.html');
            }
            res.setHeader('Content-Type', 'text/html');
            res.send(data);
          });
        });
      } else {
        // 文件存在，读取并返回
        console.log(`[静态文件服务] 文件存在，返回: ${filePath}`);
        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error(`[静态文件服务] 错误: 读取文件失败: ${err.message}`);
            return res.status(500).send('Internal Server Error: failed to read file');
          }
          // 设置Content-Type
          const ext = path.extname(filePath);
          let contentType = 'text/plain';
          switch (ext) {
            case '.html': contentType = 'text/html'; break;
            case '.css': contentType = 'text/css'; break;
            case '.js': contentType = 'application/javascript'; break;
            case '.json': contentType = 'application/json'; break;
            case '.png': contentType = 'image/png'; break;
            case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break;
            case '.gif': contentType = 'image/gif'; break;
            case '.ico': contentType = 'image/x-icon'; break;
          }
          console.log(`[静态文件服务] 返回文件，Content-Type: ${contentType}`);
          res.setHeader('Content-Type', contentType);
          res.send(data);
        });
      }
    });
  });
};

// 使用改进后的静态文件服务
server.use(serveStatic);

// 确保所有请求都能得到响应
server.use((req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Not Found');
    }
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    });
  });
});

server.use(router); // 保留 json-server 原生路由（可选）

// 🔥 关键修改：使用环境变量端口，兼容 Railway 自动分配的端口
const PORT = process.env.PORT || 3002;
server.listen(PORT, '0.0.0.0', () => {
  console.log(
    `✅ 本地接口服务（含用户/分类/文章）启动成功：http://0.0.0.0:${PORT}`
  );
  console.log('📌 测试账号：admin / 123456');
});
