const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: app.globalData.capsuleHeight,
    tableData: [
      { name: '张三', age: 23 },
      { name: '李四', age: 28 },
      { name: '王五', age: 21 }
    ],
    activeValue: '0',
  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom() {
    console.log('触底',)
    let { tableData, total } = this.data
    if (tableData.length <= total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getRechargeRecords('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getRechargeRecords()
  },
  tabClick(e) {
    const value = e.detail.value;
    this.setData({
      activeValue: value
    });
  }
})