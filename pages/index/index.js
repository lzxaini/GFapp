const app = getApp()
const dayjs = require('dayjs')
import {
  activetionDeviceApi,
  getUserInfoApi
} from '../../api/api.js'
import { onMqttReady } from '../../utils/mqttReady';
import drawQrcode from '../../utils/weapp.qrcode.min'
import tool from '../../utils/tools'
import { withLogin } from '../../utils/auth';
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    ossUrl: app.globalData.ossUrl,
    qrCodeBox: false,
    qrFlag: false,
    userInfo: app.globalData.userInfo,
    cardList: [{
      title: '团队管理',
      icon: 'my_1.png',
      url: '/pages/team-list/team-list'
    }, {
      title: '设备管理',
      icon: 'my_2.png',
      url: '/pages/device-list/device-list'
    }, {
      title: '运营管理',
      icon: 'my_3.png',
      url: '/pages/work-team/work-team'
    }, {
      title: '使用指南',
      icon: 'my_4.png',
      url: '/pages/work-team/work-team'
    }, {
      title: '设置',
      icon: 'my_5.png',
      url: '/pages/my-edit/my-edit'
    }],
    isLogin: false
  },
  onLoad() {
    // this.setData({
    //   userInfo: app.globalData.userInfo
    // });
    // 游客模式
    this.openQrCode = withLogin(this, this._openQrCode);
    this.scanCodeActivation = withLogin(this, this._scanCodeActivation);
    this.goListItem = withLogin(this, this._goListItem);
    this.goRechargeHistory = withLogin(this, this._goRechargeHistory);
    this.goWhiteList = withLogin(this, this._goWhiteList);
    this.goServiceHistory = withLogin(this, this._goServiceHistory);
    // this. = withLogin(this, this._);

    onMqttReady(() => {
      this.subscribeTopic();
    });
    wx.eventCenter.on('mqtt-message', this.handleMsg);
  },
  onShow() {
    app.getUserInfo(getUserInfoApi).then(res => {
      if (res) {
        this.setData({
          userInfo: res
        });
      }
    })
  },
  onUnload() {
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
  },
  // 订阅
  subscribeTopic() {
    const mqttClient = app.globalData.mqttClient;
    if (mqttClient?.isConnected()) {
      mqttClient.subscribe(`/resp/123`);
    } else {
      console.warn('MQTT 未连接或还未初始化');
    }
  },
  // 收到消息
  handleMsg({ topic, message }) {
    console.log('📩 收到 MQTT 消息', topic, message);
  },
  _scanCodeActivation() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log("🥵 ~ scanCode ~ res: ", res)
        const { result } = res;
        if (result) {
          // 扫码成功
          this.activetionDevice(result)
        } else {
          wx.showToast({
            title: '扫描失败！',
            icon: 'error'
          });
        }
      },
      fail: () => {
      }
    });
  },
  // 激活设备
  activetionDevice(serialNumber) {
    activetionDeviceApi(serialNumber).then(res => {
      if (res.data.length < 1 || res.code === 24003) {
        wx.navigateTo({
          url: `/pages/device-active/device-active?deviceId=${serialNumber}`,
        });
      }
      if (res.data.length > 0) {
        wx.navigateTo({
          url: `/pages/device-bind/device-bind?deviceId=${serialNumber}`,
        });
      } else {
        wx.showToast({
          title: '系统错误！',
          icon: 'error'
        });
      }
    })
  },
  drawUserQrcode() {
    let _this = this;
    drawQrcode({
      width: 240,
      height: 240,
      canvasId: 'myQrcode',
      text: this.data.userInfo.userId,
      // v1.0.0+版本支持在二维码上绘制图片
      image: {
        imageResource: '../../static/icon/gf_logo_w.png', // 不支持网络图片，如果非得网络图片，需要使用wx.getImageInfo 去获取图片信息，我这边往中间加的一个白图然后采用覆盖的方式
        dx: 100,
        dy: 100,
        dWidth: 50,
        dHeight: 50
      }
    })
    setTimeout(() => {
      _this.setData({
        qrFlag: true
      })
    }, 500);
  },
  // 邀请加入
  _openQrCode() {
    this.setData({
      qrCodeBox: true
    })
    if (this.data.qrCodeBox) {
      this.drawUserQrcode()
    }
  },
  // 保存邀请码
  saveQrCode: tool.debounce(function () {
    let _this = this;
    wx.canvasToTempFilePath({
      canvasId: 'myQrcode',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            })
            _this.closeDialog()
          },
          fail(err) {
            console.error('保存失败', err)
          }
        })
      },
      fail(err) {
        console.error('生成二维码失败', err)
      }
    })
  }, 800),
  closeDialog() {
    this.setData({
      qrCodeBox: false,
      qrFlag: false
    })
  },
  // 团队管理
  _goListItem(e) {
    let { url } = e?.currentTarget?.dataset
    wx.navigateTo({
      url
    });
  },
  // 充值记录
  _goRechargeHistory() {
    wx.navigateTo({
      url: '/pages/recharge-history/recharge-history'
    });
  },
  // 服务记录
  _goServiceHistory() {
    wx.navigateTo({
      url: '/pages/service-history/service-history'
    });
  },
  // 白名单
  _goWhiteList() {
    wx.navigateTo({
      url: '/pages/white-list/white-list'
    });
  },
  goLogin() {
    wx.reLaunch({
      url: '/pages/login/login',
    });
  },
  closeIsLoginDialog() {
    this.setData({ isLogin: false });
  },
  testMq() {
    const mqttQrotocol = app.globalData.mqttQrotocol;
    mqttQrotocol.sendScanQrCode(`/req/123`)
    // // 控制设备开始运行 60分钟
    // mqttQrotocol.controlDevice('/resp/861556077047305', true, 255);
    // mqttQrotocol.sendScanQrCode('/resp/861556077047305');
  },
  testSetKey() {
    wx.setStorageSync('token', 'token1232132312')
    wx.setStorageSync('userInfo', 'userInfo123123123')
  }
})