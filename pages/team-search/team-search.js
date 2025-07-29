Page({
  data: {
    confirmBtn: { content: '确定', variant: 'base' },
    showConfirm: false
  },
  searchTeam() {
    wx.navigateTo({
      url: '/pages/search-page/search-page'
    })
  },
  scanTeam() {
    let _this = this
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        const { result } = res;
        if (result) {
          _this.joinDept(result)
        }
      },
      fail: (err) => {
        console.log('扫码', err)
      }
    });
  },
  // 加入团队
  joinDept(searchValue) {
    wx.navigateTo({
      url: `/pages/team-join/team-join?searchValue=${searchValue}`,
    });
  }
})