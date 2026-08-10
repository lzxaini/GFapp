import { getAdminDeviceListApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    pageSize: 20,
    teamObj: {},
    teamTab: 2, // 默认团队tab,1是最顶级不用加载
    displayList: [],
    loadingMore: false,
    refresher: false,
    pageObj: {
      2: { pageNum: 1, hasMore: true },
      3: { pageNum: 1, hasMore: true },
      4: { pageNum: 1, hasMore: true },
    },
  },
  onShow() {
    this.getAdminDeviceList()
  },
  /**
   * 获取部门设备（后端一次性返回全部，前端按 tab 分页切片）
   */
  getAdminDeviceList() {
    let { dept } = this.data.userInfo
    getAdminDeviceListApi({ deptId: dept.deptId, deptType: dept.deptType }).then(res => {
      if (res.code === 200) {
        // res.data = { bindCount, unbindCount, onlineCount, data: {2:[],3:[],4:[]} }
        const teamObj = res.data || {}
        const teamData = teamObj.data || {}
        this.setData({
          refresher: false,
          teamObj,
          pageObj: {
            2: { pageNum: 1, hasMore: this.hasMore(teamData[2]) },
            3: { pageNum: 1, hasMore: this.hasMore(teamData[3]) },
            4: { pageNum: 1, hasMore: this.hasMore(teamData[4]) },
          }
        })
        // 如果当前 tab 没有数据，切到有数据的第一个 tab
        const currentList = teamData[this.data.teamTab]
        const firstAvailable = [2, 3, 4].find(k => teamData[k]?.length > 0) || 2
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
    const fullList = (teamObj.data || {})[tab] || []
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
  tabClick(e) {
    let { value } = e?.detail
    this.setData({ teamTab: value })
    this.computeDisplayList(value, true)
  },
  goDeviceList(e) {
    let { id, info } = e?.currentTarget?.dataset
    console.log('id',id)
    wx.navigateTo({
      url: `/pages/device-list/device-list?deptId=${id}&info=${JSON.stringify(info)}`,
    });
  }
})