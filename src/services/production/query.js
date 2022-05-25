import request from '@/utils/request'
// 分页查询任务信息
function getList(data) {
  return request({
    url: '/api/product-task/getList',
    method: 'post',
    data
  })
}
// 根据任务Id查询故障信息
function getListForTaskId(data) {
  return request({
    url: '/api/product-task-fault/getListForTaskId',
    method: 'post',
    data
  })
}
// 根据任务查询压力值
function getListPressure(data) {
  return request({
    url: '/api/product-task-item/getList',
    method: 'post',
    data
  })
}

export { getList, getListForTaskId, getListPressure }
