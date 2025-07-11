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
    wx.eventCenter.on('mqtt-message', this.handleMsg);
  },
  onUnload() {
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
  },
  // 收到消息
  handleMsg({ topic, message }) {
    console.log('设备列表收到消息：', topic, message);
    if (topic === `/resp/${this.data.deviceId}` && message === '06000001') {
      this.setData({ deviceFlag: true })
    }
  },
  connectDevice(deviceId) {
    const mqttQrotocol = app.globalData.mqttQrotocol;
    mqttQrotocol.sendScanQrCode(`/req/${deviceId}`)
  },
  exitDevice() {
    
  }
})