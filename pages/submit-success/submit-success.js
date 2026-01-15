const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/my/my',
    })
  }
})