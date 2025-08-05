import { showMessage } from '../../utils/tools';
import {
  getOperationApi,
  getServiceRecordsApi,
  getRechargeRecordsApi
} from '../../api/api'
import {
  getServiceNameByCode
} from '../../utils/config'
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
    },
    operationInfo: {}
  },
  onShow() {
    this.getOperation()
    this.getRechargeRecords()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let {
      tabsValue,
      serviceList,
      rechargeList,
      rechargeTotal,
      serviceTotal
    } = this.data
    console.log('触底', tabsValue) // 确定是哪个触底的就加载哪个列表
    if (tabsValue === 1) {
      if (rechargeList.length < total) {
        let pageNum = ++this.data.rechargePageObj.pageNum
        this.setData({
          'rechargePageObj.pageNum': pageNum
        })
        this.getRechargeRecords('bottom')
      }
    } else {
      if (serviceList.length < total) {
        let pageNum = ++this.data.servicePageObj.pageNum
        this.setData({
          'servicePageObj.pageNum': pageNum
        })
        this.getServiceRecords('bottom')
      }
    }
  },
  pullDownToRefresh() {
    let {
      tabsValue,
    } = this.data
    if (tabsValue === 1) {
      this.setData({
        'rechargePageObj.pageNum': 1
      })
      this.getRechargeRecords()
    } else {
      this.setData({
        'servicePageObj.pageNum': 1
      })
      this.getServiceRecords()
    }
  },
  tabClick(e) {
    let {
      value
    } = e?.detail
    this.setData({
      tabsValue: value
    })
    this.searchAll()
    if (value === 1) {
      this.getRechargeRecords()
    } else {
      this.getServiceRecords()
    }
  },

  /**
   * 充值记录分页查询
   * 增加在分页条件里面
   * @param {*} type 
   */
  getRechargeRecords(type = 'init') {
    let {
      rechargePageObj,
      rechargeList
    } = this.data
    getRechargeRecordsApi(rechargePageObj).then(res => {
      if (type === 'bottom') {
        if (res.data.rows.length > 0) {
          let list = rechargeList
          list.push(...res.data.rows)
          this.setData({
            rechargeList: list
          })
        }
      } else {
        this.setData({
          rechargeList: res.data.rows,
          rechargeTotal: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  },
  /**
   * 充值记录分页查询
   * 增加在分页条件里面
   * @param {*} type 
   */
  getServiceRecords(type = 'init') {
    let {
      servicePageObj,
      serviceList
    } = this.data
    getServiceRecordsApi(servicePageObj).then(res => {
      // 拿到原始 rows
      const rows = res.data.rows.map(item => ({
        ...item,
        serviceObj: getServiceNameByCode(item.service)
      }))
      if (type === 'bottom') {
        if (rows.length > 0) {
          let list = serviceList
          list.push(...rows)
          this.setData({
            serviceList: list
          })
        }
      } else {
        this.setData({
          serviceList: rows,
          serviceTotal: res.data.total
        })
      }
      this.setData({
        refresher: false
      })
    })
  },
  // 获取顶部运营数据
  getOperation() {
    getOperationApi().then(res => {
      console.log('测试实施', res)
      if (res.code === 200) {
        this.setData({
          operationInfo: res.data
        })
      }
    })
  },
  searchInput(e) {
    let {
      value
    } = e?.detail
    this.setData({
      searchValue: value
    })
    // this.statrtSearch()
  },
  searchAll() {
    this.setData({
      calendarValue: [],
      'serviceForm.minServiceTime': '',
      'serviceForm.maxServiceTime': '',
      'rechargeForm.minRechargeTime': '',
      'rechargeForm.maxRechargeTime': '',
      searchValue: '',
    });
  },
  statrtSearch() {
    let {
      serviceForm,
      rechargeForm,
      searchValue,
      tabsValue,
      servicePageObj,
      rechargePageObj
    } = this.data
    let pageObj = { // 默认分页
      pageNum: 1,
      pageSize: 10,
    }
    console.log('搜索', serviceForm, rechargeForm, searchValue, tabsValue)
    if (tabsValue === 1) {
      let params = {
        ...pageObj,
        searchValue,
        ...rechargeForm,
      }
      this.setData({
        rechargePageObj: params
      })
      console.log('搜索1', params)
      this.getRechargeRecords()
    } else {
      let params = {
        ...pageObj,
        searchValue,
        ...serviceForm,
      }
      this.setData({
        servicePageObj: params
      })
      console.log('搜索2', params)
      this.getServiceRecords()
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
    showMessage(type, text, duration, this);
  }
})