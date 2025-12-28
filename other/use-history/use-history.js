import { getServiceRecordsApi } from '../../api/api'
import { getServiceNameByCode, getDeviceStatusIconByCode } from '../../utils/config'
const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    serialNumber: '',
    historyList: [],
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
      serialNumber: ''
    },
    empty: {
      name: 'gesture-press',
      size: 40
    }
  },
  onLoad(options) {
    let { serialNumber } = options
    this.setData({
      'pageObj.serialNumber': serialNumber
    })
    this.getDeviceUseList()
  },
  /**
  * 页面上拉触底事件的处理函数
 */
  onReachBottom() {
    let { historyList, total } = this.data
    if (historyList.length < total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getDeviceUseList('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getDeviceUseList()
  },

  /**
   * 分页查询根据不同时间节点：status 0：未开始，1：进行中，2：已完成
   * 增加在分页条件里面
   * @param {*} type 
   */
  getDeviceUseList(type = 'init') {
    getServiceRecordsApi(this.data.pageObj).then(res => {
      const rows = res.data.rows.map(item => ({
        ...item,
        serviceObj: getServiceNameByCode(item.service),
        statusIcon: getDeviceStatusIconByCode(item.status)
      }))
      if (type === 'bottom') {
        if (rows.length > 0) {
          let list = this.data.historyList
          list.push(...rows)
          this.setData({
            historyList: list
          })
        }
      } else {
        this.setData({
          historyList: rows,
          total: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  }
})