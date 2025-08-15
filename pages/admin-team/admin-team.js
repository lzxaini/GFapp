import {
  getAdminTeamListApi
} from '../../api/api'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    teamTab: 2, // 默认团队tab,1是最顶级不用加载
    teamObj: {},
    teamList: [],
    refresher: false,
    empty: {
      name: 'data-error',
      size: 40
    },
    qrCodeBox: false,
    qrFlag: false,
  },
  onShow() {
    this.getAdminTeamList()
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
      teamList: teamObj[value] || []
    })
  },
  goTeamInfo(e) {
    let {
      flag,
      id
    } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/work-team/work-team?editFlag=${flag}&id=${id}`,
    });
  },
  getAdminTeamList() {
    let {
      teamTab
    } = this.data
    getAdminTeamListApi().then(res => {
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
  goNext(e) {
    let {
      item
    } = e?.currentTarget?.dataset
    let {
      teamTab
    } = this.data
    switch (teamTab) {
      case 2:
        wx.navigateTo({
          url: `/pages/agent-team-members/agent-team-members?deptInfo=${JSON.stringify(item)}`,
        });
        break
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
})