import Message from 'tdesign-miniprogram/message/index';
import {
  getWechatUserInfoFun,
  userLoginApi,
  getUserInfoApi,
  getCaptchaImageApi
} from '../../api/api.js'
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.capsuleHeight,
    checkFlag: false,
    showConfirm: false,
  },
  onLoad() {
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
    this.setData({ showConfirm: false });
    if (e.detail.code) {
      console.log(e.detail.code) // 动态令牌
      console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
      console.log(e.detail.errno) // 错误码（失败时返回）
      this.weixinLogin(e.detail.code)
    } else {
      this.messageBox('warning', '用户取消授权，登录失败！', 1500)
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
          getWechatUserInfoFun(params).then(res => {
            if (res.code === 200) {
              wx.setStorageSync('userInfo', JSON.stringify(res.data))
              _this.messageBox('success', '登录成功，正在加载...', 1500)
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/register/register',
                })
              }, 1500);
            } else {
              _this.messageBox('error', res.msg, 3000)
            }
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
  // 去往协议
  goPrivacyAgreement() {
    wx.navigateTo({
      url: '/pages/privacy-agreement/privacy-agreement',
    });
  },
  agreementChange(e) {
    let { checked } = e.detail
    this.setData({
      checkFlag: checked
    })
  },
  closeDialog() {
    this.setData({ showConfirm: false });
  }
});