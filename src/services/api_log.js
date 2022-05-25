import http from '../utils/http'
const resquest = '/api'
/** 系统监控 */

/**
 *
 *获取操作日志
 * @export
 * @return {*}
 */
export function getlog(params) {
  return http.get(`${resquest}/admin/syslog`, params)
}
export function getauth() {
  return http.get(`${resquest}/admin/refresh/role/auth`)
}
export function getUserId() {
  return http.get(`${resquest}/admin/baseUsers/list`)
}
