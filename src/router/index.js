import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts/index.vue'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

export const routes = [
  {
    name: 'login',
    path: '/login',
    hidden: true, // 代表着不在菜单栏展示
    component: () => import('@/pages/login/index.vue')
  },
  {
    name: 'home',
    path: '/home',
    hidden: true, // 代表着不在菜单栏展示
    component: () => import('@/pages/home/index.vue')
  },
  {
    path: '/',
    // component: Layout,
    hidden: true,
    redirect: '/production-management/production-query',
    meta: { title: '主页' }
  }
]

const createRouter = () =>
  new VueRouter({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes
  })

const router = createRouter()

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

export default router
