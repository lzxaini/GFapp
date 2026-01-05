import tabService from '../../utils/tab-service';
import {
  showMessage
} from '../../utils/tools';
import {
  withLogin
} from '../../utils/auth';
import {
  getUserInfoApi,
  getDeptUserApi
} from '../../api/api.js'
import drawQrcode from '../../utils/weapp.qrcode.min'
import tool from '../../utils/tools'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: getApp().globalData.userInfo,
    capsuleHeight: app.globalData.capsuleHeight,
    marginBottom: app.globalData.marginBottom,
    appName: app.globalData.appName,
    ossUrl: app.globalData.ossUrl,
    isLogin: false,
    deptUserList: [], // 部门用户列表
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = getApp().globalData.userInfo;
    if (userInfo) {
      tabService.updateRole(this, userInfo.dept.deptType)
      console.log('options', tabService, userInfo)
    } else {
      tabService.updateRole(this, '4')
    }
    wx.switchTab({
      url: '/pages/my/my'
    })

    this.openQrCode = withLogin(this, this._openQrCode);
    this.goRechargeHistory = withLogin(this, this._goRechargeHistory);
    this.goSystem = withLogin(this, this._goSystem);
    this.goServiceHistory = withLogin(this, this._goServiceHistory);
    // this.addDept = withLogin(this, this._addDept);
    this.goMyDept = withLogin(this, this._goMyDept);
    this.goLoginFlag = withLogin(this, this._goLoginFlag);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
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
      this.getDeptUser()
    }
    //更新底部高亮
    tabService.updateIndex(this, 3)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  },
  _goLoginFlag() {
    console.log('点击名字区域')
  },
  _goRechargeHistory() {
    this.navigateByTitle({
      title: '支付记录',
      url: '/other/recharge-history/recharge-history'
    });
  },
  _goServiceHistory() {
    this.navigateByTitle({
      title: '服务记录',
      url: '/other/service-history/service-history'
    });
  },
  _goSystem() {
    this.navigateByTitle({
      title: '白名单',
      url: '/other/my-edit/my-edit'
    });
  },
  _addDept() {},
  _goMyDept() {
    if (this.data.userInfo.dept.deptType == 1) {
      this.navigateByTitle({
        title: '新建团队',
        url: '/other/add-dept/add-dept'
      });
    } else {
      this.navigateByTitle({
        title: '我的团队',
        url: '/other/team-list/team-list'
      });
    }
  },
  goLogin() {
    wx.reLaunch({
      url: '/pages/login/login',
    });
  },
  // 管理员前往团队
  goDeptInfo() {
    if (this.verifyDept()) return;

    const {
      dept
    } = this.data.userInfo || {};
    const deptType = dept?.deptType;
    const adminMap = this.data.adminRouteMap['团队管理'];
    let finalUrl = adminMap?.[deptType]

    if (deptType == 2 || deptType == 3) {
      finalUrl = adminMap?.[deptType] ? `${adminMap?.[deptType]}?deptInfo=${JSON.stringify(dept)}` : url
    }

    if (finalUrl) {
      console.log('finalUrl', adminMap, finalUrl)
      wx.navigateTo({
        url: finalUrl
      });
    } else {
      this.message('info', '该功能暂未开放');
    }
  },
  // 公共跳转方法
  navigateByTitle({
    title,
    url
  }) {
    if (title === '设置') {
      return wx.navigateTo({
        url
      });
    }

    if (this.verifyDept()) return;
    wx.navigateTo({
      url
    });
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
  closeIsLoginDialog() {
    this.setData({
      isLogin: false
    });
  },
  drawUserQrcode() {
    let _this = this;
    drawQrcode({
      width: 240,
      height: 240,
      canvasId: 'myQrcode',
      text: this.data.userInfo.deptId,
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
  getDeptUser() {
    let {
      dept
    } = this.data.userInfo
    getDeptUserApi(dept.deptId).then(res => {
      if (res.code === 200) {
        this.setData({
          deptUserList: res.data
        })
      }
    })
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
  // 去开发模式
  goDevPage(){
    wx.navigateTo({
      url: '/development/index/index',
    })
  }
})