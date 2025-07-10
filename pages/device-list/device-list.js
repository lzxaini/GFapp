
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
          wx.navigateTo({
            url: `/pages/device-active/device-active?deviceId=${result}`,
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