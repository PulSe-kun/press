import router from './router'
import store from './store'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { setToken, getToken, removeToken } from '@/utils/auth' // get token from cookie
// import { setDocumentTitle, domTitle } from '@/utils/domUtil'
NProgress.configure({ showSpinner: false })
// 可访问的白名单
const whiteList = ['/login']
// 路由守卫
router.beforeEach(async (to, from, next) => {
  // console.log(to, from)
  NProgress.start()
  // to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${domTitle} - ${to.meta.title}`)
  // 请求带有 redirect 重定向时，登录自动重定向到该地址
  const redirect = decodeURIComponent(from.query.redirect || to.path)
  if (getToken()) {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      if (store.getters.name) {
        next()
      } else {
        try {
          await store.dispatch('user/getInfo')
          console.log(localStorage.getItem('systemId'))
          const accessRoutes = await store.dispatch('GenerateRoutes', localStorage.getItem('systemId'))
          router.addRoutes(accessRoutes)
          // console.log(accessRoutes)
          if (to.path === redirect) {
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({ ...to, replace: true })
          } else {
            // 跳转到目的路由
            next({ path: redirect })
          }
        } catch {
          console.log('router.beforeEach() error: ')
          NProgress.done()
        }
      }
    }
  } else {
    // 无 token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/login' })
      window.localStorage.clear()
      window.sessionStorage.clear()
      removeToken()
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
