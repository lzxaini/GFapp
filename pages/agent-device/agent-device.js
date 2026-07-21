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
    teamObj: {},
    teamList: [],
    displayList: [],
    teamTab: 3,
    total: 0,
    refresher: false,
    loadingMore: false,
    pageSize: 20,
    pageObj: {
      3: { pageNum: 1, hasMore: true },
      4: { pageNum: 1, hasMore: true },
    },
    deptInfo: {}
  },
  onShow() {
    tabService.updateIndex(this, 0)
    let userInfo = getApp().globalData.userInfo
    let { dept } = userInfo
    this.setData({
      userInfo,
      'pageObj.deptId': dept.deptId,
      'pageObj.deptType': dept.deptType,
      deptInfo: dept
    })
    this.getAdminDeviceList()
  },
  getAdminDeviceList() {
    getAdminDeviceListApi(this.data.pageObj).then(res => {
      if (res.code === 200) {
        const raw = res.data || {}
        const dataMap = raw.data || {}
        this.setData({
          refresher: false,
          teamObj: raw,
          pageObj: {
            3: { pageNum: 1, hasMore: this.hasMore(dataMap[3]) },
            4: { pageNum: 1, hasMore: this.hasMore(dataMap[4]) },
          }
        })
        const firstAvail = [3, 4].find(k => dataMap[k]?.length > 0) || 3
        const targetTab = dataMap[this.data.teamTab] ? this.data.teamTab : firstAvail
        this.setData({ teamTab: targetTab })
        this.computeDisplayList(targetTab, true)
      } else {
        this.setData({ refresher: false })
        wx.showToast({ title: '获取团队列表失败', icon: 'error' })
      }
    })
  },
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