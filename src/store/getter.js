const getters = {
  routes: state => state.permission.routes,
  addroutes: state => state.permission.addroutes,
  token: state => state.user.token,
  name: state => state.user.name,
  id: state => state.user.id,
  menus: state => state.user.menus,
  portrait: state => state.user.portrait
}

export default getters
