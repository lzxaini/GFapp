const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom
  },
  goIndexx() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})