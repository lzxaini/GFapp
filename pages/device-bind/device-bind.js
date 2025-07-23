import {
  activetionDeviceApi,
  deviceBindApi
} from '../../api/api.js'
import Message from 'tdesign-miniprogram/message/index';
Page({
  data: {
    bindList: [],
    bindId: '',
    serialNumber: ''
  },
  onLoad(option) {
    let { deviceId } = option
    this.setData({ serialNumber: deviceId })
    this.activetionDevice(deviceId)
  },
  // searchChange(e) {
  //   let { value } = e?.detail
  //   let { bindList } = this.data
  //   let search = bindList.filter(item => item.name === value)
  //   this.setData({ bindList: search })
  // },
  // 激活设备
  activetionDevice(serialNumber) {
    activetionDeviceApi(serialNumber).then(res => {
      this.setData({
        bindList: res.data
      })
    })
  },
  bindChange(e) {
    let { value } = e?.detail
    this.setData({ bindId: value })
  },
  noBind() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },
  onSubmit() {
    if (!this.data.bindId) {
      return Message.warning({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '请先选择要绑定的团队',
      });
    }
    let { bindId, serialNumber } = this.data
    deviceBindApi(bindId, serialNumber).then(res => {
      console.log("🥵 ~ deviceBindApi ~ res: ", res)
      Message.success({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '设备绑定成功！',
      });
       setTimeout(() => {
        this.noBind()
       }, 1500);
    })
  }
})