import {
  getAdminTeamListDrillDownApi
} from '../../api/api'
import drawQrcode from '../../utils/weapp.qrcode.min'
import tool from '../../utils/tools'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    pageSize: 20,
    refresher: false,
    teamList: [],      // 全量数据（门店）
    displayList: [],   // 前端分页展示列表
    pageNum: 1,
    hasMore: true,
    loadingMore: false,
    deptData: {},
    tabsValue: 1, // 1: 团队成员, 2: 团队设备
  },
  onLoad(options) {
    let {
      deptInfo
    } = options
    let deptData = JSON.parse(deptInfo)
    this.setData({
      deptData
    })
    this.getAdminTeamListDrillDown()
  },
  onShow(){
    this.getAdminTeamListDrillDown()
  },
  getAdminTeamListDrillDown() {
    let {
      deptData
    } = this.data
    getAdminTeamListDrillDownApi(deptData.deptId).then(res => {
      if (res.code === 200) {
        // res.data = {4:[], ...} 一次性返回全部子部门，前端做分页切片
        const teamList = res.data[4] || []
        this.setData({
          refresher: false,
          teamList,
          pageNum: 1,
          hasMore: teamList.length > this.data.pageSize,
        })
        this.computeDisplayList()
      } else {
        this.setData({ refresher: false })
        wx.showToast({ title: '获取团队列表失败', icon: 'error' })
      }
    })
  },

  // 计算展示列表（前端分页切片）
  computeDisplayList() {
    const { teamList, pageNum, pageSize } = this.data
    const end = pageNum * pageSize
    this.setData({
      displayList: teamList.slice(0, end),
      loadingMore: false,
      hasMore: end < teamList.length,
    })
  },

  // 触底加载更多
  onScrollToLower() {
    const { loadingMore, hasMore, pageNum } = this.data
    if (loadingMore || !hasMore) return
    this.setData({ loadingMore: true, pageNum: pageNum + 1 })
    this.computeDisplayList()
  },
  goNext(e) {
    let {
      item
    } = e?.currentTarget?.dataset
    wx.navigateTo({
      url: `/pages/store-team-members/store-team-members?deptInfo=${JSON.stringify(item)}`,
    });
  },
  goEditDept() {
    let {
      deptData
    } = this.data
    wx.navigateTo({
      url: '/other/change-department/change-department?deptData=' + JSON.stringify(deptData),
    })
  },
  
  drawUserQrcode() {
    let _this = this;
    drawQrcode({
      width: 240,
      height: 240,
      canvasId: 'myQrcode',
      text: `dept-${this.data.deptData.deptId}`,
      // v1.0.0+版本支持在二维码上绘制图片
      image: {
        imageResource: '../../static/icon/gf_logo_w.png', // 不支持网络图片，如果非得网络图片，需要使用wx.getImageInfo 去获取图片信息，我这边往中间加的一个白图然后采用覆盖的方式
        dx: 100,
        dy: 100,
        dWidth: 50,
        dHeight: 50
      }
    })
    setTimeout(() => {
      _this.setData({
        qrFlag: true
      })
    }, 500);
  },
  // 邀请
  inviteBtn() {
    this.setData({
      qrCodeBox: true
    })
    if (this.data.qrCodeBox) {
      this.drawUserQrcode()
    }
  },
  // 保存邀请码
  saveQrCode: tool.debounce(function () {
    let _this = this;
    wx.canvasToTempFilePath({
      canvasId: 'myQrcode',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            })
            _this.closeDialog()
          },
          fail(err) {
            console.error('保存失败', err)
          }
        })
      },
      fail(err) {
        console.error('生成二维码失败', err)
      }
    })
  }, 800),
  closeDialog() {
    this.setData({
      qrCodeBox: false,
      qrFlag: false
    })
  },
})