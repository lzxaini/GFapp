import {
  getTeamsListApi
} from '../../api/api'
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    admin: [],
    user: [],
    refresher: false,
    isAdmin: true,
    isUser: false,
    emptyFlag: false,
    empty: {
      name: 'data-error',
      size: 40
    }
  },
  onShow() {
    this.getTeamsList()
  },
  goTeamInfo(e) {
    let {
      flag,
      id
    } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/work-team/work-team?editFlag=${flag}&deptId=${id}`,
    });
  },
  getTeamsList() {
    getTeamsListApi().then(res => {
      if (res.code === 200) {
        let data = res.data
        if (data.admin.length > 0) {
          this.setData({
            admin: data.admin,
            refresher: false,
            isAdmin: true,
            isUser: false
          })
        } else if (data.user.length > 0) {
          this.setData({
            user: data.user,
            refresher: false,
            isAdmin: false,
            isUser: true
          })
        } else {
          this.setData({
            emptyFlag: true
          })
        }
      }
    })
  }
})