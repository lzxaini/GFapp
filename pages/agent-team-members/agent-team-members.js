import {
  getAdminTeamListDrillDownApi
} from '../../api/api'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    refresher: false,
    teamTab: 3, // 默认团队tab
    teamObj: {},
    teamList: [],
    deptData: {},
    tabsValue: 1, // 1: 团队成员, 2: 团队设备
  },
  onLoad(options) {
    let {
      deptInfo
    } = options
    let deptData = JSON.parse(deptInfo)
    this.setData({
      deptData
    })
    this.getAdminTeamListDrillDown()
  },
  onShow() {
    this.getAdminTeamListDrillDown()
  },
  getAdminTeamListDrillDown() {
    let {
      deptData,
      teamTab
    } = this.data
    getAdminTeamListDrillDownApi(deptData.deptId).then(res => {
      if (res.code === 200) {
        this.setData({
          refresher: false,
          teamObj: res.data,
          teamList: res.data[teamTab]
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
  tabClick(e) {
    let {
      value
    } = e?.detail
    let {
      teamObj
    } = this.data
    this.setData({
      teamTab: value,
      teamList: teamObj[value]
    })
  },
  goNext(e) {
    let {
      item
    } = e?.currentTarget?.dataset
    let {
      teamTab
    } = this.data
    switch (teamTab) {
      case 3:
        wx.navigateTo({
          url: `/pages/agent-team-list/agent-team-list?deptInfo=${JSON.stringify(item)}`,
        });
        break
      case 4:
        wx.navigateTo({
          url: `/pages/store-team-members/store-team-members?deptInfo=${JSON.stringify(item)}`,
        });
        break
    }
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