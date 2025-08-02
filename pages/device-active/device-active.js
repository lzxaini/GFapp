import {
  onMqttReady
} from '../../utils/mqttReady';
import Message from 'tdesign-miniprogram/message/index';
const app = getApp();

Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    deviceFlag: false,
    deviceId: '',
    reconnectInterval: 3000, // 重试间隔（单位：ms）
    reconnectMaxCount: 20, // 最多重试次数
    reconnectCount: 0, // 当前重试次数
    reconnectTimer: null, // 定时器引用
  },
  onLoad(option) {
    const {
      deviceId
    } = option;
    this.setData({
      deviceId
    })
    wx.eventCenter.on('mqtt-message', this.handleMsg);
    onMqttReady(() => {
      this.subscribeTopic();
    });
    setTimeout(() => {
      this.connectDevice();
    }, 1000)
  },
  onUnload() {
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
    this.clearReconnect();
  },
  subscribeTopic() {
    const mqttClient = app.globalData.mqttClient;
    if (mqttClient?.isConnected()) {
      console.log('订阅', `/resp/${this.data.deviceId}`)
      mqttClient.subscribe(`/resp/${this.data.deviceId}`);
    } else {
      console.warn('MQTT 未连接或还未初始化');
      Message.error({
        context: this,
        offset: [90, 32],
        duration: 1500,
        content: '等待设备连接中......',
      });
    }
  },
  // === 接收消息 ===
  handleMsg({
    topic,
    message
  }) {
    console.log('设备列表收到消息：', topic, message);
    const {
      msg,
      result
    } = message;
    if (topic === `/resp/${this.data.deviceId}` && msg === '06000001') {
      this.setData({
        deviceFlag: true
      });
      this.clearReconnect(); // 停止重连
    }
    if (
      topic === `/resp/${this.data.deviceId}` &&
      result?.funcCode === 5 &&
      result?.state === 1
    ) {
      wx.reLaunch({
        url: `/pages/device-use/device-use?deviceId=${this.data.deviceId}`,
      });
    }
  },
  // === 启动扫码连接 + 定时重连逻辑 ===
  connectDevice() {
    const {
      reconnectInterval,
      reconnectMaxCount,
      deviceId
    } = this.data;
    const mqttQrotocol = app.globalData.mqttQrotocol;
    this.clearReconnect(); // 防止多次触发
    const timer = setInterval(() => {
      if (this.data.reconnectCount >= reconnectMaxCount) {
        console.warn('连接超时，已超过最大重试次数');
        this.clearReconnect();
        return;
      }
      console.log(`第 ${this.data.reconnectCount + 1} 次尝试连接设备...`);
      mqttQrotocol.sendScanQrCode(`/req/${deviceId}`);
      this.setData({
        reconnectCount: this.data.reconnectCount + 1
      });
    }, reconnectInterval);
    this.setData({
      reconnectTimer: timer,
      reconnectCount: 0
    });
  },
  // === 清除定时器 ===
  clearReconnect() {
    if (this.data.reconnectTimer) {
      clearInterval(this.data.reconnectTimer);
      this.setData({
        reconnectTimer: null,
        reconnectCount: 0
      });
    }
  }
});