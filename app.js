// app.js
import {
  mqttClient
} from './utils/mqttClient'
import eventCenter from './utils/eventCenter';
import {
  ProtocolHelper
} from './utils/mqttProtocol';
import {
  Buffer
} from 'buffer';
App({
  onLaunch() {
    this.eventCenter = eventCenter;
    wx.eventCenter = eventCenter; // 挂载到 wx 上
    this.getAliPHFont()
    this.getSystemInfo()
    this.verifyUserLogin()
    this.getPhoneEnv()
  },
  globalData: {
    devFlag: false, // 开发环境标志
    devUrl: '',
    appName: {
      name: '光馥科美',
      slogan: '光塑年轻力，馥养无龄美',
      appVersion: '0.0.21_25121613',
    },
    phoneEnv: '', // 手机系统
    mqttClient: null,
    mqttQrotocol: null,
    statusBarHeight: 0,
    capsuleHeight: 0,
    marginBottom: '60rpx',
    // baseUrl: 'https://oa.beasun.com:2443/prod-api',
    // baseUrl: 'https://api.gfkm.cc',
    // ossUrl: 'https://api.gfkm.cc',
    baseUrl: 'http://8.138.129.164:22880',
    ossUrl: 'http://8.138.129.164:22880',
    // baseUrl: 'http://192.168.18.150:8080',
    // ossUrl: 'http://192.168.18.150:8080',
    mqttUrl: 'wxs://mqtt.gfkm.cc/mqtt',
    // mqttUrl: 'wxs://gfmq.fxnws.com/mqtt',
    // mqttUrl: 'wxs://8.138.32.44/mqtt',
    // mqttUrl: 'wx://8.153.92.17:8083/mqtt',
    // mqttUrl: 'wxs://mqtt.beasun.com/mqtt',
    userInfo: null,
    token: null
  },
  onShow() {
    // setTimeout(() => {
    //   this.initMqtt();
    // }, 800);
    this.initMqtt();
    // this.authCheck()
  },
  onHide() {
    // 清理 MQTT 连接
    if (this.globalData.mqttClient) {
      this.globalData.mqttClient?.disconnect?.();
      this.globalData.mqttClient = null
    }
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
      let userInfoParse = JSON.parse(userInfo);
      this.globalData.userInfo = userInfoParse
      this.globalData.token = token;
      if (!this.globalData.devFlag) {
        wx.reLaunch({
          url: '/pages/my/my'
        });
      } else {
        wx.reLaunch({
          url: this.globalData.devUrl || '/pages/my/my'
        });
      }
    }
    // else {
    //   console.log('未登录，需引导用户登录');
    //   wx.reLaunch({
    //     url: '/pages/login/login'
    //   });
    // }
  },
  initMqtt() {
    console.log('进入MQTT方法')
    let {
      userInfo
    } = this.globalData
    if (!this.globalData.mqttClient && userInfo) {
      console.log('开始初始化MQTT')
      mqttClient.init(
        this.globalData.mqttUrl, {
          clientId: `wx_${userInfo.userId}_${Date.now()}`,
          // clientId: `wx_${Date.now()}`,
          username: 'WeChat',
          password: 'oP4~hF0]aB7.'
        }, {
          onConnect: () => {
            this.globalData.mqttQrotocol = new ProtocolHelper(this.globalData.mqttClient);
            console.log('MQTT 连接成功');
            eventCenter.emit('mqtt-ready')
          },
          onMessage: (topic, message) => {
            const result = this.globalData.mqttQrotocol.parse(message);
            console.log('解析结果:', result);
            // wx.eventCenter.emit('mqtt-message', result);
            eventCenter.emit('mqtt-message', {
              topic,
              message: {
                result,
                msg: message
              }
            });
          },
        }
      );
      // 绑定到 App 全局
      this.globalData.mqttClient = mqttClient;
      console.log('mqttClient', mqttClient)
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
  },
  // 授权检测
  authCheck() {
    wx.getSetting({
      success: (res) => {
        const needBluetooth = !res.authSetting['scope.bluetooth'];
        const needLocation = !res.authSetting['scope.userLocation'];
        if (!needBluetooth && !needLocation) {
          return;
        }
        this.openAuthCheck();
      }
    })
  },
  // 再次获取授权，引导客户手动授权
  openAuthCheck() {
    wx.showModal({
      content: '检测到您没打开此小程序的蓝牙和定位权限，是否去设置打开？',
      confirmText: "确认",
      showCancel: false,
      cancelText: "取消",
      confirmColor: "#888bf4",
      success: (res) => {
        if (res.confirm) {
          wx.openSetting({
            success: () => {}
          })
        }
        // 用户点击取消或确认后都不再重复弹窗
      }
    })
  },
  // 判断是什么手机环境

  /**
   * 获取手机环境类型
   * @returns {String} 'ios' | 'android' | 'other'
   */
  getPhoneEnv() {
    const systemInfo = wx.getDeviceInfo();
    console.log('系统', systemInfo)
    let {
      model,
      system
    } = systemInfo
    if (system.indexOf('ios') !== -1) {
      this.globalData.phoneEnv = 'ios'
    } else if (system.indexOf('android') !== -1) {
      this.globalData.phoneEnv = 'android'
    } else {
      this.globalData.phoneEnv = 'other'
    }
  },

})