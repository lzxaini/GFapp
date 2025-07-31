import Message from 'tdesign-miniprogram/message/index';
import {
  getAdminDeviceListApi
} from '../../api/api'
const dayjs = require('dayjs')
const app = getApp()
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    calendarVisible: false,
    calendarValue: [],
    minDate: dayjs().subtract(1, 'month').valueOf(),
    defaultValue: dayjs().format('YYYY-MM-DD'),
    tabsValue: 1,
    serviceList: [], // 服务记录
    rechargeList: [], // 充值记录
    serviceTotal: 0, // 服务条数
    rechargeTotal: 0, // 充值条数
    refresher: false,
    servicePageObj: { // 服务记录分页参数
      pageNum: 1,
      pageSize: 10
    },
    rechargePageObj: { // 充值记录分页参数
      pageNum: 1,
      pageSize: 10
    },
    searchValue: '', // 搜索
    serviceForm: { // 服务日期区间
      minServiceTime: '',
      maxServiceTime: ''
    },
    rechargeForm: { // 充值日期区间
      minRechargeTime: '',
      maxRechargeTime: ''
    }
  },
  onShow() {
    this.getAdminDeviceList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let {
      tabsValue,
      serviceList,
      total
    } = this.data
    console.log('触底', tabsValue) // 确定是哪个触底的就加载哪个列表
    if (serviceList.length < total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getAdminDeviceList('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getAdminDeviceList()
  },
  tabClick(e) {
    let {
      value
    } = e?.detail
    this.setData({
      tabsValue: value
    })
  },
  /**
   * 设备分页查询
   * 增加在分页条件里面
   * @param {*} type 
   */
  getAdminDeviceList(type = 'init') {
    getAdminDeviceListApi(this.data.pageObj).then(res => {
      if (type === 'bottom') {
        if (res.data.depts.rows.length > 0) {
          let list = this.data.deviceList
          list.push(...res.data.depts.rows)
          this.setData({
            deviceInfo: res.data,
            deviceList: list
          })
        }
      } else {
        this.setData({
          deviceInfo: res.data,
          deviceList: res.data.depts.rows,
          total: res.data.depts.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  },
  searchInput(e) {
    let {
      value
    } = e?.detail
    this.setData({
      searchValue: value
    })
  },
  searchAll() {
    this.setData({
      calendarValue: [],
      'serviceForm.minServiceTime': '',
      'serviceForm.maxServiceTime': '',
      'rechargeForm.minRechargeTime': '',
      'rechargeForm.maxRechargeTime': '',
    });
  },
  statrtSearch() {
    let {
      serviceForm,
      rechargeForm,
      searchValue,
      tabsValue
    } = this.data
    console.log('搜索', serviceForm, rechargeForm, searchValue, tabsValue)
    if (tabsValue === 1) {
      let params = {
        ...rechargeForm,
        searchValue
      }
      console.log('搜索1', params)
    } else {
      let params = {
        ...serviceForm,
        searchValue
      }
      console.log('搜索2', params)
    }
  },
  handleCalendar() {
    this.setData({
      calendarVisible: true
    });
  },
  handleConfirm(e) {
    console.log(e.detail.value);
    const {
      value
    } = e.detail;
    if (value.length !== 2) {
      return
    }
    let {
      tabsValue
    } = this.data
    let date1 = dayjs(value[0]).format('YYYY-MM-DD');
    let date2 = dayjs(value[1]).format('YYYY-MM-DD');
    this.setData({
      calendarValue: [date1, date2],
    });
    if (tabsValue === 1) {
      this.setData({
        'rechargeForm.minRechargeTime': date1,
        'rechargeForm.maxRechargeTime': date2,
      });
    } else {
      this.setData({
        'serviceForm.minServiceTime': date1,
        'serviceForm.maxServiceTime': date2,
      });
    }
    this.statrtSearch()
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