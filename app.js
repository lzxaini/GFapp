// app.js
import { mqttClient } from './utils/mqttClient'
import eventCenter from './utils/eventCenter';
App({
  onLaunch() {
    this.eventCenter = eventCenter;
    wx.eventCenter = eventCenter; // 挂载到 wx 上
    this.getSystemInfo()
    // this.getUserInfo()
  },
  globalData: {
    mqttClient: null,
    statusBarHeight: 0,
    capsuleHeight: 0,
    // baseUrl: 'https://oa.beasun.com:2443/prod-api',
    baseUrl: 'http://192.168.26.5:8888',
    ossUrl: 'https://oa.beasun.com:3443',
    mqttUrl: 'wxs://mqtt.fxnws.com:8084/mqtt',
    userInfo: null,
    token: null
  },
  // 获取状态栏
  getSystemInfo() {
    const menu = wx.getMenuButtonBoundingClientRect();
    const windowInfo = wx.getWindowInfo()
    this.globalData.statusBarHeight = windowInfo.statusBarHeight
    this.globalData.capsuleHeight = menu.top + menu.height
    console.log('状态栏和胶囊高度：', menu, this.globalData.statusBarHeight, this.globalData.capsuleHeight);
  },
  // 如果有手机号缓存去往首页
  getUserInfo() {
    // 读取缓存的登录信息
    const userInfo = wx.getStorageSync('userInfo');
    const token = wx.getStorageSync('token');

    if (userInfo && token) {
      this.globalData.userInfo = userInfo;
      this.globalData.token = token;
      this.initMqtt(userInfo); // 登录状态下自动连接 MQTT
      wx.reLaunch({
        url: '/pages/index/index'
      });
    } else {
      console.log('未登录，需引导用户登录');
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }
  },
  initMqtt() {
    console.log('初始化MQTT')
    if (!this.globalData.mqttClient) {
      mqttClient.init(
        this.globalData.mqttUrl,
        {
          // clientId: `wx_${userInfo.id}_${Date.now()}`,
          clientId: `wx_${Date.now()}`,
          username: 'test',
          password: 'test'
        },
        {
          onConnect: () => {
            console.log('MQTT 连接成功');
            eventCenter.emit('mqtt-ready')
          },
          onMessage: (topic, message) => {
            console.log('消息：', topic, message);
            eventCenter.emit('mqtt-message', { topic, message: message });
          },
        }
      );

      // 绑定到 App 全局
      this.globalData.mqttClient = mqttClient;
    }
    // 缓存手机号
    wx.setStorageSync('userInfo', '11111111');
    wx.setStorageSync('token', '222222');
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  logout() {
    // logout.js
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
    this.globalData.userInfo = null;
    this.globalData.token = null;
    this.globalData.mqttClient?.disconnect?.();
    this.globalData.mqttClient = null
    // app.js
    // if (this.globalData.mqttClient) {
    //   this.globalData.mqttClient.disconnect(); // ✅ 清理旧的 MQTT
    //   this.globalData.mqttClient = null;
    // }
  }
})