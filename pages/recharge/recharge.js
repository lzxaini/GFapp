import {
  showMessage
} from '../../utils/tools';
import {
  getDeptListInfoApi,
  getServiceRecordsApi,
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
    }
  },
  // 点击空白关闭 team_list
  onTeamListMask() {
    this.setData({ teamVisible: false });
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
      rechargeList,
    } = this.data
    console.log('触底', tabsValue) // 确定是哪个触底的就加载哪个列表
    if (rechargeList.length < total) {
      let pageNum = ++this.data.rechargePageObj.pageNum
      this.setData({
        'rechargePageObj.pageNum': pageNum
      })
      this.getRechargeRecords('bottom')
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
      teamVisible: flag
    })
  },
  // 选中部门团队（实时搜索列表）
  onSelectTeam(e) {
    const {
      id,
      name
    } = e.currentTarget.dataset;
    this.setData({
      'form.deptId': id,
      'form.deptName': name,
      teamVisible: false
    });
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
      'searchDeptName': value,
      teamVisible: true
    })
    this.getDeptListInfo()
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
    console.log('this.data.form',this.data.form)
    return
    rechargeApi(this.data.form).then(res => {
      console.log('res', res)
    })
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})