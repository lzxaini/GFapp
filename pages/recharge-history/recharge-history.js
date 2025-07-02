const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: app.globalData.capsuleHeight,
    tableData: [
      { name: '张三', age: 23 },
      { name: '李四', age: 28 },
      { name: '王五', age: 21 }
    ]
  },
})