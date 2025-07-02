const app = getApp()
const dayjs = require('dayjs')
import {
  addVisitorApi
} from '../../api/api.js'
import { onMqttReady } from '../../utils/mqttReady';
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
  },
  onLoad() {
    onMqttReady(() => {
      this.subscribeTopic();
    });
    wx.eventCenter.on('mqtt-message', this.handleMsg);
  },
  onUnload() {
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
  },
  // 订阅
  subscribeTopic() {
    const mqttClient = app.globalData.mqttClient;
    console.log("🥵 ~ onShow ~ mqttClient: ", mqttClient)

    if (mqttClient?.isConnected()) {
      mqttClient.publish(`resp/861556077047305`, '小程序发');
      mqttClient.subscribe(`req/861556077047305`);
    } else {
      console.warn('MQTT 未连接或还未初始化');
    }
  },
  // 收到消息
  handleMsg({ topic, message }) {
    console.log('📩 收到 MQTT 消息', topic, message);
  },
  goWorkTeam() {
    wx.navigateTo({
      url: '/pages/work-team/work-team'
    });
  },
  goRechargeHistory() {
    wx.navigateTo({
      url: '/pages/recharge-history/recharge-history'
    });
  }
})