import {
  onMqttReady
} from '../../utils/mqttReady';
const app = getApp();
import Message from 'tdesign-miniprogram/message/index';
import {
  getDeviceListApi,
  updateDeviceApi
} from '../../api/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad() {
    wx.eventCenter.on('mqtt-message', this.handleMsg);
    onMqttReady(() => {
      this.subscribeTopic();
    });
  },
  onUnload() {
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

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
  handleMsg({
    topic,
    message
  }) {
    console.log('设备列表收到消息：', topic, message);
    let {
      msg,
      result
    } = message
    if (topic === `/resp/${this.data.deviceId}` && msg === 'WiFi config cleared, starting BluFi configuration mode...') {
      if (this.exitTimer) {
        clearTimeout(this.exitTimer);
        this.exitTimer = null;
      }
      wx.hideLoading();
      Message.success({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '您已将设备退网，感谢您的使用！',
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/development/index/index',
        })
      }, 1500);
    }
  },
  endNetwork(deviceId) {
    setTimeout(() => {
      // 退网操作
      const mqttQrotocol = app.globalData.mqttQrotocol;
      mqttQrotocol.sendString('network-reset', `/req/${deviceId}`);
    }, 1000)
  },
  scanClick(e) {
    const item = e.currentTarget.dataset.item;
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        const deviceId = res.result;
        if (item === 'active') {
          wx.navigateTo({
            url: `/development/device-active/device-active?deviceId=${encodeURIComponent(deviceId)}`
          });
        } else if (item === 'use') {
          wx.navigateTo({
            url: `/development/device-use/device-use?deviceId=${encodeURIComponent(deviceId)}`
          });
        } else if (item === 'end') {
          this.endNetwork(deviceId);
        } else if (item === 'dy') {
          this.subscribe(deviceId);
        }
      },
      fail: () => {
        wx.showToast({
          title: '未获取到二维码',
          icon: 'none'
        });
      }
    });
  },
  subscribe(deviceId) {
    wx.navigateTo({
      url: '/development/subscribe/subscribe?deviceId=' + deviceId,
    })
  },

  // navBar的左侧返回
  handleBack() {
    console.log('自定义返回触发')
    // 获取当前页面栈实例
    let pages = getCurrentPages();
    console.log('页面栈长度:', pages, pages.length)
    if (pages.length <= 1) {
      // 如果只有一个页面，跳转到首页
      console.log('页面栈只有1个，跳转首页')
      wx.redirectTo({
        url: '/pages/my/my',
      })
    }
  },
  // 扫码解绑
  handleBind() {
    let _this = this
    wx.scanCode({
      onlyFromCamera: false,
      success: async (res) => {
        let params = {
          pageNum: 1,
          pageSize: 10,
          serialNumber: res.result
        }
        let device = await getDeviceListApi(params)
        let deviceInfo = device.data.rows
        if (deviceInfo.length > 0 && deviceInfo[0].deptId != 0) {
          wx.showModal({
            title: '提示',
            content: '是否确定解除绑定！',
            complete: (info) => {
              if (info.cancel) {
                wx.showToast({
                  title: '取消操作',
                })
              }
              if (info.confirm) {
                _this.updateDevice(deviceInfo[0])
              }
            }
          })
        } else {
          Message.warning({
            context: this,
            offset: [90, 32],
            duration: 2000,
            content: `${deviceInfo.length > 0 ? '设备未绑定' : '未查询到设备'}，无需解除绑定！`,
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '未获取到二维码',
          icon: 'none'
        });
      }
    });
  },
  // 调用接口
  updateDevice(data) {
    updateDeviceApi({
      ...data,
      deptId: 0,
      runningState: 0,
      teamId: 0,
    }).then(res => {
      if (res.data) {
        Message.success({
          context: this,
          offset: [90, 32],
          duration: 2000,
          content: '解除设备绑定成功！',
        });
      } else {
        Message.error({
          context: this,
          offset: [90, 32],
          duration: 2000,
          content: '无法解除绑定，请后台解除！',
        });
      }
    })
  }
})