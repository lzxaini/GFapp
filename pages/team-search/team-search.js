Page({
  searchTeam() {
    
  },
  scanTeam() {
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        console.log("🥵 ~ scanCode ~ res: ", res)
        const { result } = res;
        if (result) {
          // 扫码成功
          wx.reLaunch({
            url: '/pages/submit-success/submit-success'
          });
        } else {
          wx.showToast({
            title: '扫描失败！',
            icon: 'error'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '扫描失败！',
          icon: 'error'
        });
      }
    });
  }
})