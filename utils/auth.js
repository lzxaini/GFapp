/*
 * @Author: 17630921248 1245634367@qq.com
 * @Date: 2025-07-10 11:40:48
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-07-17 11:02:20
 * @FilePath: \medical\utils\auth.js
 * @Description: Fuck Bug
 * 微信：lizx2066
 */
export function withLogin(ctx, fn) {
  const app = getApp();
  return function (...args) {
    if (!app.globalData.token) {
      ctx.setData({ isLogin: true });
      return;
    }
    return fn.apply(ctx, args);
  };
}
