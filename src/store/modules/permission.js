import { routes } from '@/router'
import Layout from '@/layouts/index.vue'
import { getUserPermission } from '@/services/api_user'
// function getAllTreeList(list) {
//   list.map(item => {
//     if (item.leaf) {
//       item.component = 'layout'
//       item.children = item.children.map(sub => ({
//         ...sub,
//         menuIcon: require('../../assets/icon/' + item.menuIcon + '.png'),
//         menuIconSelect: require('../../assets/icon_select/' + item.menuIconSelect + '.png')
//       }))

//       // [
//       //   {
//       //     children: [],
//       //     name: item.name,
//       //     path: item.path,
//       //     filePath: item.filePath,
//       //     menuIcon: require('../../assets/icon/' + item.menuIcon + '.png'),
//       //     menuIconSelect: require('../../assets/icon_select/' + item.menuIconSelect + '.png'),
//       //     hidden: false,
//       //     meta: {
//       //       title: item.meta.title
//       //     },
//       //     component: ''
//       //   }
//       // ]
//     } else {
//       // item.menuIcon = require('../../assets/icon/' + item.menuIcon + '.png')
//       // item.menuIconSelect = require('../../assets/icon_select/' + item.menuIconSelect + '.png')
//     }
//   })
// }
function getAllTreeList(list) {
  list.map(item => {
    if (item.leaf) {
      item.component = 'layout'
      item.children = [
        {
          children: [],
          name: item.name,
          path: item.path,
          filePath: item.filePath,
          menuIcon: require('../../assets/icon/' + item.menuIcon + '.png'),
          menuIconSelect: require('../../assets/icon_select/' + item.menuIconSelect + '.png'),
          hidden: false,
          meta: {
            title: item.meta.title
          },
          component: ''
        }
      ]
    } else {
      item.menuIcon = require('../../assets/icon/' + item.menuIcon + '.png')
      item.menuIconSelect = require('../../assets/icon_select/' + item.menuIconSelect + '.png')
    }
  })
}
const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, route) => {
      state.addroutes = route
      state.routes = route.concat(routes)
    },
    RESET_ROUTES(state, route) {
      state.addroutes = []
      state.routes = []
    }
  },
  actions: {
    GenerateRoutes({ commit }, id) {
      return new Promise(resolve => {
        getUserPermission().then(res => {
          console.log(res)
          let router_data = []
          for (let i = 0; i < res.data.menuTree.length; i++) {
            if (id === res.data.menuTree[i].id) {
              if (res.data.menuTree[i].parentId === 'root') {
                router_data = res.data.menuTree[i].children
                getAllTreeList(router_data)
              }
            }
          }

          router_data.push(
            {
              name: '403',
              path: '/403',
              hidden: true, // 代表着不在菜单栏展示
              component: () => import('@/pages/exception/403.vue')
            },
            {
              name: '404',
              path: '/404',
              hidden: true, // 代表着不在菜单栏展示
              component: () => import('@/pages/exception/404.vue')
            },
            {
              name: '500',
              path: '/500',
              hidden: true, // 代表着不在菜单栏展示
              component: () => import('@/pages/exception/500.vue')
            },
            {
              path: '*',
              redirect: '/404',
              hidden: true // 代表着不在菜单栏展示
            }
          )
          const accessedRoutes = filterAsyncRouter(router_data)
          console.log(accessedRoutes)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
        /*  const router_data = [
          {
            children: [
              {
                children: [],
                name: '首页',
                path: '/home',
                filePath: '/home',
                hidden: true,
                meta: {
                  title: '首页'
                },
                component: ''
              }
            ],
            path: '/',
            // leaf: true,
            filePath: '/home',
            redirect: '/home',
            meta: {
              title: '生产管理'
            },
            hidden: false,
            component: 'layout'
          },
          {
            children: [
              {
                children: [],
                component: '',
                filePath: '/production-management/production-kanban',
                hidden: false,
                meta: { title: '生产看板' },
                name: 'production-kanban',
                path: '/production-management/production-kanban'
              },
              {
                children: [],
                component: '',
                filePath: '/production-management/production-query',
                hidden: false,
                meta: { title: '生产查询' },
                name: 'production-query',
                path: '/production-management/production-query'
              }
            ],
            name: 'production-management',
            path: '/production-management',
            filePath: '/production-management',
            hidden: false,
            leaf: false,
            meta: {
              title: '生产管理'
            },
            component: 'layout'
          },
          {
            children: [
              {
                children: [],
                component: '',
                filePath: '/user-management/organization-management',
                hidden: false,
                meta: { title: '组织管理' },
                name: 'organization-management',
                path: '/user-management/organization-management'
              },
              {
                children: [],
                component: '',
                filePath: '/user-management/personnel-management',
                hidden: false,
                meta: { title: '人员管理' },
                name: 'personnel-management',
                path: '/user-management/personnel-management'
              },
              {
                children: [],
                component: '',
                filePath: '/user-management/role-management',
                hidden: false,
                meta: { title: '角色管理' },
                name: 'role-management',
                path: '/user-management/role-management'
              }
            ],
            name: 'user-management',
            path: '/user-management',
            filePath: '/user-management',
            hidden: false,
            leaf: false,
            meta: {
              title: '用户管理'
            },
            component: 'layout'
          },
          {
            children: [
              {
                children: [],
                component: '',
                filePath: '/system-monitoring/operation-log',
                hidden: false,
                meta: { title: '操作日志' },
                name: 'operation-log',
                path: '/system-monitoring/operation-log'
              }
            ],
            name: 'system-monitoring',
            path: '/system-monitoring',
            filePath: '/system-monitoring',
            hidden: false,
            leaf: false,
            meta: {
              title: '系统监控'
            },
            component: 'layout'
          },
          {
            children: [
              {
                children: [],
                component: '',
                filePath: '/system-settings/menu-management',
                hidden: false,
                meta: { title: '菜单管理' },
                name: 'menu-management',
                path: '/system-settings/menu-management'
              }
            ],
            name: 'system-settings',
            path: '/system-settings',
            filePath: '/system-settings',
            hidden: false,
            leaf: false,
            meta: {
              title: '系统设置'
            },
            component: 'layout'
          }
        ] */
        // const accessedRoutes = filterAsyncRouter(router_data)
        // console.log(accessedRoutes)
        // commit('SET_ROUTES', accessedRoutes)
        // resolve(accessedRoutes)
      })
    }
  }
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  // console.log(asyncRouterMap)
  return asyncRouterMap.filter(route => {
    // Layout组件特殊处理
    if (route.component === 'layout') {
      route.component = Layout
    } else {
      if (route.path !== '/404' && route.path !== '/403' && route.path !== '/500' && route.path !== '*') {
        route.component = loadView(route.filePath)
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
  return resolve => require([`@/pages${view}` + '/index.vue'], resolve)
}
export default permission
