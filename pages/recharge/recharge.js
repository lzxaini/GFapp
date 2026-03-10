import {
  showMessage
} from '../../utils/tools';
import {
  getDeptListInfoApi,
  getDeptPointsApi,
  getRechargeRecordsApi,
  rechargeApi
} from '../../api/api'
const dayjs = require('dayjs')
const app = getApp()
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    searchDeptName: '',
    teamVisible: false,
    form: {
      deptId: '',
      deptName: '',
      rechargeAmount: '',
    },
    tableData: [],
    total: 0,
    refresher: false,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
    },
    points: {}, // 点数相关
  },
  onShow() {
    this.getDeptListInfo()
    this.getRechargeRecords()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let {
      tabsValue,
      tableData,
    } = this.data
    console.log('触底', tabsValue) // 确定是哪个触底的就加载哪个列表
    if (tableData.length < total) {
      let pageNum = ++this.data.pageObj.pageNum
      this.setData({
        'pageObj.pageNum': pageNum
      })
      this.getRechargeRecords('bottom')
    }
  },
  pullDownToRefresh() {
    this.setData({
      'pageObj.pageNum': 1
    })
    this.getRechargeRecords()
  },

  /**
   * 充值记录分页查询
   * 增加在分页条件里面
   * @param {*} type 
   */
  getRechargeRecords(type = 'init') {
    let {
      pageObj,
      tableData
    } = this.data
    getRechargeRecordsApi(pageObj).then(res => {
      if (type === 'bottom') {
        if (res.data.rows.length > 0) {
          let list = tableData
          list.push(...res.data.rows)
          this.setData({
            tableData: list
          })
        }
      } else {
        this.setData({
          tableData: res.data.rows,
          total: res.data.total
        })
      }
      this.getDeptPoints()
      this.setData({
        refresher: false
      })
    })
  },
  // 点击空白关闭 team_list
  onTeamListMask() {
    this.setData({
      teamVisible: false
    });
  },
  // 清空部门输入框
  clearInput() {
    this.setData({
      'pageObj.deptId': '',
      'form.deptId': ''
    });
    this.getRechargeRecords()
  },
  // 获取部门
  getDeptListInfo() {
    getDeptListInfoApi({
      deptName: this.data.searchDeptName
    }).then(res => {
      console.log('测试', res.data)
      if (res.code === 200) {
        this.setData({
          teamList: res.data
        })
      }
    })
  },
  showTeamList() {
    let flag = !this.data.teamVisible
    this.setData({
      searchDeptName: '',
      teamVisible: flag
    })
    this.getDeptListInfo()
  },
  // 选中部门团队（实时搜索列表）
  onSelectTeam(e) {
    const {
      id,
      name
    } = e.currentTarget.dataset;
    this.setData({
      'form.deptId': id,
      'pageObj.deptId': id,
      'form.deptName': name,
      teamVisible: false,
    });
    this.getRechargeRecords()
  },
  // blur() {
  //   this.setData({
  //     teamVisible: false
  //   })
  // },
  // 输入充值数量
  onInput(e) {
    let {
      value
    } = e?.detail
    this.setData({
      'form.rechargeAmount': value
    })
  },
  // 输入部门
  onInputDeptName(e) {
    let {
      value
    } = e?.detail
    this.setData({
      'pageObj.deptId': '',
      'searchDeptName': value,
      teamVisible: true
    })
    this.getDeptListInfo()
    this.getRechargeRecords()
  },
  // 充值
  submit() {
    const {
      deptId,
      deptName,
      rechargeAmount
    } = this.data.form;
    if (!deptId || !deptName) {
      this.message('warning', '请选择要充值的团队！');
      return;
    }
    if (!rechargeAmount || isNaN(rechargeAmount) || Number(rechargeAmount) <= 0) {
      this.message('warning', '请输入正确的充值点数！');
      return;
    }
    console.log('this.data.form', this.data.form)
    rechargeApi(this.data.form).then(res => {
      console.log('res', res)
      if (res.code === 200) {
        this.message('success', `充值成功，充值点数 ${this.data.form.rechargeAmount} 点！`, 2000);
        this.getRechargeRecords()
        this.setData({
          'pageObj.deptId': '',
          form: {
            deptId: '',
            deptName: '',
            rechargeAmount: '',
          }
        })
      }
    })
  },
  getDeptPoints() {
    let {
      deptId
    } = this.data.form
    if (!deptId) {
      return
    }
    getDeptPointsApi(deptId).then(res => {
      console.log('res', res)
      if (res.code === 200) {
        this.setData({
          points: res.data
        })
      }
    })
  },
  // 去新增部门页面
  goAddDept(){
    wx.navigateTo({
      url: '/other/add-dept/add-dept',
    })
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})