import Message from 'tdesign-miniprogram/message/index';
const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl
  },
  goChangePassword() {
    wx.navigateTo({
      url: '/pages/change-password/change-password',
    })
  },
  // 上传头像
  updateAvatar() {
    let _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.globalData.baseUrl + '/system/user/profile/avatar',
          filePath: tempFilePath,
          header: {
            'Authorization': app.globalData.token
          },
          name: 'avatarfile',
          success: (res) => {
            if (res.statusCode === 200) {
              try {
                let data = JSON.parse(res.data)
                this.setData({
                  'userInfo.avatar': data.imgUrl
                })
                _this.message('success', '用户头像上传成功')
              } catch (error) {
                _this.message('error', `系统错误：${error}`, 3000)
              }
            }
          },
          fail: (err) => {
          }
        });
      },
      fail: () => {
        _this.message('error', '未选择图片', 1500)
      }
    });
  },
  message(type, text, duration = 1500) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: duration,
      content: text,
    });
  }
})