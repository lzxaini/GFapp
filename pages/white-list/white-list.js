import Message from 'tdesign-miniprogram/message/index';
import { getWhitelistApi, getUserInfoQrCodeApi, addwhiteListApi } from '../../api/api'
import { getFrequencyNameByCode, getWhiteStatusIconByCode } from '../../utils/config'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    whiteList: [],
    qrCodeUserInfo: {},
    whiteBox: false,
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
    },
    whiteForm: {
      frequency: 0, // （0今天 1每天 9累计）、
      freeTimes: 1, // 次数
    }
  },
  onShow() {
    let { dept } = app.globalData.userInfo
    if (dept.deptType != 1) {
      this.setData({
        'pageObj.deptId': dept.deptId
      })
    }
    this.getWhitelist()
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom() {
    console.log('触底',)
    let { whiteList, total } = this.data
    if (whiteList.length < total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getWhitelist('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getWhitelist()
  },
  tabClick(e) {
    const value = e.detail.value;
    this.setData({
      'pageObj.range': value
    });
    this.getWhitelist()
  },
  /**
    * 频率，1：当天（今天），2：每天，3：每周，4：每月，5：每年
    * 运行状态：0：待使用，1：已过期，2：已核销
   * @param {*} type 
   */
  getWhitelist(type = 'init') {
    getWhitelistApi(this.data.pageObj).then(res => {
      // 拿到原始 rows
      const rows = res.data.rows.map(item => ({
        ...item,
        frequencyName: getFrequencyNameByCode(item.frequency),
        statusIcon: getWhiteStatusIconByCode(item.status)
      }))
      if (type === 'bottom') {
        if (rows.length > 0) {
          let list = this.data.whiteList
          list.push(...rows)
          this.setData({
            whiteList: list
          })
        }
      } else {
        this.setData({
          whiteList: rows,
          total: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  },
  scanCode() {
    let _this = this
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        const { result } = res;
        if (result) {
          // 扫码成功
          _this.getUserInfoQrCode(result)
        } else {
          this.messageBox('error', '扫描二维码失败，请稍后再试！');
        }
      },
      fail: () => {
        this.messageBox('error', '扫描二维码失败，请稍后再试！');
      }
    });
  },
  // 扫码用户二维码或群用户信息
  getUserInfoQrCode(result) {
    getUserInfoQrCodeApi(result).then(res => {
      if (res.code === 200) {
        this.setData({
          qrCodeUserInfo: res.data,
          whiteBox: true,
        })
      } else {
        this.messageBox('error', '获取用户信息失败，请稍后再试！');
      }
    })
  },
  clickData(e) {
    let { frequency } = e?.currentTarget.dataset
    this.setData({
      'whiteForm.frequency': frequency,
    })
  },
  onNumberInput(e) {
    let { value } = e?.detail
    if (value < 1) {
      value = 1
    }
    this.setData({
      'whiteForm.freeTimes': value,
    })
  },
  clickFreeTimes(e) {
    let { type } = e?.currentTarget.dataset
    if (type === 'plus') {
      this.setData({
        'whiteForm.freeTimes': this.data.whiteForm.freeTimes + 1,
      })
    } else {
      if (this.data.whiteForm.freeTimes <= 1) {
        return
      }
      this.setData({
        'whiteForm.freeTimes': this.data.whiteForm.freeTimes - 1,
      })
    }
  },
  addWhite() {
    addwhiteListApi(this.data.whiteForm).then(res => {
      if (res.code === 200) {
        this.messageBox('success', '添加白名单成功！');
        this.setData({
          whiteBox: false,
          'pageObj.pageNum': 1
        })
        this.getWhitelist()
      } else {
        this.messageBox('error', '添加白名单失败，请稍后再试！');
      }
    })
  },
  closeDialog() {
    this.setData({
      whiteBox: false,
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
})