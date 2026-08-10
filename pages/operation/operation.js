import {
  showMessage
} from '../../utils/tools';
import {
  getOperationApi,
  getServiceSessionListApi,
  getRechargeRecordsApi,
  getRegionApi,
  getSessionDetailApi
} from '../../api/api'
import {
  getServiceNameByCode,
  getDeviceStatusIconByCode
} from '../../utils/config'
const dayjs = require('dayjs')
const app = getApp()
// 默认日期区间：最近30天
const DEFAULT_START = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
const DEFAULT_END = dayjs().format('YYYY-MM-DD')
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    calendarVisible: false,
    // 默认显示最近30天；日期可任意选择历史日期，区间跨度由 handleConfirm 限制为不超过30天
    calendarValue: [DEFAULT_START, DEFAULT_END],
    minDate: dayjs('2020-01-01').valueOf(), // 允许选择任意历史日期
    maxDate: dayjs().valueOf(),             // 最晚今天
    defaultValue: [DEFAULT_START, DEFAULT_END],
    tabsValue: 1,
    serviceList: [], // 服务记录
    rechargeList: [], // 充值记录
    serviceTotal: 0, // 服务条数
    rechargeTotal: 0, // 充值条数
    refresher: false,
    servicePageObj: { // 服务记录分页参数（默认最近30天）
      pageNum: 1,
      pageSize: 10,
      minServiceTime: DEFAULT_START,
      maxServiceTime: DEFAULT_END
    },
    rechargePageObj: { // 充值记录分页参数（默认最近30天）
      pageNum: 1,
      pageSize: 10,
      minRechargeTime: DEFAULT_START,
      maxRechargeTime: DEFAULT_END
    },
    searchValue: '', // 搜索
    serviceForm: { // 服务日期区间（默认最近30天）
      minServiceTime: DEFAULT_START,
      maxServiceTime: DEFAULT_END
    },
    rechargeForm: { // 充值日期区间（默认最近30天）
      minRechargeTime: DEFAULT_START,
      maxRechargeTime: DEFAULT_END
    },
    operationInfo: {},
    addressVisible: false, // 省市区组件
    addressOptions: [], // 省市区列表
    addressValue: '', // 组件值
    addressValue: '', // 用于展示
  },
  onLoad() {
    this.getRegion()
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
    if (tabsValue === 1) {
      if (rechargeList.length < rechargeTotal) {
        let pageNum = ++this.data.rechargePageObj.pageNum
        this.setData({
          'rechargePageObj.pageNum': pageNum
        })
        this.getRechargeRecords('bottom')
      }
    } else {
      if (serviceList.length < serviceTotal) {
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
    const { calendarValue } = this.data
    // 切 tab 保留当前日期区间；若为空则兜底为最近30天，保证日期显示不消失、默认传值不丢失
    const start = (calendarValue && calendarValue[0]) || DEFAULT_START
    const end = (calendarValue && calendarValue[1]) || DEFAULT_END
    const update = {
      tabsValue: value,
      calendarValue: [start, end], // 强制保证日期区间有值，wxml 显示不消失
    }
    if (value === 1) {
      update['rechargeForm.minRechargeTime'] = start
      update['rechargeForm.maxRechargeTime'] = end
    } else {
      update['serviceForm.minServiceTime'] = start
      update['serviceForm.maxServiceTime'] = end
    }
    this.setData(update)
    this.statrtSearch()
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
    getServiceSessionListApi(servicePageObj).then(res => {
      // 拿到原始 rows
      const rows = res.data.rows.map(item => ({
        ...item,
        serviceObj: getServiceNameByCode(item.service),
        statusIcon: getDeviceStatusIconByCode(item.status)
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
  
  /**
   * 查询项目详情，返回项目名称字符串（如 "项目1/项目2/项目3"）
   * @param {*} sessionId 会话ID
   * @returns {Promise<string>} 项目名称拼接的字符串
   */
  getProjectDetail(e) {
    const sessionId = e.currentTarget.dataset.sessionid
    const index = e.currentTarget.dataset.index
    // 加载项目，项目1/项目2/项目3
    getSessionDetailApi(sessionId).then(res => {
      // 遍历所有子详情，提取项目名称
      const projectNames = res.data.map(detail => {
        const serviceObj = getServiceNameByCode(detail.service)
        return serviceObj ? serviceObj.name : ''
      }).filter(name => name) // 过滤掉未匹配到的空名称
      // return projectNames.join('/')
      this.setData({
        [`serviceList[${index}].projectNames`]: projectNames.join('/')
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
    let {
      tabsValue,
      rechargeForm
    } = this.data
    this.setData({
      calendarValue: [],
      'serviceForm.minServiceTime': '',
      'serviceForm.maxServiceTime': '',
      'rechargeForm.minRechargeTime': '',
      'rechargeForm.maxRechargeTime': '',
      searchValue: '',
      servicePageObj: { // 服务记录分页参数
        pageNum: 1,
        pageSize: 10
      },
      rechargePageObj: { // 分页参数
        pageNum: 1,
        pageSize: 10
      },
    });
    console.log('rechargeForm', rechargeForm)
    if (tabsValue === 1) {
      this.getRechargeRecords()
    } else {
      this.getServiceRecords()
    }
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
    // 兜底校验：区间跨度不得超过30天
    const diffDays = dayjs(date2).diff(dayjs(date1), 'day');
    if (diffDays < 0 || diffDays > 30) {
      wx.showToast({ title: '选择区间不能超过30天', icon: 'none' });
      return;
    }
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
  showCascader() {
    this.setData({
      addressVisible: true
    });
  },
  onChange(e) {
    const {
      selectedOptions,
      value
    } = e.detail;
    let {
      tabsValue
    } = this.data
    console.log('value', value, selectedOptions)
    let address = selectedOptions.map((item) => item.label).join('/')
    console.log('address', address)
    if (tabsValue === 1) {
      this.setData({
        'rechargeForm.address': address,
      });
    } else {
      this.setData({
        'serviceForm.address': address,
      });
    }
    this.statrtSearch()
  },
  getRegion() {
    getRegionApi().then(res => {
      const addressOptions = res.data || [];
      this.setData({
        addressOptions
      });
    })
  },
  /**
   * 展开/折叠会话详情
   */
  toggleSessionDetail(e) {
    const sessionId = e.currentTarget.dataset.sessionid
    const index = e.currentTarget.dataset.index
    const item = this.data.serviceList[index]
    
    // 如果已经展开，则折叠
    if (item.expanded) {
      this.setData({
        [`serviceList[${index}].expanded`]: false,
        [`serviceList[${index}].details`]: []
      })
      return
    }
    
    // 加载详情数据
    getSessionDetailApi(sessionId).then(res => {
      const details = res.data.map(detail => ({
        ...detail,
        serviceObj: getServiceNameByCode(detail.service),
        statusIcon: getDeviceStatusIconByCode(detail.status)
      }))
      this.setData({
        [`serviceList[${index}].expanded`]: true,
        [`serviceList[${index}].details`]: details
      })
    })
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})