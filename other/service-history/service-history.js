import { getServiceSessionListApi, getSessionDetailApi } from '../../api/api'
import { getServiceNameByCode, getDeviceStatusIconByCode } from '../../utils/config'
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: app.globalData.capsuleHeight,
    userInfo: app.globalData.userInfo,
    tableData: [],
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
      range: 1
    }
  },
  onShow() {
    let { dept } = app.globalData.userInfo
    if (dept.deptType != 1) {
      this.setData({
        'pageObj.deptId': dept.deptId
      })
    }
    this.getServiceRecords()
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom() {
    console.log('触底',)
    let { tableData, total } = this.data
    if (tableData.length < total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getServiceRecords('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getServiceRecords()
  },
  tabClick(e) {
    const value = e.detail.value;
    this.setData({
      'pageObj.range': value
    });
    this.getServiceRecords()
  },
  /**
   * 展开/折叠会话详情
   */
  toggleSessionDetail(e) {
    const sessionId = e.currentTarget.dataset.sessionid
    const index = e.currentTarget.dataset.index
    const item = this.data.tableData[index]
    
    // 如果已经展开，则折叠
    if (item.expanded) {
      this.setData({
        [`tableData[${index}].expanded`]: false,
        [`tableData[${index}].details`]: []
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
        [`tableData[${index}].expanded`]: true,
        [`tableData[${index}].details`]: details
      })
    })
  },
  /**
    * 分页查询根据不同时间节点：range:1今天 2昨天 3本周 4本月
    * 使用新的会话聚合接口，同一50分钟周期的记录会合并为一条
   * @param {*} type 
   */
  getServiceRecords(type = 'init') {
    getServiceSessionListApi(this.data.pageObj).then(res => {
      // 拿到聚合后的会话数据
      const rows = res.data.rows.map(item => ({
        ...item,
        serviceObj: getServiceNameByCode(item.service),
        statusIcon: getDeviceStatusIconByCode(item.status),
        expanded: false,  // 是否展开详情
        details: []       // 详细记录列表
      }))
      if (type === 'bottom') {
        if (rows.length > 0) {
          let list = this.data.tableData
          list.push(...rows)
          this.setData({
            tableData: list
          })
        }
      } else {
        this.setData({
          tableData: rows,
          total: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  }
})