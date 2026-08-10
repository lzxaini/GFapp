import {
  activetionDeviceApi,
  deviceBindApi
} from '../../api/api.js'
import Message from 'tdesign-miniprogram/message/index';
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    bindList: [],           // 原始全量数据（兼容旧逻辑）
    originalBindList: [],   // 缓存原始全量数据
    displayList: [],        // 当前页展示列表（前端分页切片）
    searchValue: '',        // 搜索关键字
    pageSize: 20,
    pageNum: 1,
    hasMore: true,
    loadingMore: false,
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
    this.setData({ searchValue: value || '' })
    this.computeDisplayList(true)
  },
  // 激活设备
  activetionDevice(serialNumber) {
    activetionDeviceApi(serialNumber).then(res => {
      this.setData({
        bindList: res.data,
        originalBindList: res.data || [] // 缓存原始全量数据
      })
      this.computeDisplayList(true)
    })
  },
  // 计算当前展示列表（前端分页切片，兼容搜索过滤）
  computeDisplayList(reset) {
    const { originalBindList, searchValue, pageSize, pageNum } = this.data
    // 基于搜索关键字过滤全量数据
    const keyword = (searchValue || '').trim()
    const fullList = keyword
      ? (originalBindList || []).filter(item => item.deptName && item.deptName.indexOf(keyword) > -1)
      : (originalBindList || [])
    const curPage = reset ? 1 : pageNum
    const end = curPage * pageSize
    const slice = fullList.slice(0, end)
    this.setData({
      displayList: slice,
      pageNum: curPage,
      hasMore: end < fullList.length,
      loadingMore: false,
    })
  },
  // 触底加载更多
  onScrollToLower() {
    const { loadingMore, hasMore, pageNum } = this.data
    if (loadingMore || !hasMore) return
    this.setData({ loadingMore: true, pageNum: pageNum + 1 })
    this.computeDisplayList(false)
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