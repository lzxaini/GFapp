import { getTeamsListApi } from '../../api/api'
Page({
  data: {
    admin: [],
    user: [],
  },
  goTeamInfo(e) {
    console.log("🥵 ~ goTeamInfo ~ e: ", e)
    let { flag } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/work-team/work-team?editFlag=${flag}`,
    });
  },
  getTeamsList() {
    getTeamsListApi().then(res => {
      this.setData({
        admin: res.data.admin,
        user: res.data.user
      })
    })
  }
})