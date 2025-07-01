/*
 * @Author: lzx
 * @Date: 2024-01-01 13:42:13
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-06-19 14:23:57
 * @Description: Fuck Bug
 * @FilePath: \medical\api\api.js
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
export function userLoginFun(params) {
  return request({
    url: "/mobileLogin",
    method: 'post',
    data: params,
  })
}
/**
 * 访客列表
 */
export function getVisitorListApi(query) {
  return request({
    url: "/oa/visitor/list",
    method: 'get',
    data: query
  })
}
/**
 * 新增访客
 * @param {*} params 
 */
export function addVisitorApi(params) {
  return request({
    url: "/oa/visitor",
    method: 'post',
    data: params,
  })
}
/**
 * 开门接口
 */
export function openDoorApi(id) {
  return request({
    url: `/oa/visitor/openDoor/${id}`,
    method: 'get',
  })
}
/**
 * 关闭门接口
 */
export function closeDoorApi(id) {
  return request({
    url: `/oa/visitor/closeDoor/${id}`,
    method: 'get',
  })
}