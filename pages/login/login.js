import Message from 'tdesign-miniprogram/message/index';
import {
  getWechatUserInfoApi,
  getUserInfoApi,
  userLoginApi
} from '../../api/api.js'
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: app.globalData.capsuleHeight,
    checkFlag: false,
    showConfirm: false,
    bgFlag: false, // 背景图
    from: {
      phoneNumber: '',
      password: ''
    },
    phoneNumberError: '',
    passwordError: '',
    passwordFlag: false,
  },
  onLoad() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  login() {
    // app.initMqtt() // 测试
    if (!this.data.checkFlag) {
      this.setData({
        showConfirm: true
      });
      return;
    }
  },
  // 获取手机号
  getPhoneNumber(e) {
    console.log("🥵 ~ getPhoneNumber ~ e: ", e)
    this.setData({
      showConfirm: false
    });
    if (e.detail.code) {
      console.log(e.detail.code) // 动态令牌
      console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
      console.log(e.detail.errno) // 错误码（失败时返回）
      this.weixinLogin(e.detail.code)
    } else {
      // this.messageBox('warning', '用户取消授权，登录失败！', 1500)
      Message.warning({
        context: this,
        offset: ['180rpx', 32],
        content: '用户取消授权，登录失败！',
        duration: -1,
        link: {
          content: '去首页',
          navigatorProps: {
            url: '/pages/my/my',
            openType: 'switchTab',
          },
        },
        closeBtn: true,
      });
    }
  },
  weixinLogin(phoneCode) {
    let _this = this
    wx.login({
      success(res) {
        console.log('调用微信登录', res)
        if (res.code) {
          //发起网络请求
          let params = {
            tokenCode: res.code,
            phoneCode,
          }
          getWechatUserInfoApi(params).then(async (res) => {
            wx.showLoading({
              title: '正在加载...',
              mask: true,
            });
            _this.userLoginInfo(res)
          }).catch(err => {
            _this.messageBox('error', '登录失败！', 3000)
            console.log('登录失败！' + res.errMsg)
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  messageBox(type = 'info', content, duration = 1500) {
    Message[type]({
      context: this,
      offset: ['180rpx', '32rpx'],
      duration: duration,
      content: content,
      closeBtn: true,
    });
  },
  async userLoginInfo(res) {
    if (res.code === 200) {
      let {
        adminFlag,
        token,
        mobile,
        openId,
        nickname
      } = res.data
      app.globalData.token = `Bearer ${token}`
      wx.setStorageSync('token', `Bearer ${token}`)
      wx.setStorageSync('wechat', JSON.stringify({
        mobile,
        openId,
        nickname
      }))
      this.messageBox('success', '登录成功，正在加载...', 1500)
      let infoFlag = await app.getUserInfo(getUserInfoApi);
      if (infoFlag) {
        app.initMqtt()
        setTimeout(() => {
          if (adminFlag) {
            wx.switchTab({
              url: '/pages/my/my',
            })
          } else {
            wx.reLaunch({
              url: '/pages/register/register',
            })
          }
          wx.hideLoading();
        }, 1000);
      }
    } else {
      this.messageBox('error', res.msg, 3000)
    }
  },
  // 去往协议
  goPrivacyAgreement() {
    wx.navigateTo({
      url: '/pages/privacy-agreement/privacy-agreement',
    });
  },
  agreementChange(e) {
    let {
      checked
    } = e.detail
    this.setData({
      checkFlag: checked
    })
  },
  closeDialog() {
    this.setData({
      showConfirm: false
    });
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  // 校验方法
  verify() {
    const {
      from
    } = this.data;
    let phoneNumberError = '';
    let passwordError = '';
    // 手机号校验
    if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(from.phoneNumber)) {
      phoneNumberError = '请输入正确的手机号';
    }
    if (!from.password || from.password == '') {
      passwordError = '请输入您的账号密码';
    }
    this.setData({
      phoneNumberError,
      passwordError
    });
    // 返回校验是否通过
    return !phoneNumberError && !passwordError;
  },
  onInput(e) {
    let {
      type
    } = e?.currentTarget?.dataset
    let {
      value
    } = e?.detail
    switch (type) {
      case 'phoneNumber':
        this.setData({
          'from.phoneNumber': value
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
  passwordFlag(e) {
    this.setData({
      'passwordFlag': !this.data.passwordFlag
    })
  },
  async onSubmit() {
    if (!this.verify()) return;
    if (!this.data.checkFlag) {
      return this.messageBox('warning', '请先阅读同意用户协议和隐私政策！', 3000)
    }
    let {
      from
    } = this.data
    console.log('测试', from)
    let res = await userLoginApi({
      username: from.phoneNumber,
      password: from.password
    })
    this.userLoginInfo(res)
  },
});