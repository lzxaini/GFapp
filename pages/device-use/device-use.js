import Message from 'tdesign-miniprogram/message/index';
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
    wx.eventCenter.on('mqtt-message', this.handleMsg);
  },
  onUnload() {
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
  },
  // 收到消息
  handleMsg({ topic, message }) {
    console.log('设备列表收到消息：', topic, message);
    let { msg, result } = message
    if (topic === `/resp/${this.data.deviceId}` && (result.funcCode === 5 && result.state === 2 || msg === '100000FF')) {
      Message.success({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '您已结束本次服务，感谢您的使用！',
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/device-list/device-list',
        })
      }, 1500);
    }
  },
  exitDevice() {
    const mqttQrotocol = app.globalData.mqttQrotocol;
    mqttQrotocol.controlDevice(`/req/${this.data.deviceId}`, false, 255);
  }
})