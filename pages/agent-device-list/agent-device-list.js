import tabService from '../../utils/tab-service';
import { getAdminDeviceListApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: app.globalData.capsuleHeight,
    marginBottom: app.globalData.marginBottom,
    appName: app.globalData.appName,
    ossUrl: app.globalData.ossUrl,
    cdnUrl: app.globalData.cdnUrl,
    userInfo: getApp().globalData.userInfo,
    teamObj: {},
    teamList: [],
    displayList: [],
    teamTab: 2,
    total: 0,
    refresher: false,
    loadingMore: false,
    pageSize: 20,
    pageObj: {
      2: { pageNum: 1, hasMore: true },
      3: { pageNum: 1, hasMore: true },
      4: { pageNum: 1, hasMore: true },
    },
  },
  onShow() {
    tabService.updateIndex(this, 0)
    this.getList()
  },
  // 下拉刷新
  getList(){
    let { dept } = this.data.userInfo
    this.setData({
      'pageObj.deptId': dept.deptId,
      'pageObj.deptType': dept.deptType
    })
    this.getAdminDeviceList()
  },
  getAdminDeviceList() {
    console.log('this.data.pageObj', this.data.pageObj)
    getAdminDeviceListApi(this.data.pageObj).then(res => {
      if (res.code === 200) {
        const raw = res.data || {}
        const dataMap = raw.data || {}
        this.setData({
          refresher: false,
          teamObj: raw,
          pageObj: {
            2: { pageNum: 1, hasMore: this.hasMore(dataMap[2]) },
            3: { pageNum: 1, hasMore: this.hasMore(dataMap[3]) },
            4: { pageNum: 1, hasMore: this.hasMore(dataMap[4]) },
          }
        })
        // 如果当前 tab 无数据，切到第一个有数据的 tab
        const firstAvail = [2, 3, 4].find(k => dataMap[k]?.length > 0) || 2
        const targetTab = dataMap[this.data.teamTab] ? this.data.teamTab : firstAvail
        this.setData({ teamTab: targetTab })
        this.computeDisplayList(targetTab, true)
      } else {
        this.setData({ refresher: false })
        wx.showToast({ title: '获取团队列表失败', icon: 'error' })
      }
    })
  },
  // 计算当前 tab 展示列表（前端分页切片）
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
    console.log('id',id, info)
    wx.navigateTo({
      url: `/pages/device-list/device-list?deptId=${id}&info=${JSON.stringify(info)}`,
    });
  }
})