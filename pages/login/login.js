import Message from 'tdesign-miniprogram/message/index';
import {
  getWechatUserInfoFun,
  userLoginApi,
  getUserInfoApi,
  getCaptchaImageApi
} from '../../api/api.js'
const imageCdn = 'https://cdn.fxnws.com/beasun/banner';
const swiperList = [
  `${imageCdn}/index1.png`,
  `${imageCdn}/index2.png`,
  `${imageCdn}/index3.png`,
  `${imageCdn}/index4.png`,
  `${imageCdn}/index5.png`,
];
const app = getApp()
Page({
  data: {
    statusBarHeight: app.globalData.capsuleHeight,
    current: 0,
    autoplay: false,
    duration: 500,
    interval: 5000,
    swiperList,
    phoneError: false,
    checkFlag: false,
    showConfirm: false,
    // 新
    mobile: '15888888888', // 手机号
    password: 'admin123456',
    code: '',
    verify: {
      uuid: '',
      img: ''
    }
  },
  onLoad() {
    this.getCaptchaImage()
  },
  onChange(e) {
    const {
      detail: {
        current,
        source
      },
    } = e;
    console.log(current, source);
  },
  goBeasun() {
    if (this.data.phoneError || !this.data.mobile) {
      wx.showToast({
        icon: 'none',
        title: '请填写正确的手机号码',
      });
      return;
    }
    if (!this.data.checkFlag) {
      this.setData({
        showConfirm: true
      });
      return;
    }
    // 缓存手机号
    wx.setStorageSync('mobile', this.data.mobile);
    wx.reLaunch({
      url: '/pages/index/index'
    })
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
                  url: '/pages/index/index',
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
  submitDialog() {
    this.setData({
      checkFlag: true,
      showConfirm: false
    });
    this.goBeasun()
  },
  closeDialog() {
    this.setData({ showConfirm: false });
  },
  /*** 新 */
  onPhoneInput(e) {
    const { value } = e?.detail;
    // 手机号格式校验
    const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号码',
      });
      this.setData({
        phoneError: true,
      });
      return;
    }
    this.setData({
      mobile: value,
      phoneError: false,
    });
  },
  onPassword(e) {
    const { value } = e?.detail;
    this.setData({
      password: value,
    });
  },
  onCode(e) {
    const { value } = e?.detail;
    this.setData({
      code: value,
    });
  },
  getCaptchaImage() {
    getCaptchaImageApi().then(res => {
      console.log("🥵 ~ getCaptchaImageApi ~ res: ", res)
      this.setData({
        'verify.uuid': res.uuid,
        'verify.img': 'data:image/gif;base64,' + res.img
      })
    })
  },
  submitLogin() {
    console.log('测试', this.data.mobile, this.data.password)
    let params = {
      username: this.data.mobile,
      password: this.data.password,
      code: this.data.code,
      uuid: this.data.verify.uuid,
    }
    userLoginApi(params).then(res => {
      console.log("🥵 ~ userLoginApi ~ res: ", res)
      // 缓存Token
      wx.setStorageSync('token', res.token);
      app.getUserInfo(getUserInfoApi)
      wx.reLaunch({
        url: '/pages/index/index'
      });
    })
  }
});