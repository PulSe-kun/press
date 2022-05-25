import request from '@/utils/request'

// 今日生产信息(当前批次)
function getRunningTask() {
  return request({
    url: '/api/product-task/getRunningTask'
  })
}

// 15天故障列表
function getListFor15Days() {
  return request({
    url: '/api/product-task-fault/getListFor15Days'
  })
}

// 24小时故障列表
function getListFor24H() {
  return request({
    url: '/api/product-task-fault/getListFor24H'
  })
}

// 最近1小时压机压力
function getItemsFor1HourMinutes(data) {
  return request({
    url: '/api/product-task-item/getItemsFor1HourMinutes',
    method: 'post',
    data
  })
}
export { getRunningTask, getListFor15Days, getListFor24H, getItemsFor1HourMinutes }
