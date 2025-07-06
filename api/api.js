/*
 * @Author: lzx
 * @Date: 2024-01-01 13:42:13
 * @LastEditors: lzxaini 1245634367@qq.com
 * @LastEditTime: 2025-07-06 13:33:53
 * @Description: Fuck Bug
 * @FilePath: \GFapp\api\api.js
 */
import request from "./request.js"

/**
 * code获取微信accessToken
 * @param {*} params 
 */
export function getWechatUserInfoFun(params) {
  return request({
    url: "/oa/wechat/getWechatUserInfo",
    method: 'post',
    data: params,
  })
}
/**
 * 手机号获取验证码
 * @param {*} params 
 */
export function getPhoneMessageCodeFun(params) {
  return request({
    url: "/sendMessageCode",
    method: 'post',
    data: params,
  })
}
/**
 * 短信验证码登录
 * @param {*} params 
 */
export function goPhoneLoginFun(params) {
  return request({
    url: "/messageCodeCheckLogin",
    method: 'post',
    data: params,
  })
}
/**
 * 短信验证码-修改密码
 * @param {*} params 
 */
export function resetPasswordFun(params) {
  return request({
    url: "/messageCodeModifyPassword",
    method: 'post',
    data: params,
  })
}
/**
 * 用户账号密码登录
 * @param {*} params 
 */
export function userLoginApi(params) {
  return request({
    url: "/login",
    method: 'post',
    data: params,
  })
}
/**
 * 获取用户信息
 * @param {*} params 
 */
export function getUserInfoApi() {
  return request({
    url: "/getInfo",
    method: 'get',
  })
}
/**
 * 修改密码
 * @param {*} params 
 */
export function resetPasswordApi(oldPwd, newPwd) {
  return request({
    url: `/system/user/profile/updatePwd?oldPassword=${oldPwd}&newPassword=${newPwd}`,
    method: 'put',
  })
}
/**
 * 获取验证码
 */
export function getCaptchaImageApi() {
  return request({
    url: "/captchaImage",
    method: 'get',
  })
}