
const app = getApp()
Page({
  data: {
  },
  scanCodeActivation() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        const { result } = res;
        if (result) {
          // const mqttQrotocol = app.globalData.mqttQrotocol;
          console.log("🥵 ~ scanCodeActivation ~ result: ", result)
          // 扫码成功
          // mqttQrotocol.controlDevice(`resp/${result}`, true, 255);
          wx.navigateTo({
            url: `/pages/device-use/device-use?deviceId=${result}`,
          });
        } else {
          wx.showToast({
            title: '扫描失败！',
            icon: 'error'
          });
        }
      },
      fail: (err) => {
        console.log("扫码fail: ", err)
      }
    });
  },
  // 去往使用记录
  goInfo() {

  }
})