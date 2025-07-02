import drawQrcode from '../../utils/weapp.qrcode.min'
Page({
  data: {
    qrCodeBox: false
  },
  onShow() {
    // this.drawUserQrcode()
  },
  backClick() {
    wx.navigateBack({
      delta: 1
    });
  },
  drawUserQrcode() {
    drawQrcode({
      width: 240,
      height: 240,
      canvasId: 'myQrcode',
      text: '123',
      // v1.0.0+版本支持在二维码上绘制图片
      image: {
        imageResource: '../../static/icon/team_1.png', // 不支持网络图片，如果非得网络图片，需要使用wx.getImageInfo 去获取图片信息，我这边往中间加的一个白图然后采用覆盖的方式
        dx: 100,
        dy: 100,
        dWidth: 37,
        dHeight: 37
      }
    })
  },
  inviteJoin() {
    this.setData({
      qrCodeBox: true
    })
    if (this.data.qrCodeBox) {
      this.drawUserQrcode()
    }
  },
  closeDialog() {
    this.setData({
      qrCodeBox: false
    })
  }
})