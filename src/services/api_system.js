/**
 * 系统设置
 */
import http from '../utils/http'
const resquest = '/api'

/**
 *
 *获取数据字典
 * @export
 * @return {*}
 */
export function getSysDictTypes() {
  return http.get(`${resquest}/admin/sysDictTypes/tree`)
}
/**
 *
 *分页获取数据字典的数据
 * @export
 * @param {*} params
 * @return {*}
 */
export function getSysDictValues(params) {
  return http.get(`${resquest}/admin/sysDictValues`, params)
}
/**
 *
 *获取数据字典的列表
 * @export
 * @param {*} id
 * @param {*} params
 * @return {*}
 */
export function getSysMenus(id, params) {
  return http.get(`${resquest}/admin/sysMenus/${id}`, params)
}
/**
 *
 *获取 根节点菜单树
 * @export
 * @return {*}
 */
export function getroot() {
  return http.get(`${resquest}/admin/sysMenus/root`)
}

/**
 *
 *根据指定根节点获取树
 * @export
 * @return {*}
 */
export function getrootTree(id) {
  return http.get(`${resquest}/admin/sysMenus/tree/${id}`)
}

/**
 *
 *获取所有树
 * @export
 * @return {*}
 */
export function getrootAllTree() {
  return http.get(`${resquest}/admin/sysMenus/tree`)
}
/**
 *
 *新增菜单
 * @export
 * @param {*} params
 * @return {*}
 */
export function saveSysMenus(params) {
  return http.post(`${resquest}/admin/sysMenus`, params)
}
/**
 *查询当前菜单的数据
 *
 * @export
 * @param {*} id
 * @return {*}
 */
export function inquerySysMenus(id) {
  return http.get(`${resquest}/admin/sysMenus/${id}`)
}
export function compileSysMenus(id, params) {
  return http.put(`${resquest}/admin/sysMenus/${id}`, params)
}
/**
 *
 *删除菜单
 * @export
 * @param {*} id
 * @return {*}
 */
export function deleteSysMenus(id) {
  return http.delete(`${resquest}/admin/sysMenus/${id}`)
}
/**
 *
 *查询系统配置信息
 * @export
 * @param {*} id
 * @return {*}
 */
export function inquerySysconf(id) {
  return http.get(`${resquest}/admin/sysconf/vo`)
}
/**
 *
 *更新系统配置信息
 * @export
 * @param {*} params
 * @return {*}
 */
export function update_check(params) {
  return http.put(`${resquest}/admin/sysconf/update_check`, params)
}

/** 新增数据字典类型 */
export function saveSysDictTypes(params) {
  return http.post(`${resquest}/admin/sysDictTypes`, params)
}
/**
 *查询数据字典单个对象
 *
 * @export
 * @param {*} id
 * @return {*}
 */
export function inquerySysDictTypes(id) {
  return http.get(`${resquest}/admin/sysDictTypes/${id}`)
}
/**
 *
 *更新数据字典
 * @export
 * @param {*} id
 * @param {*} params
 * @return {*}
 */
export function compileSysDictTypes(id, params) {
  return http.put(`${resquest}/admin/sysDictTypes/${id}`, params)
}
/**
 *删除字典类型
 *
 * @export
 * @param {*} id
 * @return {*}
 */
export function deleteSysDictTypes(id) {
  return http.delete(`${resquest}/admin/sysDictTypes/${id}`)
}
/**
 *
 *新增数据字典选项
 * @export
 * @param {*} params
 * @return {*}
 */
export function saveSysDictValues(params) {
  return http.post(`${resquest}/admin/sysDictValues`, params)
}
/**
 *编辑数据字典选项
 *
 * @export
 * @param {*} id
 * @param {*} params
 * @return {*}
 */
export function compileSysDictValues(id, params) {
  return http.put(`${resquest}/admin/sysDictValues/${id}`, params)
}
/**
 *删除数据字典选项
 *
 * @export
 * @param {*} id
 * @return {*}
 */
export function deleteSysDictValues(id) {
  return http.delete(`${resquest}/admin/sysDictValues/${id}`)
}
/**
 *刷新角色权限缓存
 *
 * @export
 * @param {*}
 * @return {*}
 */
export function refresh() {
  return http.get(`${resquest}/admin/sysRoles/refresh/role/auth`)
}
/**
 * 编号替换规则
 * @returns
 */
export function getListByQuery(params) {
  return http.post(`${resquest}/mes/codeChange/getListByQuery`, params)
}
