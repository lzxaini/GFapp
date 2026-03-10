const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom
  },
  goIndex() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})