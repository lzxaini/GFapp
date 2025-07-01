const app = getApp()
const dayjs = require('dayjs')
import {
  getVisitorListApi
} from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.capsuleHeight,
    visitorList: [],
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setTabBar();
    // 加载缓存
    const mobile = wx.getStorageSync('mobile') || '';
    this.setData({
      mobile,
    })
  },
  // 设置tabBar
  setTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getVisitorList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let pageNum = ++this.data.pageObj.pageNum
    this.setData({
      'pageObj.pageNum': pageNum
    })
    this.getVisitorList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  /** 查询列表 */
  getVisitorList() {
    getVisitorListApi({ ...this.data.pageObj, mobile: this.data.mobile }).then(res => {
      if (res.code === 200) {
        let list = res.rows.map(item => {
          return {
            ...item,
            validStartTime: dayjs(item.validStart).format('MM月DD日 HH点'),
            validEndTime: dayjs(item.validEnd).format('MM月DD日 HH点')
          };
        })
        this.setData({
          visitorList: list
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
      this.setData({
        refresher: false
      })
    }).catch(err => {
      console.log("🥵 ~ getVisitorListApi ~ err: ", err)
      wx.showToast({
        title: '查询失败',
        icon: 'none'
      });
      this.setData({
        refresher: false
      })
    });
  },
  goDetail(e) {
    const { info } = e?.currentTarget?.dataset;
    wx.navigateTo({
      url: '/pages/detail/detail?data=' + JSON.stringify(info),
    })
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getVisitorList()
  }
})