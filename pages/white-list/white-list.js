import { getWhitelistApi } from '../../api/api'
import { getFrequencyNameByCode, getWhiteStatusIconByCode } from '../../utils/config'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    whiteList: [],
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
    }
  },
  onShow() {
    let { dept } = app.globalData.userInfo
    if (dept.deptType != 1) {
      this.setData({
        'pageObj.deptId': dept.deptId
      })
    }
    this.getWhitelist()
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom() {
    console.log('触底',)
    let { whiteList, total } = this.data
    if (whiteList.length < total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getWhitelist('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getWhitelist()
  },
  tabClick(e) {
    const value = e.detail.value;
    this.setData({
      'pageObj.range': value
    });
    this.getWhitelist()
  },
  /**
    * 频率，1：当天（今天），2：每天，3：每周，4：每月，5：每年
    * 运行状态：0：待使用，1：已过期，2：已核销
   * @param {*} type 
   */
  getWhitelist(type = 'init') {
    getWhitelistApi(this.data.pageObj).then(res => {
      // 拿到原始 rows
      const rows = res.data.rows.map(item => ({
        ...item,
        frequencyName: getFrequencyNameByCode(item.frequency),
        statusIcon: getWhiteStatusIconByCode(item.status)
      }))
      if (type === 'bottom') {
        if (rows.length > 0) {
          let list = this.data.whiteList
          list.push(...rows)
          this.setData({
            whiteList: list
          })
        }
      } else {
        this.setData({
          whiteList: rows,
          total: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  },
  scanCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log("🥵 ~ scanCode ~ res: ", res)
        const { result } = res;
        if (result) {
          // 扫码成功
        } else {
          wx.showToast({
            title: '扫描失败！',
            icon: 'error'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '扫描失败！',
          icon: 'error'
        });
      }
    });
  }
})