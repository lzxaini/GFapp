const app = getApp()
import {
  openDoorApi,
  closeDoorApi
} from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.capsuleHeight,
    previewVisible: false,
    visitorInfo: {
      id: '',
      status: '0',
      visitorName: '',
      mobile: '',
      validStart: '',
      validEnd: '',
      content: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let visitorInfo = JSON.parse(options.data)
    this.setData({
      visitorInfo
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

  },
  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  openDoor() {
    this.closeDoor()
    openDoorApi(this.data.visitorInfo.id).then(res => {
      if (res.code == 200) {
        wx.showToast({
          icon: 'success',
          title: '开门成功！',
        });
      }
    })
  },
  closeDoor() {
    closeDoorApi(this.data.visitorInfo.id).then(res => {
      console.log("关门接口调用: ", res)
    })
  },
  previewPicture() {
    this.setData({
      previewVisible: true,
    });
  },
  onClose(e) {
    const { trigger } = e.detail;
    this.setData({
      previewVisible: false,
    });
  },
})