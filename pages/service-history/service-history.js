import { getServiceRecordsApi } from '../../api/api'
import { getServiceNameByCode } from '../../utils/config'
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: app.globalData.capsuleHeight,
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
    * 分页查询根据不同时间节点：range:1今天 2昨天 3本周 4本月
    * 增加在分页条件里面
    * 服务根据协议，1：脸部护理，2：身体护理
    * 服务状态：0：未开始，1：进行中，2：已完成
   * @param {*} type 
   */
  getServiceRecords(type = 'init') {
    getServiceRecordsApi(this.data.pageObj).then(res => {
      // 拿到原始 rows
      const rows = res.data.rows.map(item => ({
        ...item,
        serviceName: getServiceNameByCode(item.service)
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