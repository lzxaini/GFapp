import tabService from '../../utils/tab-service';
import {
  getDashboardApi,
  getUserExtendListApi
} from '../../api/api'
import {
  showMessage
} from '../../utils/tools';
const dayjs = require('dayjs')
const app = getApp()
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    userInfo: getApp().globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    dashboard: {
      activeDeviceCount: 0,
      remainingPoints: 0,
      todayConsumedPoints: 0,
      todayRechargeAmount: 0,
      todayConsumedPointsGrowthRate: 0,
      todayRechargeAmountGrowthRate: 0
    },
    tableData: [],
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
      deptName: ""
    },
    searchFlag: false,
    searchName: ""
  },
  onLoad() {},
  onShow() {
    //更新底部高亮
    tabService.updateIndex(this, 1)
    let userInfo = getApp().globalData.userInfo
    if (!userInfo) return
    this.setData({
      userInfo,
    })
    this.getDashboard()
    this.getUserExtendList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(e) {
    // let direction = e?.detail?.direction
    // if (direction === 'right') {
    //   return;
    // }
    let {
      tableData,
      total
    } = this.data
    if (tableData.length < total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getUserExtendList('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getUserExtendList()
    this.getDashboard()
  },
  searchClick() {
    this.setData({
      searchFlag: true
    })
  },
  // 获取信息
  getDashboard() {
    getDashboardApi().then(res => {
      if (res.code === 200) {
        this.setData({
          dashboard: res.data
        })
      }
    })
  },
  // 搜索
  changeHandle(e) {
    let {
      value
    } = e?.detail
    this.setData({
      'pageObj.deptName': value
    })
    this.getUserExtendList()
  },
  /**
   * 分页查询
   * 增加在分页条件里面
   * @param {*} type 
   */
  getUserExtendList(type = 'init') {
    getUserExtendListApi(this.data.pageObj).then(res => {
      if (type === 'bottom') {
        if (res.data.rows.length > 0) {
          let list = this.data.tableData
          list.push(...res.data.rows)
          this.setData({
            tableData: list
          })
        }
      } else {
        this.setData({
          tableData: res.data.rows,
          total: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  },
  blurClick() {
    this.setData({
      searchFlag: false
    })
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})