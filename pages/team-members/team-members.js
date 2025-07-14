import { getTeamsMemberListApi } from '../../api/api'
Page({
  data: {
    memberList: [],
    page: {
      pageSize: 10,
      pageNum: 1,
      total: 0
    }
  },
  onShow() {
    this.getTeamsMemberList()
  },
  // $TODO 团队成员待对接
  getTeamsMemberList() {
    getTeamsMemberListApi().then(res => {
      console.log("🥵 ~ getTeamsMemberListApi ~ res: ", res)
      this.setData({
        memberList: res.data.rows,
        'page.total': res.data.total
      })
    })
  }
})