import tabService from '../../utils/tab-service';
import {
  showMessage
} from '../../utils/tools';
const dayjs = require('dayjs')
const app = getApp()
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    userInfo: getApp().globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    searchFlag: false
  },
  onLoad() {
    this.getRegion()
  },
  onShow() {
    //更新底部高亮
    tabService.updateIndex(this, 1)
    let userInfo = getApp().globalData.userInfo
    if (!userInfo) return
    this.setData({
      userInfo,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
  },
  pullDownToRefresh() {
  },
  searchClick(){
    this.setData({
      searchFlag: true
    })
  },
  blurClick(){
    this.setData({
      searchFlag: false
    })
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})