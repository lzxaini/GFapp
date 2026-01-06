import {
  showMessage
} from '../../utils/tools';
import {
  registerUserInfoApi
} from '../../api/api'
const app = getApp()
Page({
  data: {
    userInfo: getApp().globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    logoutVisible: false,
    confirmBtn: {
      content: '确定',
      variant: 'base'
    },
    form: {
      avatar: '',
      userName: '',
      phonenumber: ''
    },
    userNameError: '',
    userId: ''
  },
  // userId 不足8位前面补0
  padUserId(userId) {
    userId = String(userId || '');
    return userId.padStart(8, '0');
  },
  onLoad(options) {
    let {
      userName,
      avatar,
      phonenumber,
      nickName,
      email,
      userId
    } = getApp().globalData.userInfo
    this.setData({
      userId: this.padUserId(userId),
      'form.avatar': avatar,
      'form.email': email,
      'form.nickName': nickName,
      'form.userName': userName,
      'form.phonenumber': phonenumber,
      userInfo: getApp().globalData.userInfo
    })
  },
  goChangePassword() {
    wx.navigateTo({
      url: '/other/change-password/change-password',
    })
  },
  // 上传头像
  updateAvatar() {
    let _this = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
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
                _this.setData({
                  'form.avatar': data.imgUrl
                })
                _this.message('success', '用户头像上传成功')
              } catch (error) {
                _this.message('error', `系统错误：${error}`, 3000)
              }
            }
          },
          fail: (err) => {}
        });
      },
      fail: () => {
        _this.message('error', '未选择图片', 1500)
      }
    });
  },
  onNameInput(e) {
    let {
      value
    } = e?.detail
    this.setData({
      'form.userName': value
    })
  },
  verify() {
    let {
      form
    } = this.data
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
    let {
      form
    } = this.data
    registerUserInfoApi(form).then(res => {
      wx.showLoading({
        title: '正在加载...',
        mask: true,
      });
      if (res.code === 200) {
        _this.message('success', '修改成功！', 1500)
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/my/my'
          });
          wx.hideLoading();
        }, 1000);
      } else {
        _this.message('error', res.msg, 3000)
      }
    })
  },
  LogoutDialog() {
    this.setData({
      logoutVisible: !this.data.logoutVisible
    })
  },
  logout() {
    app.logout()
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  },
  goSearchTeam() {
    wx.navigateTo({
      url: '/other/search-page/search-page'
    });
  }
})