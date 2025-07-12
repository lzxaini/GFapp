
import { getDeviceListApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    deviceList: []
  },
  // 设备列表
  getDeviceList() {
    // $TODO 设备列表接口对接
    getDeviceListApi().then(res => {
      this.setData({ deviceList: res.data })
    })
  },
  scanCodeActivation(e) {
    console.log("🥵 ~ scanCodeActivation ~ e: ", e)
    let { item } = e?.currentTarget.dataset
    if (item === 'use') { // $TODO 待完善，点击列表，判断设备是否在使用中，是的话，带上deviceId去使用页面
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
  goHistoryInfo() {
    wx.navigateTo({
      url: '/pages/use-history/use-history',
    });
  }
})