import axios from 'axios'
import get from 'lodash/get'

// 创建axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 10000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  const status = get(error, 'response.status')
  switch (status) {
    case 400: error.message = '请求错误'; break
    case 401: error.message = '未授权，请登陆'; break
    case 403: error.message = '拒绝访问'; break
    case 404: error.message = `请求地址出错：${error.response.config.url}`; break
    case 408: error.message = '请求超时'; break
    case 500: error.message = '服务器内部错误'; break
    case 501: error.message = '服务未实现'; break
    case 502: error.message = '网关错误'; break
    case 503: error.message = '服务不可用'; break
    case 504: error.message = '网关超时'; break
    case 505: error.message = 'HTTP版本不受支持'; break
    default: break
  }
  return Promise.reject(error)
}
// 请求拦截器 添加token
request.interceptors.request.use((config) => {
  // 如果token 存在，根据实际情况 获取或者设置 请求header
  config.headers.Authorization = `token`
})

// 响应拦截器
request.interceptors.response.use((response) => {
  const dataAxios = response.data
  // 状态码 与后端约定
  const { code } = dataAxios
  // 根据状态码来进行判断
  if (code === undefined) {
    // 如果没有 code 代表不是后端开发接口
    return dataAxios
  } else {
    switch (code) {
      case 'xxx':
        console.log('根据状态码执行不同的操作')
        break
      default:
        console.log('默认操作')
        break
    }
  }
}, errorHandler)

export default request
