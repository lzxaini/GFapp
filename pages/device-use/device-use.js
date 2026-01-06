import {
  onMqttReady
} from '../../utils/mqttReady';
import { showMessage } from '../../utils/tools';
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    deviceFlag: false,
    deviceId: '',
    reconnectInterval: 2000, // 重试间隔（单位：ms）
    reconnectMaxCount: 10, // 最多重试次数
    reconnectCount: 0, // 当前重试次数
    reconnectTimer: null, // 定时器引用
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
    this.clearReconnect(); // 清除重连定时器
    mqttClient.unsubscribe(`/resp/${this.data.deviceId}`);
  },
  subscribeTopic() {
    const mqttClient = app.globalData.mqttClient;
    if (mqttClient?.isConnected()) {
      console.log('订阅', `/resp/${this.data.deviceId}`)
      mqttClient.subscribe(`/resp/${this.data.deviceId}`);
    } else {
      console.warn('MQTT 未连接或还未初始化');
      showMessage('error', '小程序初始化失败，请稍后再试！', 3000, this);
    }
  },
  // 收到消息
  handleMsg({ topic, message }) {
    let _this = this
    console.log('设备列表收到消息：', topic, message);
    let { msg, result } = message
    if (topic === `/resp/${this.data.deviceId}` && (result.funcCode === 5 && result.state === 2 || msg === '100000FF')) {
      this.clearReconnect(); // 停止重连
      wx.hideLoading();
      showMessage('success', '您已结束本次服务，感谢您的使用！', 3000, this);
      setTimeout(() => {
        _this.goPage()
      }, 1500);
    }
  },
  exitDevice() {
    wx.showLoading({
      title: '正在结束服务...',
      mask: true,
    });
    const {
      reconnectInterval,
      reconnectMaxCount,
      deviceId
    } = this.data;
    let _this = this;
    const mqttQrotocol = app.globalData.mqttQrotocol;
    this.clearReconnect(); // 防止多次触发
    const timer = setInterval(() => {
      if (this.data.reconnectCount >= reconnectMaxCount) {
        console.warn('连接超时，已超过最大重试次数');
        this.clearReconnect();
        showMessage('error', '连接超时，停止失败，请稍后再试！', 3000, _this);
        setTimeout(() => {
          _this.goPage()
        }, 2500);
        return;
      }
      console.log(`第 ${this.data.reconnectCount + 1} 次尝试连接设备...`);
      mqttQrotocol.controlDevice(`/req/${deviceId}`, false, 255);
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
  },
  goPage() {
    console.log('自定义返回触发')
    // 获取当前页面栈实例
    let pages = getCurrentPages();
    console.log('页面栈长度:', pages.length)
    if (pages.length <= 1) {
      // 如果只有一个页面，跳转到首页
      console.log('页面栈只有1个，跳转首页')
      wx.reLaunch({
        url: '/pages/my/my',
      })
    } else {
      // 否则直接返回设备列表页
      console.log('返回设备列表页')
      wx.redirectTo({
        url: '/pages/device-list/device-list',
      })
    }
  }
})