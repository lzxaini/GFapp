const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    cdnUrl: app.globalData.cdnUrl,
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/my/my',
    })
  }
})