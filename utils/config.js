/*
 * @Author: 17630921248 1245634367@qq.com
 * @Date: 2025-07-15 17:27:59
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-07-15 17:33:50
 * @FilePath: \medical\utils\config.js
 * @Description: Fuck Bug
 * 微信：lizx2066
 */
/*函数防抖*/
const getServiceNameByCode = (code) => {
  const map = [
    { code: '1', name: '脸部护理' },
    { code: '2', name: '身体护理' },
  ]
  const found = map.find(item => item.code === code)
  return found ? found.name : ''
}

module.exports = {
  getServiceNameByCode
}