const app = getApp()
const dayjs = require('dayjs')
import {
  addVisitorApi
} from '../../api/api.js'
import { onMqttReady } from '../../utils/mqttReady';
import drawQrcode from '../../utils/weapp.qrcode.min'
import tool from '../../utils/tools'
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    qrCodeBox: false,
    qrFlag: false,
  },
  onLoad() {
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
    console.log("🥵 ~ onShow ~ mqttClient: ", mqttClient)

    if (mqttClient?.isConnected()) {
      mqttClient.publish(`resp/861556077047305`, '小程序发');
      mqttClient.subscribe(`req/861556077047305`);
    } else {
      console.warn('MQTT 未连接或还未初始化');
    }
  },
  // 收到消息
  handleMsg({ topic, message }) {
    console.log('📩 收到 MQTT 消息', topic, message);
  },
  scanCodeActivation() {
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        console.log("🥵 ~ scanCode ~ res: ", res)
        const { result } = res;
        if (result) {
          // 扫码成功
        } else {
          wx.showToast({
            title: '扫描失败！',
            icon: 'error'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '扫描失败！',
          icon: 'error'
        });
      }
    });
  },

  drawUserQrcode() {
    let _this = this;
    drawQrcode({
      width: 240,
      height: 240,
      canvasId: 'myQrcode',
      text: '123',
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
  openQrCode() {
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
  goWorkTeam() {
    wx.navigateTo({
      url: '/pages/work-team/work-team'
    });
  },
  goRechargeHistory() {
    wx.navigateTo({
      url: '/pages/recharge-history/recharge-history'
    });
  },
  goWhiteList() {
    wx.navigateTo({
      url: '/pages/white-list/white-list'
    });
  }
})