import { getRechargeRecordsApi } from '../../api/api'
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
    this.getRechargeRecords()
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom() {
    console.log('触底', )
    let { tableData, total } = this.data
    if (tableData.length <= total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getRechargeRecords('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getRechargeRecords()
  },
  tabClick(e) {
    const value = e.detail.value;
    console.log("🥵 ~ tabClick ~ value: ", value)
    this.setData({
      'pageObj.range': value
    });
    this.getRechargeRecords()
  },
  /**
   * 分页查询根据不同时间节点：range:1今天 2昨天 3本周 4本月
   * 增加在分页条件里面
   * @param {*} type 
   */
  getRechargeRecords(type = 'init') {
    getRechargeRecordsApi(this.data.pageObj).then(res => {
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
  }
})