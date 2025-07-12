
import { onMqttReady } from '../../utils/mqttReady';
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    deviceFlag: false,
    deviceId: ''
  },
  onLoad(option) {
    let { deviceId } = option
    this.setData({ deviceId })
    this.connectDevice(deviceId)
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
    if (mqttClient?.isConnected()) {
      mqttClient.subscribe(`/resp/${this.data.deviceId}`);
    } else {
      console.warn('MQTT 未连接或还未初始化');
    }
  },
  // 收到消息
  handleMsg({ topic, message }) {
    console.log('设备列表收到消息：', topic, message);
    let { msg, result } = message
    if (topic === `/resp/${this.data.deviceId}` && msg === '06000001') {
      this.setData({ deviceFlag: true })
    }
    if (topic === `/resp/${this.data.deviceId}` && result.funcCode === 5 && result.state === 1) {
      wx.reLaunch({
        url: `/pages/device-use/device-use?deviceId=${this.data.deviceId}`,
      })
    }
  },
  connectDevice(deviceId) {
    const mqttQrotocol = app.globalData.mqttQrotocol;
    mqttQrotocol.sendScanQrCode(`/req/${deviceId}`)
  },
  exitDevice() {

  }
})