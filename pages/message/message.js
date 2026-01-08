const dayjs = require('dayjs')
import tabService from '../../utils/tab-service';
import {
  showMessage
} from '../../utils/tools';
import {
  agreeJoinTeamApi,
  getJoinTeamApi,
  delTeamJoinRequestsApi,
  delDeptMessageApi
} from '../../api/api'
const app = getApp()
Page({
  data: {
    capsuleHeight: app.globalData.capsuleHeight,
    ossUrl: app.globalData.ossUrl,
    approvalList: [], // 审批列表
    total: 0, // 总数
    refreshing: false, // 下拉刷新状态
    loading: false, // 加载状态
    approvalUserInfo: {}, // 被审批用户信息
    approvalRoleIds: [], // 被审批人角色id
    showDelDialog: false,
    reviewShow: false,
    reviewStatus: '1',
    approvalInfo: null, // 审批信息
    pageObj: {
      pageNum: 1,
      pageSize: 10
    },
    // 状态选项卡
    tabValue: 'all', // all-全部 pending-待审批
    tabList: [{
        label: '全部',
        value: 'all'
      },
      {
        label: '待审批',
        value: '0'
      }
    ]
  },

  onLoad(options) {},

  onShow() {
    // 页面显示时可以刷新数据
    //更新底部高亮
    tabService.updateIndex(this, 2)
    this.getApprovalList();
  },

  // 返回上一页
  onBack() {
    wx.navigateBack();
  },

  // 获取审批列表（真实接口）
  getApprovalList(type = 'init') {
    if (this.data.loading) return;

    this.setData({
      loading: true
    });

    // 构建请求参数
    const params = {
      pageNum: this.data.pageObj.pageNum,
      pageSize: this.data.pageObj.pageSize,
    };
    if (this.data.tabValue !== 'all') {
      params.status = this.data.tabValue
    }

    // 调用真实接口
    getJoinTeamApi(params).then(res => {
      if (res.code === 200) {
        const {
          total,
          rows
        } = res.data;
        rows.forEach(item => {
          item.requestTime = dayjs(item.requestTime).format('MM-DD HH:mm');
        });
        if (type === 'refresh') {
          // 下拉刷新
          this.setData({
            approvalList: rows || [],
            total: total || 0,
            refreshing: false,
            loading: false,
            'pageObj.pageNum': 1
          });
        } else if (type === 'loadmore') {
          // 上拉加载更多
          const newList = [...this.data.approvalList, ...(rows || [])];
          this.setData({
            approvalList: newList,
            loading: false
          });
        } else {
          // 初始加载
          this.setData({
            approvalList: rows || [],
            total: total || 0,
            loading: false
          });
        }
      } else {
        this.setData({
          loading: false,
          refreshing: false
        });
        this.message('error', '消息列表加载失败');
      }
    }).catch(err => {
      console.error('获取审批列表失败', err);
      this.setData({
        loading: false,
        refreshing: false
      });
      this.message('error', '消息列表加载失败');
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      'pageObj.pageNum': 1,
      refreshing: true
    });
    this.getApprovalList('refresh');
  },

  // 上拉加载更多
  onReachBottom() {
    const {
      approvalList,
      total,
      loading
    } = this.data;

    if (loading) return;

    if (approvalList.length >= total) {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'none'
      // });
      return;
    }

    this.setData({
      'pageObj.pageNum': this.data.pageObj.pageNum + 1
    });
    this.getApprovalList('loadmore');
  },

  // 切换选项卡
  onTabChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      tabValue: value,
      'pageObj.pageNum': 1
    });
    // 根据不同tab过滤数据或重新请求
    this.getApprovalList('init');
  },
  // 同意请求（真实接口）
  approveRequest() {
    let params = {
      id: this.data.approvalInfo.id,
      status: this.data.reviewStatus
    }
    wx.showLoading({
      title: '处理中...'
    });
    agreeJoinTeamApi(params).then(res => {
      wx.hideLoading();
      if (res.code === 200) {
        this.message('success', '审批成功！');
        // 刷新列表
        this.setData({
          'pageObj.pageNum': 1,
          approvalInfo: null,
          reviewShow: false
        });
        this.getApprovalList('init');
      } else {
        this.message('error', '操作失败');
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('审批失败！', err);
      this.message('error', '审批失败！');
    });
  },
  // 删除消息
  onDelete(e) {
    let {
      type,
      item
    } = e?.currentTarget?.dataset
    this.setData({
      delType: type,
      approvalInfo: item,
      showDelDialog: true
    })
  },
  // 提交删除
  submitDelDialog() {
    let {
      delType,
      approvalInfo
    } = this.data
    console.log('删除消息', delType, approvalInfo)
    delTeamJoinRequestsApi(approvalInfo.id).then(res => {
      wx.hideLoading();
      if (res.code === 200) {
        this.message('success', '删除成功！');
        // 刷新列表
        this.setData({
          'pageObj.pageNum': 1,
          delType: 'line',
          approvalInfo: null,
          showDelDialog: false
        });
        this.getApprovalList('init');
      } else {
        this.message('error', '操作失败');
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('删除失败！', err);
      this.message('error', '删除失败！');
    });
  },
  // 关闭删除弹窗
  closeDialog(e) {
    const {
      type
    } = e.currentTarget.dataset;
    this.setData({
      [type]: false
    });
  },
  // 审核
  goReview(e) {
    const {
      item
    } = e.currentTarget.dataset;
    this.setData({
      reviewShow: true,
      approvalInfo: item
    })
  },
  radioChange(e) {
    const {
      value
    } = e?.detail;
    this.setData({
      reviewStatus: value
    })
  },
  onDeleteAll() {
    delDeptMessageApi().then(res => {
      console.log('测试', res)
      if (res.code == 200) {
        this.message('success', '全部删除成功！');
        this.setData({
          showDelDialog: false
        })
        this.getApprovalList()
      }
    })
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})