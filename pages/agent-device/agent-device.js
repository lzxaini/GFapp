import { getAdminDeviceListApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    pageSize: 20,
    teamTab: 3, // 默认团队tab
    teamObj: {},
    displayList: [],
    loadingMore: false,
    refresher: false,
    pageObj: {
      3: { pageNum: 1, hasMore: true },
      4: { pageNum: 1, hasMore: true },
    },
    deptId: undefined,
    deptType: undefined,
    deptInfo: {}
  },
  onShow() {
    let userInfo = getApp().globalData.userInfo
    let { dept } = userInfo
    this.setData({
      userInfo,
      deptId: dept.deptId,
      deptType: dept.deptType,
      deptInfo: dept
    })
    this.getAdminDeviceList()
  },
  /**
   * 获取部门设备（后端一次性返回全部子部门，前端做分页切片）
   */
  getAdminDeviceList() {
    let { deptId, deptType } = this.data
    getAdminDeviceListApi({ deptId, deptType }).then(res => {
      if (res.code === 200) {
        // res.data = { total, data: {3:[], 4:[]} }
        const teamObj = res.data?.data || {}
        this.setData({
          refresher: false,
          teamObj,
          pageObj: {
            3: { pageNum: 1, hasMore: this.hasMore(teamObj[3]) },
            4: { pageNum: 1, hasMore: this.hasMore(teamObj[4]) },
          }
        })
        // 如果当前 tab 没有数据，切到有数据的第一个 tab
        const currentList = teamObj[this.data.teamTab]
        const firstAvailable = [3, 4].find(k => teamObj[k]?.length > 0) || 3
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

  tabClick(e) {
    let { value } = e?.detail
    this.setData({ teamTab: value })
    this.computeDisplayList(value, true)
  },
  goDeviceList(e) {
    let { id, info } = e?.currentTarget?.dataset
    console.log('id',id, info)
    wx.navigateTo({
      url: `/pages/device-list/device-list?deptId=${id}&info=${JSON.stringify(info)}`,
    });
  }
})