import { getDeviceListApi, getDeviceActivatedApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    deviceList: []
  },
  onShow() {
    this.getDeviceList()
  },
  // 设备列表
  getDeviceList() {
    // $TODO 设备列表接口对接
    getDeviceListApi().then(res => {
      this.setData({ deviceList: res.data.rows })
    })
  },
  scanCodeActivation(e) {
    let { runningState } = e?.currentTarget.dataset
    // "runningState": "1",（0未激活 1已停止 2运行中）
    if (runningState === '2') { // $TODO 待完善，点击列表，判断设备是否在使用中，是的话，带上deviceId去使用页面
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
    let { serialNumber } = e?.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/use-history/use-history?serialNumber=${serialNumber}`,
    });
  },
  // 设备激活
  getDeviceActivated() {
    // $TODO 设备激活数量记录接口对接
    getDeviceActivatedApi(this.data.teamId).then(res => {
      this.setData({ historyList: res.data })
    })
  }
})