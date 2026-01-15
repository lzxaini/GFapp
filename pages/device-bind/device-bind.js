import {
  activetionDeviceApi,
  deviceBindApi
} from '../../api/api.js'
import Message from 'tdesign-miniprogram/message/index';
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    bindList: [],
    originalBindList: [], // 缓存原始数据
    bindId: '',
    serialNumber: ''
  },
  onLoad(option) {
    let { deviceId } = option
    this.setData({ serialNumber: deviceId })
    this.activetionDevice(deviceId)
  },
  searchChange(e) {
    let { value } = e?.detail
    let { originalBindList, bindList } = this.data
    // 输入为空还原原始数据
    if (!value) {
      this.setData({ bindList: originalBindList })
      return;
    }
    // 支持模糊搜索
    let search = (originalBindList.length ? originalBindList : bindList).filter(item => item.deptName && item.deptName.indexOf(value) > -1)
    this.setData({ bindList: search })
  },
  // 激活设备
  activetionDevice(serialNumber) {
    activetionDeviceApi(serialNumber).then(res => {
      this.setData({
        bindList: res.data,
        originalBindList: res.data // 缓存原始数据
      })
    })
  },
  bindChange(e) {
    let { value } = e?.detail
    this.setData({ bindId: value })
  },
  noBind() {
    // wx.switchTab({
    //   url: '/pages/my/my'
    // });
    wx.navigateBack(1)
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