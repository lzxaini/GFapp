import {
  showMessage
} from '../../utils/tools';
const app = getApp()
import {
  activetionDeviceApi,
  getUserInfoApi,
  sanStartDeviceApi
} from '../../api/api.js'
import drawQrcode from '../../utils/weapp.qrcode.min'
import tool from '../../utils/tools'
import {
  withLogin
} from '../../utils/auth';
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    marginBottom: app.globalData.marginBottom,
    appName: app.globalData.appName,
    ossUrl: app.globalData.ossUrl,
    qrCodeBox: false,
    qrFlag: false,
    userInfo: app.globalData.userInfo,
    hasApprovalPermission: false, // 是否有审批权限
    cardList: [{
        title: '团队管理',
        icon: 'my_1.png',
        url: '/pages/team-list/team-list'
      }, {
        title: '设备管理',
        icon: 'my_2.png',
        url: '/pages/device-list/device-list'
      }, {
        title: '运营管理',
        icon: 'my_3.png',
        url: '/pages/operation/operation'
      }, {
        title: '能量充值',
        icon: 'my_6.png',
        url: '/pages/recharge/recharge'
      }, {
        title: '使用指南',
        icon: 'my_4.png',
        url: '/pages/usage-guide/usage-guide'
      },
      // {
      //   title: '加入审批',
      //   icon: 'my_7.png',
      //   url: '/pages/join-approval/join-approval'
      // }, 
      {
        title: '设置',
        icon: 'my_5.png',
        url: '/pages/my-edit/my-edit'
      }
    ],
    // title + deptType 映射更高权限的页面
    adminRouteMap: {
      '团队管理': {
        1: '/pages/admin-team/admin-team',
        2: '/pages/agent-team-members/agent-team-members',
        3: '/pages/agent-team-list/agent-team-list',
      },
      '设备管理': {
        1: '/pages/agent-device-list/agent-device-list',
        2: '/pages/agent-device/agent-device',
        3: '/pages/store-device/store-device'
      }
    },
    isLogin: false
  },
  onLoad() {
    // 游客模式
    this.openQrCode = withLogin(this, this._openQrCode);
    this.scanCodeActivation = withLogin(this, this._scanCodeActivation);
    this.goListItem = withLogin(this, this._goListItem);
    this.goRechargeHistory = withLogin(this, this._goRechargeHistory);
    this.goWhiteList = withLogin(this, this._goWhiteList);
    this.goServiceHistory = withLogin(this, this._goServiceHistory);
    this.goLoginFlag = withLogin(this, this._goLoginFlag);
  },
  onShow() {
    console.log('小程序版本', this.data.appName.appVersion)
    if (app.globalData.token) {
      app.getUserInfo(getUserInfoApi).then(res => {
        if (res) {
          this.setData({
            userInfo: res,
            // hasApprovalPermission: this.checkApprovalPermission(res)
          });
        }
      })
    }
  },

  // 检查是否有审批权限
  checkApprovalPermission(userInfo) {
    if (!userInfo || !userInfo.roles || userInfo.roles.length === 0) {
      return false;
    }
    const roleKey = userInfo.roles[0].roleKey;
    const approvalRoles = ['develop', 'customerService', 'admin', 'admin01', 'founder'];
    return approvalRoles.includes(roleKey);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  _scanCodeActivation() {
    if (this.verifyDept()) {
      return
    }
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        const {
          result
        } = res;
        if (result) {
          // 扫码成功
          this.sanStartDevice(result)
        } else {
          wx.showToast({
            title: '扫描失败！',
            icon: 'error'
          });
        }
      },
      fail: () => {}
    });
  },
  // 扫码先掉接口确定
  sanStartDevice(serialNumber) {
    sanStartDeviceApi(serialNumber).then(res => {
      if (res.code === 200) {
        if (res.data) {
          this.activetionDevice(serialNumber)
        } else {
          this.message('warning', '您暂无使用次数，请联系管理员！', 3000);
        }
      }
    })
  },
  // 激活设备
  activetionDevice(serialNumber) {
    activetionDeviceApi(serialNumber).then(res => {
      if (res.code === 24003) { // 已绑定，到激活设备页面
        return wx.navigateTo({
          url: `/pages/device-active/device-active?deviceId=${serialNumber}`,
        });
      }
      if (res.data.length < 1) { // 到激活设备页面
        return wx.navigateTo({
          url: `/pages/device-active/device-active?deviceId=${serialNumber}`,
        });
      }
      if (res.data.length > 0) { // 到绑定页面
        if (serialNumber.indexOf("GFKM-") != -1) { // WiFi模块
          return wx.navigateTo({
            url: `/pages/device-status/device-status?deviceId=${serialNumber}`,
          })
        } else { // 4G模块
          return wx.navigateTo({
            url: `/pages/device-bind/device-bind?deviceId=${serialNumber}`,
          });
        }
      }
    })
  },
  drawUserQrcode() {
    let _this = this;
    drawQrcode({
      width: 240,
      height: 240,
      canvasId: 'myQrcode',
      text: this.data.userInfo.userId,
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
  _openQrCode() {
    this.setData({
      qrCodeBox: true
    })
    if (this.data.qrCodeBox) {
      this.drawUserQrcode()
    }
  },
  // 保存邀请码
  saveQrCode: tool.debounce(function () {
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
  closeDialog() {
    this.setData({
      qrCodeBox: false,
      qrFlag: false
    })
  },
  // 团队管理
  _goListItem(e) {
    const {
      title,
      url
    } = e.currentTarget.dataset;
    this.navigateByTitle({
      title,
      url
    });
  },
  _goRechargeHistory() {
    this.navigateByTitle({
      title: '充值记录',
      url: '/pages/recharge-history/recharge-history'
    });
  },
  _goServiceHistory() {
    this.navigateByTitle({
      title: '服务记录',
      url: '/pages/service-history/service-history'
    });
  },
  _goWhiteList() {
    this.navigateByTitle({
      title: '白名单',
      url: '/pages/white-list/white-list'
    });
  },
  goLogin() {
    wx.reLaunch({
      url: '/pages/login/login',
    });
  },
  _goLoginFlag() {
    console.log('点击名字区域')
  },
  closeIsLoginDialog() {
    this.setData({
      isLogin: false
    });
  },
  // 公共跳转方法
  navigateByTitle({
    title,
    url
  }) {
    const {
      dept
    } = this.data.userInfo || {};
    if (title === '设置') {
      return wx.navigateTo({
        url
      });
    }

    if (this.verifyDept()) return;

    const deptType = dept?.deptType;
    const adminMap = this.data.adminRouteMap[title];
    let finalUrl = adminMap?.[deptType] || url

    if (deptType == 2 || deptType == 3) {
      finalUrl = adminMap?.[deptType] ? `${adminMap?.[deptType]}?deptInfo=${JSON.stringify(dept)}` : url
    }

    if (finalUrl) {
      wx.navigateTo({
        url: finalUrl
      });
    } else {
      this.message('info', '该功能暂未开放');
    }
  },
  verifyDept() {
    const {
      dept
    } = this.data.userInfo || {};
    if (!dept) {
      this.message('warning', '游客账号暂时无法使用，请联系管理员！');
      return true;
    }
    return false;
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})