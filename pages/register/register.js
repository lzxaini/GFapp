import Message from 'tdesign-miniprogram/message/index';
import { registerUserInfoApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    from: {
      avatar: '',
      userName: '',
      password: ''
    },
    new1: '',
    phonenumber: '',
    userNameError: '',
    new1Error: '',
    passwordError: '',
    new1Flag: false,
    passwordFlag: false,
  },
  onLoad() {
    let { userName, phonenumber } = app.globalData.userInfo
    this.setData({
      'from.userName': userName,
      'phonenumber': phonenumber
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
                console.log("🥵 ~ updateAvatar ~ data: ", data)
                this.setData({
                  'from.avatar': data.imgUrl
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
  onInput(e) {
    let { value } = e?.detail
    this.setData({
      'from.userName': value
    })
  },
  verifyOnInput() {
    let { from } = this.data
    // 新密码长度校验
    if (!from.userName) {
      userNameError = '请输入用户名称！';
    }
  },
  onPasswordInput(e) {
    let { type } = e?.currentTarget?.dataset
    let { value } = e?.detail
    switch (type) {
      case 'new1':
        this.setData({
          'new1': value
        })
        break
      case 'password':
        this.setData({
          'from.password': value
        })
        break
      default:
        break
    }
  },
  noSubmit() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onSubmit() {
    let _this = this
    if (!this.verify()) return;
    let { from } = this.data
    registerUserInfoApi(from).then(res => {
      wx.showLoading({
        title: '正在加载...',
        mask: true,
      });
      if (res.code === 200) {
        _this.message('error', '注册成功！', 1500)
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
  // 校验方法
  verify() {
    const { from, new1 } = this.data;
    let new1Error = '';
    let passwordError = '';
    // 新密码长度校验
    if (!new1 || new1.length < 8) {
      new1Error = '新密码不能少于8位';
    } else if (!/[A-Za-z]/.test(new1) || !/[0-9]/.test(new1)) {
      // 必须包含字母和数字
      new1Error = '新密码需包含字母和数字';
    }
    // 两次新密码一致性校验
    if (new1 !== from.password) {
      passwordError = '两次输入的新密码不一致';
    }
    this.setData({
      new1Error,
      passwordError
    });
    // 返回校验是否通过
    return !new1Error && !passwordError;
  },
  passwordFlag(e) {
    let { type, flag } = e?.currentTarget?.dataset
    let { value } = e?.detail
    switch (type) {
      case 'new1':
        this.setData({
          'new1Flag': !flag
        })
        break
      case 'password':
        this.setData({
          'passwordFlag': !flag
        })
        break
      default:
        break
    }
  },
  goBack() {
    wx.navigateBack({
      delta: 1
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