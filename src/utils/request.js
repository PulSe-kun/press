/** **   request.js   ****/
// 导入axios
import axios from 'axios'
// 使用antdesign Message做消息提醒
import { message } from 'ant-design-vue'
import { getToken } from '@/utils/auth'
import store from '@/store'
import router from '@/router/index'
// 1. 创建新的axios实例，
const service = axios.create({
  // 公共接口--这里注意后面会讲
  baseURL: process.env.BASE_API,
  // 超时时间 单位是ms
  timeout: 8 * 1000
})
// 2.请求拦截器
service.interceptors.request.use(
  config => {
    const token = getToken()
    // console.log(token)
    if (token) {
      // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
      config.headers.Authorization = token
    } else {
      // 增加客户端认证
      config.headers.Authorization = 'Basic YXBwOmFwcA=='
    }
    // if (token) {
    //     config.params = { 'token': token } //如果要求携带在参数中
    //     config.headers.token = token; //如果要求携带在请求头中
    // }
    return config
  },
  error => {
    Promise.reject(error)
  }
)
// 3.响应拦截器
service.interceptors.response.use(
  response => {
    if (response.data.status === 301) {
      message.error(response.data.message)
    } else {
      return response.data
    }
  },
  error => {
    // console.log(error.response, error.message)
    // /***** 接收到异常响应的处理开始 *****/
    if (error && error.response) {
      // 1.公共错误处理
      // 2.根据响应码具体处理
      switch (error.response.status) {
        case 400:
          error.message = '错误请求'
          break
        case 401:
          error.message = '未授权，请重新登录'
          store.dispatch('user/logout').then(() => {
            // location.href = '/login'
            router.push('/login')
          })
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求错误,未找到该资源'
          break
        case 405:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器端出错'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `连接错误${error.response.status}`
      }
    } else {
      // 超时处理
      if (JSON.stringify(error).includes('timeout')) {
        message.error('服务器响应超时，请刷新当前页')
      }
      error.message = '连接服务器失败'
    }
    message.error(error.message)
    /** *** 处理结束 *****/
    // 如果不需要错误处理，以上的处理过程都可省略
    return error.response
  }
)
// 4.导入文件
export default service
