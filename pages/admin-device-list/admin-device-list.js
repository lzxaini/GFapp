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
  },
  onShow() {
    this.getDeviceList()
    this.getDeviceActivated()
  },
  // 设备列表
  getDeviceList() {
    // $TODO 设备列表接口对接
    getDeviceListApi().then(res => {
      this.setData({ deviceList: res.data.rows })
    })
  },
  scanCodeActivation(e) {
    let { runningstate } = e?.currentTarget.dataset
    // "runningState": "1",（0未激活 1已停止 2运行中）
    if (runningstate === '2') { // $TODO 待完善，点击列表，判断设备是否在使用中，是的话，带上deviceId去使用页面
      wx.navigateTo({
        url: `/pages/device-use/device-use?deviceId=${deviceId}`,
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