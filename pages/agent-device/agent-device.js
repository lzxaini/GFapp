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
    teamTab: 3, // 默认团队tab,1是最顶级不用加载
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10
    },
    deptInfo: {}
  },
  onShow() {
    let userInfo = getApp().globalData.userInfo
    let { dept } = userInfo
    this.setData({
      userInfo,
      'pageObj.deptId': dept.deptId,
      'pageObj.deptType': dept.deptType,
      deptInfo: dept
    })
    this.getAdminDeviceList()
    //更新底部高亮
    tabService.updateIndex(this, 0)
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
      teamList: teamObj.data[value] || []
    })
  },
  goDeviceList(e) {
    let { id, info } = e?.currentTarget?.dataset
    console.log('id',id, info)
    wx.navigateTo({
      url: `/pages/device-list/device-list?deptId=${id}&info=${JSON.stringify(info)}`,
    });
  }
})