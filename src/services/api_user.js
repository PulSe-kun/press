import http from '../utils/http'
const resquest = '/api'
const _resquest = '/api/admin'
/**
 * 登录
 * @param {login} data
 * @returns
 */

export function login(data) {
  const params = new URLSearchParams()
  params.append('username', data.username)
  params.append('password', data.password)
  // params.append('grant_type', data.grant_type)
  return http.post(`${_resquest}/baseUsers/auth`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
/**
 * 登出
 */
export function logout() {
  return http.delete(`${resquest}/auth/token/removeToken`)
}
/**
 *
 *修改密码
 * @export
 * @param {*} params
 * @return {*}
 */
export function modifyPassword(params) {
  return http.put(`${resquest}/admin/baseUsers/password`, params)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.get(`${resquest}/admin/baseUsers/info`)
}

/**
 * 获取用户权限
 */
export function getUserPermission() {
  return http.get(`${resquest}/admin/baseUsers/permission`)
}
/** 组织管理 */

/**
 *
 * 获取组织树 人员树
 * @param {*} params
 * @returns
 */
export function getBaseDepts(params) {
  return http.get(`${resquest}/admin/baseDepts/tree`, params)
}

/** 人员管理 */

/**
 *
 *新增组织树
 * @export
 * @param {*} params
 * @return {*}
 */
export function addBaseDepts(params) {
  return http.post(`${resquest}/admin/baseDepts`, params)
}
/**
 *
 *获取人员信息 指定部门的用户列表
 * @export
 * @param {*} params
 * @return {*}
 */
export function getBaseUsers(id, params) {
  return http.get(`${resquest}/admin/baseUsers/detail_list/${id}`, params)
}
/**
 *
 *查询单个组织的数据
 * @export
 * @param {*} id
 * @return {*}
 */
export function inqueryBaseDepts(id) {
  return http.get(`${resquest}/admin/baseDepts/${id}`)
}
/**
 *
 *
 * @export
 * @param {*} id
 * @return {*}
 */
export function updateBaseDepts(id, params) {
  return http.put(`${resquest}/admin/baseDepts/${id}`, params)
}
/**
 *
 *删除单个组织 当前组织
 * @export
 * @param {*} id
 * @return {*}
 */
export function deleteBaseDepts(id) {
  return http.delete(`${resquest}/admin/baseDepts/${id}`)
}
/**
 *
 *新增人员
 * @export
 * @param {*} params
 * @return {*}
 */
export function addBaseUsers(params) {
  return http.post(`${resquest}/admin/baseUsers/add_user_dept_role`, params)
}
/** 删除人员 */
export function deleteBaseUsers(id) {
  return http.delete(`${resquest}/admin/baseUsers/${id}`)
}
/**
 *
 *重置密码
 * @export
 * @param {*} id
 * @return {*}
 */
export function resetPassword(id) {
  return http.put(`${resquest}/admin/baseUsers/reset/password/${id}`)
}
/**
 *
 *编辑人员管理
 * @export
 * @param {*} id
 * @param {*} params
 * @return {*}
 */
export function updateBaseUsers(id, params) {
  return http.put(`${resquest}/admin/baseUsers/baseuser/update/${id}`, params)
}
/** 角色管理 */
/**
 *
 *获取角色列表
 * @export
 * @param {*} params
 * @return {*}
 */
export function getSysRoles(params) {
  return http.get(`${resquest}/admin/sysRoles`, params)
}
/**
 *新增角色
 *
 * @export
 * @param {*} params
 * @return {*}
 */
export function postSysRoles(params) {
  return http.post(`${resquest}/admin/sysRoles/`, params)
}
/**
 *更新角色
 *
 * @export
 * @param {*} id
 * @param {*} params
 * @return {*}
 */
export function compileSysRoles(id, params) {
  return http.put(`${resquest}/admin/sysRoles/${id}`, params)
}
/**
 *删除角色
 *
 * @export
 * @param {*} id
 * @return {*}
 */
export function deleteSysRoles(id) {
  return http.delete(`${resquest}/admin/sysRoles/${id}`)
}

/**
 *角色授权接口，角色和菜单做关联
 *
 * @export
 * @param {*} id
 * @param {*} params
 * @return {*}
 */
export function postSysRoleAuthorizations(id, params) {
  return http.post(`${resquest}/admin/sysRoleAuthorizations/${id}`, params)
}
/**
 *角色授权接口，角色和组织做关联
 *
 * @export
 * @param {*} id
 * @param {*} params
 * @return {*}
 */
export function postBaseDataAuthorization(id, params) {
  return http.post(`${resquest}/admin/baseDataAuthorization/${id}`, params)
}
/**
 *
 *获取系统列表
 * @export
 * @return {*}
 */
export function getSysMenus() {
  return http.get(`${resquest}/admin/sysMenus/root`)
}
/**
 *根据角色id获取数据权限列表
 *
 * @export
 * @param {*} id
 * @return {*}
 */
export function getBaseDataAuthorization(id) {
  return http.get(`${resquest}/admin/baseDataAuthorization/auth/${id}`)
}
/**
 *获取角色对应的权限集合
 *
 * @export
 * @param {*} id
 * @return {*}
 */
export function getSysRoleAuthorizations(id) {
  return http.get(`${resquest}/admin/sysRoleAuthorizations/${id}/resourceType/0`)
}
/**
 *获取部门用户树
 *
 * @export
 * @return {*}
 */
export function getDeptUserTree() {
  return http.get(`${resquest}/admin/baseDepts/dept_user/tree`)
}
/**
 *保存用户和角色的关联关系
 *
 * @export
 * @param {*} id
 * @param {*} params
 * @return {*}
 */
export function compileSysRolesUserRole(id, params) {
  return http.put(`${resquest}/admin/sysRoles/update/user-role/auth/${id}`, params)
}
/**
 *获取用户和角色的关联关系
 *
 * @export
 * @return {*}
 */
export function getSysRolesUserRole(id) {
  return http.get(`${resquest}/admin/sysRoles/user-role/auth/${id}`)
}

/**
 * 输入已经存在的账号需校验
 * @param {*} code
 * @returns
 */
export function getCode(params) {
  return http.get(`${resquest}/admin/baseUsers/canBuild`, params)
}

/**
 * 组织存在组织或者人员判断 是否 可删除
 * @param {*} id
 * @returns
 */
export function canDelete(id) {
  return http.get(`${resquest}/admin/baseDepts/canDelete?id=${id}`)
}
