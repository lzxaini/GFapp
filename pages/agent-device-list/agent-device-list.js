import { getAdminDeviceListApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    teamObj: {},
    teamList: [],
    teamTab: 2, // 默认团队tab,1是最顶级不用加载
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10
    }
  },
  onShow() {
    let { dept } = this.data.userInfo
    this.setData({
      'pageObj.deptId': dept.deptId,
      'pageObj.deptType': dept.deptType
    })
    this.getAdminDeviceList()
  },
  /**
   * 设备分页查询
   * 增加在分页条件里面
   * @param {*} type 
   */
  getAdminDeviceList() {
    let {
      teamTab
    } = this.data
    getAdminDeviceListApi(this.data.pageObj).then(res => {
      if (res.code === 200) {
        this.setData({
          refresher: false,
          teamObj: res.data,
          teamList: res.data.data[teamTab]
        })
      } else {
        this.setData({
          refresher: false,
        })
        wx.showToast({
          title: '获取团队列表失败',
          icon: 'error'
        })
      }
    })
  },
  tabClick(e) {
    let {
      value
    } = e?.detail
    let {
      teamObj
    } = this.data
    this.setData({
      teamTab: value,
      teamList: teamObj.data[value]
    })
  },
  goDeviceList(e) {
    let { id, info } = e?.currentTarget?.dataset
    console.log('id',id)
    wx.navigateTo({
      url: `/pages/device-list/device-list?deptId=${id}&info=${JSON.stringify(info)}`,
    });
  }
})