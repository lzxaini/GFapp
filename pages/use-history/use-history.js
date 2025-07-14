import { getDeviceInfoApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    serialNumber: '',
    historyList: []
  },
  onLoad(options) {
    let { serialNumber } = options
    console.log("🥵 ~ onLoad ~ serialNumber: ", options)
    this.setData({ serialNumber })
  },
  onShow() {
    this.getDeviceInfo()
  },
  tabClick(e) {
    const value = e.detail.value;
    this.setData({
      activeValue: value
    });
  },
  // 设备使用记录
  getDeviceUseList() {
    // $TODO 设备使用记录接口对接
    // getDeviceInfoApi(this.data.serialNumber).then(res => {
    //   this.setData({ historyList: res.data })
    // })
  }
})