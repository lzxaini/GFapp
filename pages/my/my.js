import tabService from '../../utils/tab-service';
import {
  showMessage
} from '../../utils/tools';
import {
  withLogin
} from '../../utils/auth';
import {
  getUserInfoApi,
} from '../../api/api.js'
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
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = getApp().globalData.userInfo;
    if (userInfo) {
      tabService.updateRole(this, userInfo.dept.deptType)
      console.log('options', tabService, userInfo)
    } else{
      tabService.updateRole(this, '4')
    }
    wx.switchTab({
      url: '/pages/my/my'
    })

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
      url: '/pages/recharge-history/recharge-history'
    });
  },
  _goServiceHistory() {
    this.navigateByTitle({
      title: '服务记录',
      url: '/pages/service-history/service-history'
    });
  },
  _goSystem() {
    this.navigateByTitle({
      title: '白名单',
      url: '/pages/my-edit/my-edit'
    });
  },
  _addDept(){
  },
  _goMyDept(){
    if (this.data.userInfo.dept.deptType == 1) {
      this.navigateByTitle({
        title: '新建团队',
        url: '/pages/add-dept/add-dept'
      });
    } else {
      this.navigateByTitle({
        title: '我的团队',
        url: '/pages/team-list/team-list'
      });
    }
  },
  goLogin() {
    wx.reLaunch({
      url: '/pages/login/login',
    });
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
})