import {
  getAdminTeamListApi
} from '../../api/api'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    pageSize: 20,
    teamTab: 2,
    teamObj: {},
    displayList: [],
    loadingMore: false,
    refresher: false,
    pageObj: {
      2: { pageNum: 1, hasMore: true },
      3: { pageNum: 1, hasMore: true },
      4: { pageNum: 1, hasMore: true },
    },
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
    let { value } = e?.detail
    this.setData({ teamTab: value })
    this.computeDisplayList(value, true)
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
    getAdminTeamListApi().then(res => {
      if (res.code === 200) {
        // res.data = {code:200, msg:"操作成功", data: {1:[], 2:[], 3:[]}}
        const raw = res.data || {}
        const teamObj = raw.data || {}
        this.setData({
          refresher: false,
          teamObj,
          pageObj: {
            2: { pageNum: 1, hasMore: this.hasMore(teamObj[2]) },
            3: { pageNum: 1, hasMore: this.hasMore(teamObj[3]) },
            4: { pageNum: 1, hasMore: this.hasMore(teamObj[4]) },
          }
        })
        // 如果当前 tab 没有数据，切到有数据的第一个 tab
        const currentList = teamObj[this.data.teamTab]
        const firstAvailable = [2, 3, 4].find(k => teamObj[k]?.length > 0) || 2
        this.setData({
          teamTab: currentList ? this.data.teamTab : firstAvailable
        })
        this.computeDisplayList(this.data.teamTab, true)
      } else {
        this.setData({ refresher: false })
        wx.showToast({ title: '获取团队列表失败', icon: 'error' })
      }
    })
  },

  // 计算当前 tab 的展示列表（前端分页切片）
  computeDisplayList(tab, reset) {
    const { teamObj, pageObj } = this.data
    const fullList = teamObj[tab] || []
    const curPage = (reset || !pageObj[tab]) ? 1 : pageObj[tab].pageNum
    const { pageSize } = this.data
    const end = curPage * pageSize
    const slice = fullList.slice(0, end)

    const pagePath = `pageObj[${tab}]`
    this.setData({
      displayList: slice,
      loadingMore: false,
      [`${pagePath}.pageNum`]: curPage,
      [`${pagePath}.hasMore`]: end < fullList.length,
    })
  },

  hasMore(list) {
    const { pageSize } = this.data
    return list ? list.length > pageSize : false
  },

  // 触底加载更多
  onScrollToLower() {
    const { teamTab, pageObj, loadingMore } = this.data
    const cur = pageObj[teamTab]
    if (!cur || loadingMore || !cur.hasMore) return
    this.setData({ loadingMore: true })
    this.setData({ [`pageObj[${teamTab}].pageNum`]: cur.pageNum + 1 })
    this.computeDisplayList(teamTab)
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