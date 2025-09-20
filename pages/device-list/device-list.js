import Message from 'tdesign-miniprogram/message/index';
import {
  getDeviceListApi,
  getDeviceActivatedApi,
  sanStartDeviceApi
} from '../../api/api'
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
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
    },
    deptInfo: {}
  },
  onLoad(options) {
    let {
      deptId,
      info
    } = options
    try {
      let deptInfo = JSON.parse(info)
      this.setData({
        'pageObj.deptId': deptId || this.data.userInfo.dept.deptId,
        deptInfo: deptInfo
      })
    } catch (error) {
      this.setData({
        'pageObj.deptId': deptId || this.data.userInfo.dept.deptId,
        deptInfo: this.data.userInfo.dept
      })
    }
  },
  onShow() {
    this.getDeviceList()
    this.getDeviceActivated()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('触底',)
    let {
      deviceList,
      total
    } = this.data
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
    this.getDeviceActivated()
  },
  /**
   * 设备分页查询
   * 增加在分页条件里面
   * @param {*} type 
   */
  getDeviceList(type = 'init') {
    getDeviceListApi(this.data.pageObj).then(res => {
      res.data.rows.forEach((item) => {
        item.icon = item.serialNumber && item.serialNumber.includes('GFKM-') ? 'wifi_icon.png' : '4G_icon.png'
      })
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
    let _this = this
    let {
      runningstate,
      serialnumber
    } = e?.currentTarget.dataset
    // "runningState": "1",（0未激活 1运行中 2已停止）
    if (runningstate === '1') {
      wx.navigateTo({
        url: `/pages/device-use/device-use?deviceId=${serialnumber}`,
      });
      return
    }
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        const {
          result
        } = res;
        if (result) {
          if (serialnumber === result) {
            // 扫码成功
            _this.sanStartDevice(result)
          } else {
            Message.error({
              context: this,
              offset: [90, 32],
              duration: 1500,
              content: '请扫码对应的设备二维码！',
            });
          }
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
  // 扫码先掉接口确定
  sanStartDevice(serialNumber) {
    sanStartDeviceApi(serialNumber).then(res => {
      if (res.code === 200) {
        if (res.data) {
          wx.navigateTo({
            url: `/pages/device-active/device-active?deviceId=${serialNumber}`,
          });
        } else {
          Message.warning({
            context: this,
            offset: [90, 32],
            duration: 3000,
            content: '您暂无使用点数，请联系管理员！',
          });
        }
      }
    })
  },
  // 去往使用记录
  goHistoryInfo(e) {
    let {
      serialnumber
    } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/use-history/use-history?serialNumber=${serialnumber}`,
    });
  },
  // 设备激活
  getDeviceActivated() {
    let {
      deptId
    } = this.data.pageObj
    // $TODO 设备激活数量记录接口对接
    getDeviceActivatedApi(deptId).then(res => {
      if (res.code === 200) {
        this.setData({
          historyList: res.data
        })
      }
    })
  },
  addDevice() {
    wx.navigateTo({
      url: `/pages/blufi-network/blufi-network?deptId=${this.data.pageObj.deptId}`,
    });
  }
})