import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      // 登录页懒加载
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      // 布局容器懒加载
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: 'article/manage',
      children: [
        // 所有子路由全部懒加载
        {
          path: 'article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: 'article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: 'user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: 'user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: 'user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 导航守卫-登录页面拦截
// 根据返回值判断是否放行
// 1. true / undefined 放行 前往to
// 2. false 不放行 回到from
// 3. 路由地址 / 路径对象 重定向到指定路由地址
//    /login    { name:'login' }
// 如果没有token 且访问了非登录页 拦截到登录 其他情况放行
router.beforeEach((to) => {
  console.log(useUserStore().token)
  return !useUserStore().token && to.path !== '/login' ? '/login' : true
})

export default router
