import { getAdminTeamListDrillDownApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    refresher: false,
    teamList: [],
    deptData: {},
    tabsValue: 1, // 1: 团队成员, 2: 团队设备
  },
  onLoad(options) {
    let { deptInfo } = options
    let deptData = JSON.parse(deptInfo)
    this.setData({ deptData })
    this.getAdminTeamListDrillDown()
  },
  getAdminTeamListDrillDown() {
    let { deptData } = this.data
    getAdminTeamListDrillDownApi(deptData.deptId).then(res => {
      if (res.code === 200) {
        this.setData({
          refresher: false,
          teamList: res.data[4]
        })
      } else {
        this.setData({
          refresher: false,
        })
        wx.showToast({
          title: '获取团队列表失败',
          icon: 'error'
        })
      }
    })
  },
  goNext(e) {
    let { item } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/store-team-members/store-team-members?deptInfo=${JSON.stringify(item)}`,
    });
  }
})