import { getTeamsListApi } from '../../api/api'
Page({
  data: {
    admin: [],
    user: [],
  },
  goTeamInfo(e) {
    console.log("🥵 ~ goTeamInfo ~ e: ", e)
    let { flag, id } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/work-team/work-team?editFlag=${flag}&id=${id}`,
    });
  },
  getTeamsList() {
    getTeamsListApi().then(res => {
      // $TODO 团队列表接口对接
      this.setData({
        admin: res.data.admin,
        user: res.data.user
      })
    })
  }
})