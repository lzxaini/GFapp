/*
 * @Author: 17630921248 1245634367@qq.com
 * @Date: 2025-07-15 17:27:59
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-09-06 09:42:27
 * @FilePath: \medical\utils\config.js
 * @Description: Fuck Bug
 * 微信：lizx2066
 */
// 获取服务
const getServiceNameByCode = (code) => {
  const map = [
    { code: '1', name: '脸部护理' },
    { code: '2', name: '身体护理' },
    { code: '3', name: '眼部方案' },
    { code: '4', name: '激活导入' },
    { code: '5', name: '水滴渗透' },
  ]
  const found = map.find(item => item.code == code)
  return found ? { name: found.name, code: found.code } : ''
}
// 获取白名单使用频率
const getFrequencyNameByCode = (code) => {
  const map = [
    { code: '1', name: '今天' },
    { code: '2', name: '每天' },
    { code: '3', name: '每周' },
    { code: '4', name: '每月' },
    { code: '5', name: '每年' },
  ]
  const found = map.find(item => item.code == code)
  return found ? found.name : ''
}
// 获取白名单使用状态
const getWhiteStatusIconByCode = (code) => {
  const map = [
    { code: '0', icon: 'use_no.png' },
    { code: '1', icon: 'use_ok.png' },
    { code: '2', icon: 'expire.png' },
  ]
  const found = map.find(item => item.code == code)
  return found ? found.icon : ''
}
// 获取设备服务记录使用状态
const getDeviceStatusIconByCode = (code) => {
  const map = [
    { code: '0', icon: 'use_no.png' },
    { code: '1', icon: 'use_ing.png' },
    { code: '2', icon: 'use_success.png' },
  ]
  const found = map.find(item => item.code == code)
  return found ? found.icon : ''
}

module.exports = {
  getServiceNameByCode,
  getFrequencyNameByCode,
  getWhiteStatusIconByCode,
  getDeviceStatusIconByCode
}