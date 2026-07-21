import {
  showMessage
} from '../../utils/tools';
import {
  getDeptListInfoApi,
  getDeptPointsApi,
  getRechargeRecordsApi,
  rechargeApi
} from '../../api/api'
const app = getApp()
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    userInfo: app.globalData.userInfo,
    ossUrl: app.globalData.ossUrl,
    searchDeptName: '',
    teamVisible: false,
    teamList: [],
    teamTotal: 0,
    teamLoading: false,
    teamPageObj: {
      pageNum: 1,
      pageSize: 20,
    },
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
    this.getRechargeRecords()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const { tableData, total } = this.data
    if (tableData.length < total) {
      const pageNum = this.data.pageObj.pageNum + 1
      this.setData({ 'pageObj.pageNum': pageNum })
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
    const { pageObj, tableData } = this.data
    getRechargeRecordsApi(pageObj).then(res => {
      const { rows, total } = res.data || {}
      if (type === 'bottom') {
        if (rows && rows.length > 0) {
          this.setData({
            tableData: [...tableData, ...rows]
          })
        }
      } else {
        this.setData({
          tableData: rows || [],
          total: total || 0
        })
      }
      this.getDeptPoints()
      this.setData({ refresher: false })
    })
  },
  // 关闭团队列表弹窗
  closeTeamList() {
    this.setData({ teamVisible: false });
  },
  // popup 显隐变化
  onTeamVisibleChange(e) {
    if (!e.detail.visible) {
      this.setData({ teamVisible: false });
    }
  },
  // 清空部门输入框
  clearInput() {
    this.setData({
      'pageObj.deptId': '',
      'form.deptId': ''
    });
    this.getRechargeRecords()
  },
  // 获取团队列表（分页模式）
  getDeptListInfo(type = 'init') {
    const { teamPageObj, teamList, searchDeptName } = this.data
    this.setData({ teamLoading: true })
    getDeptListInfoApi({
      pageNum: teamPageObj.pageNum,
      pageSize: teamPageObj.pageSize,
      deptName: searchDeptName
    }).then(res => {
      if (res.code === 200) {
        const { rows, total } = res.data || {}
        if (type === 'bottom') {
          this.setData({
            teamList: [...teamList, ...(rows || [])],
            teamTotal: total || 0
          })
        } else {
          this.setData({
            teamList: rows || [],
            teamTotal: total || 0
          })
        }
      }
    }).finally(() => {
      this.setData({ teamLoading: false })
    })
  },
  // 团队列表滚动触底加载更多
  onTeamListScrollToLower() {
    const { teamPageObj, teamList, teamTotal, teamLoading } = this.data
    if (teamLoading || teamList.length >= teamTotal) return
    this.setData({
      'teamPageObj.pageNum': teamPageObj.pageNum + 1
    })
    this.getDeptListInfo('bottom')
  },
  // 搜索团队
  onTeamSearch(e) {
    this.setData({
      searchDeptName: e.detail.value,
      'teamPageObj.pageNum': 1
    })
    this.getDeptListInfo()
  },
  // 清空搜索
  onTeamSearchClear() {
    this.setData({
      searchDeptName: '',
      'teamPageObj.pageNum': 1
    })
    this.getDeptListInfo()
  },
  onTeamSearchConfirm(e) {
    this.setData({
      searchDeptName: e.detail.value,
      'teamPageObj.pageNum': 1
    })
    this.getDeptListInfo()
  },
  // 打开团队列表弹窗
  showTeamList() {
    this.setData({
      searchDeptName: '',
      teamVisible: true,
      'teamPageObj.pageNum': 1
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
  // 输入充值数量
  onInput(e) {
    let {
      value
    } = e?.detail
    this.setData({
      'form.rechargeAmount': value
    })
  },
  // 点击输入框弹出团队列表
  onInputDeptName() {
    if (!this.data.teamVisible) {
      this.showTeamList()
    }
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
  goAddDept() {
    wx.navigateTo({
      url: '/other/add-dept/add-dept',
    })
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})