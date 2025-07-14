import { getTeamsMemberListApi } from '../../api/api'
Page({
  data: {
    memberList: [],
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
    }
  },
  onShow() {
    this.getTeamsMemberList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let pageNum = ++this.data.pageObj.pageNum
    this.setData({
      'pageObj.pageNum': pageNum
    })
    this.getTeamsMemberList('bottom')
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getTeamsMemberList()
  },
  getTeamsMemberList(type = 'init') {
    getTeamsMemberListApi(this.data.pageObj).then(res => {

      if (type === 'bottom') {
        if (res.data.rows.length > 0) {
          let list = this.data.memberList
          list.push(...res.data.rows)
          this.setData({
            memberList: list
          })
        }
      } else {
        this.setData({
          memberList: res.data.rows,
          total: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  }
})