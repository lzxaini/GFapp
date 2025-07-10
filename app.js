// app.js
import { mqttClient } from './utils/mqttClient'
import eventCenter from './utils/eventCenter';
App({
  onLaunch() {
    this.eventCenter = eventCenter;
    wx.eventCenter = eventCenter; // 挂载到 wx 上
    this.getSystemInfo()
    // this.verifyUserLogin()
  },
  globalData: {
    mqttClient: null,
    statusBarHeight: 0,
    capsuleHeight: 0,
    marginBottom: '60rpx',
    // baseUrl: 'https://oa.beasun.com:2443/prod-api',
    baseUrl: 'http://127.0.0.1:8080',
    ossUrl: 'https://oa.beasun.com:3443',
    mqttUrl: 'wxs://mqtt.fxnws.com:8084/mqtt',
    userInfo: null,
    token: null
  },
  // 获取状态栏
  getSystemInfo() {
    const res = wx.getSystemInfoSync();
    const screenHeight = res.screenHeight;
    const safeBottom = screenHeight - res.safeArea.bottom;
    const menu = wx.getMenuButtonBoundingClientRect();
    const windowInfo = wx.getWindowInfo()
    this.globalData.statusBarHeight = windowInfo.statusBarHeight
    this.globalData.capsuleHeight = menu.top + menu.height
    if (safeBottom) {
      this.globalData.marginBottom = '60rpx'
    } else {
      this.globalData.marginBottom = '120rpx'

    }
    console.log('状态栏和胶囊高度：', menu, this.globalData.statusBarHeight, this.globalData.capsuleHeight);
  },
  // 如果有手机号缓存去往首页
  verifyUserLogin() {
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
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  /**
   * 获取用户信息
   * @param {*} getUserInfoApi 接口请求
   */
  getUserInfo(getUserInfoApi) {
    getUserInfoApi().then(res => {
      if (res.code == 200) {
        // 缓存用户信息
        wx.setStorageSync('userInfo', res.user);
        this.globalData.userInfo = res.user
      } else {
        console.log('错误：', res)
        wx.showToast({
          title: '系统错误',
          icon: 'error',
          duration: 1500,
          mask: true,
        });
      }
    }).catch(err => {
      console.log('错误：', err)
      wx.showToast({
        title: '系统错误',
        icon: 'error',
        duration: 1500,
        mask: true,
      });
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
  }
})