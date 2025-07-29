import { getDeviceListApi, getDeviceActivatedApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    deviceList: [],
    historyList: {
      activated: 0,
      total: 0
    },
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
      deptId: ''
    }
  },
  onLoad(options) {
    let { deptId } = options
    this.setData({
      'pageObj.deptId': deptId || this.data.userInfo.dept.deptId
    })
    this.getDeviceList()
    this.getDeviceActivated()
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
      this.getDeviceList('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getDeviceList()
  },
  /**
   * 设备分页查询
   * 增加在分页条件里面
   * @param {*} type 
   */
  getDeviceList(type = 'init') {
    getDeviceListApi(this.data.pageObj).then(res => {
      if (type === 'bottom') {
        if (res.data.rows.length > 0) {
          let list = this.data.deviceList
          list.push(...res.data.rows)
          this.setData({
            deviceList: list
          })
        }
      } else {
        this.setData({
          deviceList: res.data.rows,
          total: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  },
  scanCodeActivation(e) {
    let { runningstate, serialnumber } = e?.currentTarget.dataset
    // "runningState": "1",（0未激活 1已停止 2运行中）
    if (runningstate === '2') { // $TODO 待完善，点击列表，判断设备是否在使用中，是的话，带上deviceId去使用页面
      wx.navigateTo({
        url: `/pages/device-use/device-use?deviceId=${serialnumber}`,
      });
      return
    }
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        const { result } = res;
        if (result) {
          wx.navigateTo({
            url: `/pages/device-active/device-active?deviceId=${result}`,
          });
        } else {
          wx.showToast({
            title: '扫描失败！',
            icon: 'error'
          });
        }
      },
      fail: (err) => {
        console.log("扫码fail: ", err)
      }
    });
  },
  // 去往使用记录
  goHistoryInfo(e) {
    let { serialnumber } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/use-history/use-history?serialNumber=${serialnumber}`,
    });
  },
  // 设备激活
  getDeviceActivated() {
    // $TODO 设备激活数量记录接口对接
    getDeviceActivatedApi(this.data.userInfo.dept.deptId).then(res => {
      this.setData({ historyList: res.data })
    })
  }
})