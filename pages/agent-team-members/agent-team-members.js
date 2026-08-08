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
    teamTab: 3, // 默认团队tab
    teamObj: {},
    displayList: [],
    loadingMore: false,
    pageObj: {
      3: { pageNum: 1, hasMore: true },
      4: { pageNum: 1, hasMore: true },
    },
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
  onShow() {
    this.getAdminTeamListDrillDown()
  },
  getAdminTeamListDrillDown() {
    let {
      deptData
    } = this.data
    getAdminTeamListDrillDownApi(deptData.deptId).then(res => {
      if (res.code === 200) {
        // res.data = {3:[], 4:[]} 一次性返回全部子部门，前端做分页切片
        const teamObj = res.data || {}
        this.setData({
          refresher: false,
          teamObj,
          pageObj: {
            3: { pageNum: 1, hasMore: this.hasMore(teamObj[3]) },
            4: { pageNum: 1, hasMore: this.hasMore(teamObj[4]) },
          }
        })
        // 如果当前 tab 没有数据，切到有数据的第一个 tab
        const currentList = teamObj[this.data.teamTab]
        const firstAvailable = [3, 4].find(k => teamObj[k]?.length > 0) || 3
        this.setData({
          teamTab: currentList ? this.data.teamTab : firstAvailable
        })
        this.computeDisplayList(this.data.teamTab, true)
      } else {
        this.setData({ refresher: false })
        wx.showToast({ title: '获取团队列表失败', icon: 'error' })
      }
    })
  },

  // 计算当前 tab 的展示列表（前端分页切片）
  computeDisplayList(tab, reset) {
    const { teamObj, pageObj } = this.data
    const fullList = teamObj[tab] || []
    const curPage = (reset || !pageObj[tab]) ? 1 : pageObj[tab].pageNum
    const { pageSize } = this.data
    const end = curPage * pageSize
    const slice = fullList.slice(0, end)

    const pagePath = `pageObj[${tab}]`
    this.setData({
      displayList: slice,
      loadingMore: false,
      [`${pagePath}.pageNum`]: curPage,
      [`${pagePath}.hasMore`]: end < fullList.length,
    })
  },

  hasMore(list) {
    const { pageSize } = this.data
    return list ? list.length > pageSize : false
  },

  // 触底加载更多
  onScrollToLower() {
    const { teamTab, pageObj, loadingMore } = this.data
    const cur = pageObj[teamTab]
    if (!cur || loadingMore || !cur.hasMore) return
    this.setData({ loadingMore: true })
    this.setData({ [`pageObj[${teamTab}].pageNum`]: cur.pageNum + 1 })
    this.computeDisplayList(teamTab)
  },

  tabClick(e) {
    let { value } = e?.detail
    this.setData({ teamTab: value })
    this.computeDisplayList(value, true)
  },
  goNext(e) {
    let {
      item
    } = e?.currentTarget?.dataset
    let {
      teamTab
    } = this.data
    switch (teamTab) {
      case 3:
        wx.navigateTo({
          url: `/pages/agent-team-list/agent-team-list?deptInfo=${JSON.stringify(item)}`,
        });
        break
      case 4:
        wx.navigateTo({
          url: `/pages/store-team-members/store-team-members?deptInfo=${JSON.stringify(item)}`,
        });
        break
    }
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