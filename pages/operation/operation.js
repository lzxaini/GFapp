import { getAdminDeviceListApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    tabsValue: 1,
    deviceInfo: {},
    deviceList: [],
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10
    }
  },
  onShow() {
    this.getAdminDeviceList()
  },
  /**
  * 页面上拉触底事件的处理函数
 */
  onReachBottom() {
    console.log('触底',)
    let { deviceList, total } = this.data
    if (deviceList.length < total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getAdminDeviceList('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getAdminDeviceList()
  },
  tabClick(e) {
    let { value } = e?.detail
    this.setData({
      tabsValue: value
    })
  },
  /**
   * 设备分页查询
   * 增加在分页条件里面
   * @param {*} type 
   */
  getAdminDeviceList(type = 'init') {
    getAdminDeviceListApi(this.data.pageObj).then(res => {
      if (type === 'bottom') {
        if (res.data.depts.rows.length > 0) {
          let list = this.data.deviceList
          list.push(...res.data.depts.rows)
          this.setData({
            deviceInfo: res.data,
            deviceList: list
          })
        }
      } else {
        this.setData({
          deviceInfo: res.data,
          deviceList: res.data.depts.rows,
          total: res.data.depts.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  },
  goDeviceList(e) {
    let { id } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/device-list/device-list?deptId=${id}`,
    });
  }
})