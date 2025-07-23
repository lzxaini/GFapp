import Message from 'tdesign-miniprogram/message/index';
import { registerUserInfoApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    logoutVisible: false,
    confirmBtn: { content: '确定', variant: 'base' },
    form: {
      avatar: '',
      userName: '',
      phonenumber: ''
    },
    userNameError: '',
  },
  onLoad() {
    let { userName, avatar, phonenumber, nickName, email } = app.globalData.userInfo
    this.setData({
      'form.avatar': avatar,
      'form.email': email,
      'form.nickName': nickName,
      'form.userName': userName,
      'form.phonenumber': phonenumber,
    })
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
                  'form.avatar': data.imgUrl
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
  onNameInput(e) {
    let { value } = e?.detail
    this.setData({
      'form.userName': value
    })
  },
  verify() {
    let { form } = this.data
    let userNameError = ''
    // 新密码长度校验
    if (!form.userName) {
      userNameError = '请输入用户名称！'
    } else {
      userNameError = ''
    }
    this.setData({
      userNameError: userNameError
    })
    return !userNameError
  },
  onSubmit() {
    // $BUG 这里貌似有问题，提交修改个人信息的上海，如果不带上手机号，手机号等会被更新为null
    let _this = this
    if (!this.verify()) return;
    let { form } = this.data
    registerUserInfoApi(form).then(res => {
      wx.showLoading({
        title: '正在加载...',
        mask: true,
      });
      if (res.code === 200) {
        _this.message('success', '修改成功！', 1500)
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index'
          });
          wx.hideLoading();
        }, 1000);
      } else {
        _this.message('error', res.msg, 3000)
      }
    })
  },
  LogoutDialog() {
    this.setData({ logoutVisible: !this.data.logoutVisible })
  },
  logout() {
    app.logout()
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