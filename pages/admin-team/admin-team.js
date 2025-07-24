import { getAdminTeamListApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    teamTab: 2,
    teamObj: {},
    teamList: [],
    empty: {
      name: 'data-error',
      size: 40
    }
  },
  onShow() {
    this.getAdminTeamList()
  },
  tabClick(e) {
    let { value } = e?.detail
    let { teamObj } = this.data
    this.setData({
      teamList: teamObj[value]
    })
  },
  goTeamInfo(e) {
    let { flag, id } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/work-team/work-team?editFlag=${flag}&id=${id}`,
    });
  },
  getAdminTeamList() {
    getAdminTeamListApi().then(res => {
      this.setData({
        teamObj: res.data,
        teamList: res.data[2]
      })
    })
  }
})