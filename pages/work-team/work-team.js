import drawQrcode from '../../utils/weapp.qrcode.min'
import tool from '../../utils/tools'
import { getMyTeamsApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    qrCodeBox: false,
    qrFlag: false,
    editFlag: false,
    id: '',
    teamInfo: null, // 团队详情
  },
  onLoad(options) {
    let { editFlag, id } = options
    this.setData({ editFlag: editFlag === 'admin' ? true : false, id })
  },
  onShow() {
    this.getMyTeams()
  },
  backClick() {
    wx.navigateBack({
      delta: 1
    });
  },
  drawUserQrcode() {
    let _this = this;
    drawQrcode({
      width: 240,
      height: 240,
      canvasId: 'myQrcode',
      text: _this.data.teamInfo.teamCode,
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
  // 邀请加入
  inviteJoin() {
    this.setData({
      qrCodeBox: true
    })
    if (this.data.qrCodeBox) {
      this.drawUserQrcode()
    }
  },
  // 保存邀请码
  saveInviteCode: tool.debounce(function () {
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
  getMyTeams() {
    getMyTeamsApi(this.data.id).then(res => {
      // $TODO 我的团队接口对接
      this.setData({ teamInfo: res.data })
    })
  },
  goMember() {
    wx.navigateTo({
      url: '/pages/team-members/team-members'
    })
  },
  closeDialog() {
    this.setData({
      qrCodeBox: false,
      qrFlag: false
    })
  },
  // 编辑团队
  editTeam() {
    wx.navigateTo({
      url: `/pages/team-info/team-info?id=${this.data.id}`
    })
  },
  // 加入申请
  joinApplication() {
    wx.navigateTo({
      url: '/pages/team-search/team-search'
    })
  }
})