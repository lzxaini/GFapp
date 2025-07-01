/*
 * @Author: 17630921248 1245634367@qq.com
 * @Date: 2025-06-18 17:34:00
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-06-18 17:34:07
 * @FilePath: \medical\utils\mqttReady.js
 * @Description: Fuck Bug
 * 微信：lizx2066
 */
// utils/mqttReady.js
import eventCenter from './eventCenter';
import { mqttClient } from './mqttClient';

export function onMqttReady(cb) {
  if (mqttClient.isConnected()) {
    cb(); // ✅ 立即执行
  } else {
    const onceHandler = () => {
      eventCenter.off('mqtt-ready', onceHandler); // 只触发一次
      cb();
    };
    eventCenter.on('mqtt-ready', onceHandler);
  }
}
