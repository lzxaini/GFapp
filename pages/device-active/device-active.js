import { onMqttReady } from '../../utils/mqttReady';
const app = getApp();

Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    deviceFlag: false,
    deviceId: '',

    // === 全局重连配置 ===
    reconnectInterval: 3000, // 重试间隔（单位：ms）
    reconnectMaxCount: 20, // 最多重试次数

    reconnectCount: 0, // 当前重试次数
    reconnectTimer: null, // 定时器引用
  },
  onLoad(option) {
    const { deviceId } = option;
    this.setData({ deviceId }, () => {
      this.connectDevice();
    });
    onMqttReady(() => {
      this.subscribeTopic();
    });
    wx.eventCenter.on('mqtt-message', this.handleMsg);
  },
  onUnload() {
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
    this.clearReconnect();
  },
  subscribeTopic() {
    const mqttClient = app.globalData.mqttClient;
    if (mqttClient?.isConnected()) {
      mqttClient.subscribe(`/resp/${this.data.deviceId}`);
    } else {
      console.warn('MQTT 未连接或还未初始化');
    }
  },
  // === 接收消息 ===
  handleMsg({ topic, message }) {
    console.log('设备列表收到消息：', topic, message);
    const { msg, result } = message;
    if (topic === `/resp/${this.data.deviceId}` && msg === '06000001') {
      this.setData({ deviceFlag: true });
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
    const { reconnectInterval, reconnectMaxCount, deviceId } = this.data;
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
