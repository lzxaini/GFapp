import Message from 'tdesign-miniprogram/message/index';
import {
  onMqttReady
} from '../../utils/mqttReady';
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    deviceFlag: false,
    deviceId: '',
    duration: 1000 * 10, // 3秒无响应则自动返回首页
  },
  onLoad(option) {
    let { deviceId } = option
    this.setData({ deviceId })
    wx.eventCenter.on('mqtt-message', this.handleMsg);
    onMqttReady(() => {
      this.subscribeTopic();
    });
  },
  onUnload() {
    const mqttClient = app.globalData.mqttClient;
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
    mqttClient.unsubscribe(`/resp/${this.data.deviceId}`);
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
        duration: 3000,
        content: '小程序初始化失败，请稍后再试！',
      });
    }
  },
  // 收到消息
  handleMsg({ topic, message }) {
    console.log('设备列表收到消息：', topic, message);
    let { msg, result } = message
    if (topic === `/resp/${this.data.deviceId}` && (result.funcCode === 5 && result.state === 2 || msg === '100000FF')) {
      if (this.exitTimer) {
        clearTimeout(this.exitTimer);
        this.exitTimer = null;
      }
      wx.hideLoading();
      Message.success({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '您已结束本次服务，感谢您的使用！',
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/development/index/index',
        })
      }, 1500);
    }
  },
  exitDevice() {
    wx.showLoading({
      title: '正在结束服务...',
      mask: true,
    });
    const mqttQrotocol = app.globalData.mqttQrotocol;
    mqttQrotocol.controlDevice(`/req/${this.data.deviceId}`, false, 255);
    // 3秒无响应则自动返回首页
    if (this.exitTimer) {
      clearTimeout(this.exitTimer);
    }
    this.exitTimer = setTimeout(() => {
      wx.hideLoading();
      Message.error({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '设备无响应，将自动返回首页！',
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/development/index/index',
        })
      }, 1500);
    }, this.data.duration);
  },
  goPage() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.reLaunch({ url: '/development/index/index' });
    }
  }
})