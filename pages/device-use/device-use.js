const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    deviceId: ''
  },
  onLoad(option) {
    console.log("🥵 ~ option: ", option)
  }
})