import { getServiceSessionListApi, getSessionDetailApi } from '../../api/api'
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
   * 展开/折叠会话详情
   */
  toggleSessionDetail(e) {
    const sessionId = e.currentTarget.dataset.sessionid
    const index = e.currentTarget.dataset.index
    const item = this.data.historyList[index]
    
    // 如果已经展开，则折叠
    if (item.expanded) {
      this.setData({
        [`historyList[${index}].expanded`]: false,
        [`historyList[${index}].details`]: []
      })
      return
    }
    
    // 加载详情数据
    getSessionDetailApi(sessionId).then(res => {
      const details = res.data.map(detail => ({
        ...detail,
        serviceObj: getServiceNameByCode(detail.service),
        statusIcon: getDeviceStatusIconByCode(detail.status)
      }))
      this.setData({
        [`historyList[${index}].expanded`]: true,
        [`historyList[${index}].details`]: details
      })
    })
  },

  /**
   * 查询设备使用记录（使用会话聚合接口，同一50分钟周期合并为一条）
   * @param {*} type 
   */
  getDeviceUseList(type = 'init') {
    getServiceSessionListApi(this.data.pageObj).then(res => {
      const rows = res.data.rows.map(item => ({
        ...item,
        serviceObj: getServiceNameByCode(item.service),
        statusIcon: getDeviceStatusIconByCode(item.status),
        expanded: false,  // 是否展开详情
        details: []       // 详细记录列表
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