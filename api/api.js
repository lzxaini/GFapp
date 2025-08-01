/*
 * @Author: lzx
 * @Date: 2024-01-01 13:42:13
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-07-31 16:44:33
 * @Description: Fuck Bug
 * @FilePath: \medical\api\api.js
 */
import request from "./request.js"

/**
 * 微信登录
 * @param {*} params 
 */
export function getWechatUserInfoApi(params) {
  return request({
    url: "/wechat/getWechatUserInfo",
    method: 'post',
    data: params,
  })
}
/**
 * 注册用户
 * @param {*} params 
 */
export function registerUserInfoApi(params) {
  return request({
    url: "/system/user/profile",
    method: 'PUT',
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
export function getDeviceListApi(data) {
  return request({
    url: "/gf/device/list",
    method: 'get',
    data
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
/**
 * 查询充值记录
 */
export function getRechargeRecordsApi(data) {
  return request({
    url: `/gf/rechargeRecords/list`,
    method: 'get',
    data
  })
}
/**
 * 查询服务记录
 */
export function getServiceRecordsApi(data) {
  return request({
    url: `/gf/serviceRecords/list`,
    method: 'get',
    data
  })
}
/**
 * 查询白名单
 */
export function getWhitelistApi(data) {
  return request({
    url: `/gf/whitelist/list`,
    method: 'get',
    data
  })
}
/**
 * 管理员团队
 */
export function getAdminTeamListApi() {
  return request({
    url: `/system/dept/map`,
    method: 'get'
  })
}
/**
 * 管理员团队下钻
 */
export function getAdminTeamListDrillDownApi(deptId) {
  return request({
    url: `/system/dept/map/${deptId}`,
    method: 'get'
  })
}
/**
 * 管理员设备列表
 */
export function getAdminDeviceListApi(data) {
  return request({
    url: `/gf/device/dept`,
    method: 'get',
    data
  })
}
/**
 * 修改团队
 */
export function changeTeamInfoApi(data) {
  return request({
    url: `/gf/teams`,
    method: 'put',
    data
  })
}
/**
 * 扫码查询用户信息
 */
export function getUserInfoQrCodeApi(userId) {
  return request({
    url: `/system/user/info/${userId}`,
    method: 'get',
  })
}

/**
 * 白名单设置
 */
export function addwhiteListApi(data) {
  return request({
    url: `/gf/whitelist`,
    method: 'post',
    data
  })
}
/**
 * 搜索团队
 */
export function getTeamsInfoListApi(data) {
  return request({
    url: `/gf/teams/list/join`,
    method: 'get',
    data
  })
}
/**
 * 加入团队
 * 参数teamId userId
 */
export function joinTeamApi(data) {
  return request({
    url: `/gf/teamJoinRequests`,
    method: 'post',
    data
  })
}

/**
 * 查询门店下团队
 * 参数deptId
 */
export function getStoresTeamListApi(deptId) {
  return request({
    url: `/gf/teams/list/${deptId}`,
    method: 'get',
  })
}
/**
 * 扫码开始服务
 * 参数serialNumber
 */
export function sanStartDeviceApi(serialNumber) {
  return request({
    url: `/gf/device/service/${serialNumber}`,
    method: 'get',
  })
}
/**
 * 获取运营数据 GET 
 * 参数serialNumber
 */
export function getOperationApi() {
  return request({
    url: `/gf/operation`,
    method: 'get',
  })
}
