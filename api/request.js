/*
 * @Author: lzx
 * @Date: 2023-02-10 13:41:08
 * @LastEditors: lzxaini 1245634367@qq.com
 * @LastEditTime: 2025-07-06 13:03:25
 * @Description: Fuck Bug
 * @FilePath: \GFapp\api\request.js
 */
//导入请求的域名
import { baseURL } from './config.js'
let ignoreUrl = ['getWechatUserInfo','sendMessageCode', 'messageCodeCheckLogin', '/mobileLogin', 'messageCodeModifyPassword'] // 需要忽略的url地址
export default function request(options) {
  const srtUrl = options.url.replace(/\u200B/g, '')
  wx.showLoading({
    title: "请稍候...",
    mask: true //遮蔽层
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL+ srtUrl,
      method: options.method || 'post',
      data: options.data || null,
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': !ignoreUrl.includes(srtUrl) ? 'Bearer ' + wx.getStorageSync('token') || '' : '' // 指定接口无需携带token
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code === 200) {
          // 此处可以根据状态码resolve
          resolve(res.data)
        } else if (res.data.code === 401) {
          wx.showToast({
            title: '登录失效！',
            icon: 'error'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.data.msg || `接口异常${res.data.code}!`,
            icon: 'error'
          })
        }
      },
      fail(err) {
        console.log('网络错误', baseURL + options.url, err)
        let msg = '网络错误,请重试';
        if (err.errno === 5 || err.errMsg.indexOf('time out') != -1) {
          msg = "网络超时,请重试"
        }
        wx.showToast({
          title: msg,
          icon: 'none'
        })
        reject(msg)
      }
    })
  })
}