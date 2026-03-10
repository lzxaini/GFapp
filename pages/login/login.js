import Message from 'tdesign-miniprogram/message/index';
import {
  getWechatUserInfoApi,
  getUserInfoApi,
} from '../../api/api.js'
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    checkFlag: false,
    showConfirm: false,
    bgFlag: false, // 背景图
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
            url: '/pages/index/index',
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
              _this.messageBox('success', '登录成功，正在加载...', 1500)
              let infoFlag = await app.getUserInfo(getUserInfoApi);
              if (infoFlag) {
                app.initMqtt()
                setTimeout(() => {
                  if (adminFlag) {
                    wx.reLaunch({
                      url: '/pages/index/index',
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
      url: '/other/privacy-agreement/privacy-agreement',
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
  goIndex(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
});