import Message from 'tdesign-miniprogram/message/index';
import { getTeamsInfoListApi, joinTeamApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    teamList: [],
    total: 0,
    refresher: false,
    btnFlag: false,
    pageObj: {
      searchValue: '',
      status: 0,
      pageNum: 1,
      pageSize: 10,
    }
  },
  onLoad(options) {
    let { searchValue } = options
    this.setData({
      'pageObj.searchValue': searchValue
    })
    this.getTeamsInfoList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let { teamList, total } = this.data
    if (teamList.length < total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getTeamsInfoList('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getTeamsInfoList()
  },
  getTeamsInfoList(type = 'init') {
    getTeamsInfoListApi(this.data.pageObj).then(res => {
      if (type === 'bottom') {
        if (res.data.rows.length > 0) {
          let list = this.data.teamList
          list.push(...res.data.rows)
          this.setData({
            teamList: list
          })
        }
      } else {
        this.setData({
          teamList: res.data.rows,
          total: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  },
  joinTeam(e) {
    let { id } = e?.currentTarget?.dataset
    let userId = app.globalData.userInfo.userId
    let params = {
      teamId: id,
      userId
    }
    joinTeamApi(params).then(res => {
      if (res.code === 200) {
        this.setData({
          btnFlag: true
        });
        // 扫码成功
        wx.reLaunch({
          url: '/pages/submit-success/submit-success'
        });
      }
    })
  }
})