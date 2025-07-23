/*
 * @Author: 17630921248 1245634367@qq.com
 * @Date: 2025-06-17 11:18:48
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-07-23 15:58:54
 * @FilePath: \medical\utils\tools.js
 * @Description: Fuck Bug
 * 微信：lizx2066
 */

const Toast = (message, theme = 'loading') => {
  Toast({
    context: this,
    selector: '#t-toast',
    direction: 'column',
    preventScrollThrough: true,
    message,
    theme,
  });
}

/**
 * 深浅拷贝
 * @param {} obj 
 * @returns 
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  let clone = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }

  return clone;
}

/**
 * 校验密码
 * @param {*} password 
 */
const verifyPassword = (password) => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,12}$/;;
  if (passwordRegex.test(password)) {
    return true
  } else {
    return false
  }
}

// 工具函数：将 hex 转 rgba（例如 #ff0000 -> rgba(255, 0, 0, 0.1)）
const hexToRgba = (hex, alpha = 0.1) => {
  let r = 0, g = 0, b = 0;
  // 去掉 #
  hex = hex.replace('#', '');

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/*函数节流*/
const throttle = (fn, interval) => {
  let enterTime = 0; // 触发的时间
  let gapTime = interval || 500; // 间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date(); // 第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; // 赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
const debounce = (fn, interval) => {
  let timer;
  let gapTime = interval || 500; // 间隔时间，如果interval不传，则默认500ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments; // 保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}
// 防抖
// test1: tool.debounce(function () {
//   console.log('防抖')
// }, 5000)
// 节流
// test2: tool.throttle(function () {
//   console.log('节流')
// }, 5000)
module.exports = {
  Toast,
  verifyPassword,
  deepClone,
  throttle,
  debounce,
  hexToRgba
}