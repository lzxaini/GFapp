import { getStoresTeamListApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    refresher: false,
    membersList: [],
    deptData: {},
    tabsValue: 1, // 1: 团队成员, 2: 团队设备
  },
  onLoad(options) {
    let { deptInfo } = options
    let deptData = JSON.parse(deptInfo)
    this.setData({ deptData })
    this.getStoresTeamList()
  },
  getStoresTeamList() {
    let { deptData } = this.data
    getStoresTeamListApi(deptData.deptId).then(res => {
      if (res.code === 200) {
        this.setData({
          refresher: false,
          membersList: res.data
        })
      } else {
        this.setData({
          refresher: false,
        })
        wx.showToast({
          title: '获取成员列表失败',
          icon: 'error'
        })
      }
    })
  },
  goEditDept() {
    let {
      deptData
    } = this.data
    wx.navigateTo({
      url: '/pages/change-department/change-department?deptData=' + JSON.stringify(deptData),
    })
  }
})