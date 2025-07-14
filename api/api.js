/*
 * @Author: lzx
 * @Date: 2024-01-01 13:42:13
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-07-14 14:26:22
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
/**
 * 团队管理
 */
export function getTeamsListApi() {
  return request({
    url: "/gf/teams/map",
    method: 'get',
  })
}
/**
 * 我的团队
 */
export function getMyTeamsApi(id) {
  return request({
    url: `/gf/teams/${id}`,
    method: 'get',
  })
}
/**
 * 团队成员
 */
export function getTeamsMemberListApi(query) {
  return request({
    url: "/gf/teamMembers/list",
    method: 'get',
    data: query
  })
}
/**
 * 设备列表
 */
export function getDeviceListApi() {
  return request({
    url: "/gf/device/list",
    method: 'get',
  })
}
/**
 * 设备详情
 */
export function getDeviceInfoApi(serialNumber) {
  return request({
    url: `/gf/device/uid/${serialNumber}`,
    method: 'get',
  })
}
/**
 * 激活设备
 */
export function activetionDeviceApi(serialNumber) {
  return request({
    url: `/gf/teams/check/${serialNumber}`,
    method: 'get',
  })
}
/**
 * 绑定设备
 */
export function deviceBindApi(teamId, serialNumber) {
  return request({
    url: `/gf/teams/bind/${teamId}/${serialNumber}`,
    method: 'get',
  })
}
/**
 * 设备激活数量
 */
export function getDeviceActivatedApi(deptId) {
  return request({
    url: `/gf/device/activated/${deptId}`,
    method: 'get',
  })
}