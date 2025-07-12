import { getDeviceInfoApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    serialNumber: '',
    historyList: []
  },
  onLoad(options) {
    let { serialNumber } = options
    this.setData({ serialNumber })
  },
  tabClick(e) {
    const value = e.detail.value;
    this.setData({
      activeValue: value
    });
  },
  // 设备使用记录
  getDeviceInfo() {
    // $TODO 设备使用记录接口对接
    getDeviceInfoApi(this.data.serialNumber).then(res => {
      this.setData({ historyList: res.data })
    })
  }
})