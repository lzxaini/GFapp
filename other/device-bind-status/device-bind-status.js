import {
  activetionDeviceApi,
  getDeviceListApi,
  sanStartDeviceApi
} from '../../api/api.js'
const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    capsuleHeight: app.globalData.capsuleHeight,
    cdnUrl: app.globalData.cdnUrl,
    serialNumber: '',
    titleSerialNumber: '11111',
    deviceDate: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { serialNumber } = options
    // let serialNumber = '868381079564196';
    let titleSerialNumber = serialNumber.slice(-8);
    this.setData({
      serialNumber,
      titleSerialNumber
    })
    this.getDeviceInfo()
  },
  async getDeviceInfo() {
    let res = await getDeviceListApi({
      serialNumber: this.data.serialNumber
    })
    let deviceDate = res.data.rows[0]
    this.setData({
      deviceDate
    })
  },
  goScan() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        const {
          result
        } = res;
        if (result) {
          // 扫码成功
          this.sanStartDevice(result)
        } else {
          wx.showToast({
            title: '扫描失败！',
            icon: 'error'
          });
        }
      },
      fail: () => {}
    });
  },
  // 扫码先掉接口确定
  sanStartDevice(serialNumber) {
    sanStartDeviceApi(serialNumber).then(res => {
      if (res.code === 200) {
        if (res.data) {
          this.activetionDevice(serialNumber)
        } else {
          this.message('warning', '您暂无使用次数，请联系管理员！', 3000);
        }
      }
    })
  },
  // 激活设备
  activetionDevice(serialNumber) {
    activetionDeviceApi(serialNumber).then(res => {
      if (res.code === 24003) { // 已绑定，到激活设备页面
        return wx.navigateTo({
          url: `/pages/device-active/device-active?deviceId=${serialNumber}`,
        });
      }
      if (res.data.length < 1) { // 到激活设备页面
        return wx.navigateTo({
          url: `/pages/device-active/device-active?deviceId=${serialNumber}`,
        });
      }
      if (res.data.length > 0) { // 到绑定页面
        if (serialNumber.indexOf("GFKM-") != -1) { // WiFi模块
          return wx.navigateTo({
            url: `/pages/device-status/device-status?deviceId=${serialNumber}`,
          })
        } else { // 4G模块
          return wx.navigateTo({
            url: `/pages/device-bind/device-bind?deviceId=${serialNumber}`,
          });
        }
      }
    })
  },
  goBack() {
    wx.navigateBack({
      delta: 2
    })
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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

  }
})