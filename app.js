// app.js
import { mqttClient } from './utils/mqttClient'
import eventCenter from './utils/eventCenter';
import { ProtocolHelper } from './utils/mqttProtocol';
import { Buffer } from 'buffer';
App({
  onLaunch() {
    this.eventCenter = eventCenter;
    wx.eventCenter = eventCenter; // 挂载到 wx 上
    this.getAliPHFont()
    this.getSystemInfo()
    // this.verifyUserLogin()
  },
  globalData: {
    mqttClient: null,
    mqttQrotocol: null,
    statusBarHeight: 0,
    capsuleHeight: 0,
    marginBottom: '60rpx',
    // baseUrl: 'https://oa.beasun.com:2443/prod-api',
    // baseUrl: 'http://192.168.18.150:8080',
    baseUrl: 'https://api.fxnws.com',
    ossUrl: 'https://api.fxnws.com',
    mqttUrl: 'wxs://mqtt.fxnws.com/mqtt',
    // mqttUrl: 'wxs://mqtt.beasun.com/mqtt',
    userInfo: null,
    token: null
  },
  // 获取状态栏
  getSystemInfo() {
    const menu = wx.getMenuButtonBoundingClientRect();
    const windowInfo = wx.getWindowInfo()
    const screenHeight = windowInfo.screenHeight;
    const safeBottom = screenHeight - windowInfo.safeArea.bottom;
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
      this.globalData.userInfo = JSON.parse(userInfo);
      this.globalData.token = token;
      this.initMqtt(); // 登录状态下自动连接 MQTT
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
    // else {
    //   console.log('未登录，需引导用户登录');
    //   wx.reLaunch({
    //     url: '/pages/login/login'
    //   });
    // }
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
            this.globalData.mqttQrotocol = new ProtocolHelper(this.globalData.mqttClient);
            console.log('MQTT 连接成功');
            eventCenter.emit('mqtt-ready')
          },
          onMessage: (topic, message) => {
            const result = this.globalData.mqttQrotocol.parse(message);
            console.log('解析结果:', result);
            // wx.eventCenter.emit('mqtt-message', result);
            eventCenter.emit('mqtt-message', { topic, message: { result, msg: message } });
          },
        }
      );

      // 绑定到 App 全局
      this.globalData.mqttClient = mqttClient;
    }
  },
  /**
   * 获取用户信息
   * @param {*} getUserInfoApi 接口请求
   */
  getUserInfo(getUserInfoApi) {
    return new Promise((resolve, reject) => {
      getUserInfoApi().then(res => {
        if (res.code == 200) {
          // 缓存用户信息
          wx.setStorageSync('userInfo', JSON.stringify(res.user));
          this.globalData.userInfo = res.user
          resolve(res.user)
        } else {
          console.log('错误：', res)
          wx.showToast({
            title: '系统错误',
            icon: 'error',
            duration: 1500,
            mask: true,
          });
          reject(false)
        }
      }).catch(err => {
        console.log('错误：', err)
        wx.showToast({
          title: '系统错误',
          icon: 'error',
          duration: 1500,
          mask: true,
        });
        reject(false)
      })
    })
  },
  // 获取字体
  getAliPHFont() {
    wx.loadFontFace({
      global: true,
      family: 'AlibabaPuHuiTi3',
      source: 'url("https://cdn.fxnws.com/fonts/AlibabaPuHuiTi-3-45-Light.ttf")',
      scopes: ["webview", "native"],
      success: console.log('字体加载完成')
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
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/login/login',
      });
    }, 800);
  }
})