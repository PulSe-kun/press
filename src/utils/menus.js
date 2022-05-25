import Layout from '@/layouts/index.vue'
// 遍历后台传来的路由字符串，转换为组件对象
export default function filterAsyncRouter(asyncRouterMap) {
  // console.log(asyncRouterMap)
  return asyncRouterMap.filter(route => {
    // console.log(route.component)
    // console.log(Layout)
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === '') {
        route.component = loadView(route.filePath)
        // console.log(loadView(route.path))
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

export const loadView = view => {
  // 路由懒加载
  // console.log(view)
  return resolve => require([`@/pages/${view}` + '.vue'], resolve)
}
