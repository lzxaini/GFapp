/*
 * @Author: 17630921248 1245634367@qq.com
 * @Date: 2025-06-18 16:59:57
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-06-18 17:00:00
 * @FilePath: \medical\utils\eventCenter.js
 * @Description: Fuck Bug
 * 微信：lizx2066
 */
// utils/eventCenter.js

class EventCenter {
  constructor() {
    this.events = {};
  }

  /**
   * 监听事件
   * @param {string} event 
   * @param {function} handler 
   */
  on(event, handler) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(handler);
  }

  /**
   * 只监听一次
   * @param {string} event 
   * @param {function} handler 
   */
  once(event, handler) {
    const onceHandler = (data) => {
      handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  /**
   * 取消监听
   * @param {string} event 
   * @param {function} handler 
   */
  off(event, handler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(fn => fn !== handler);
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  /**
   * 派发事件
   * @param {string} event 
   * @param {*} data 
   */
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(fn => fn(data));
  }
}

const eventCenter = new EventCenter();

export default eventCenter;
