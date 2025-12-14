import Message from 'tdesign-miniprogram/message/index';
import {
  agreeJoinTeamApi,
  getJoinTeamApi,
  getUserApi,
  updateUserApi
} from '../../api/api'
Page({
  data: {
    approvalList: [], // 审批列表
    total: 0, // 总数
    refreshing: false, // 下拉刷新状态
    loading: false, // 加载状态
    approvalUserInfo: {}, // 被审批用户信息
    approvalRoleIds: [], // 被审批人角色id
    pageObj: {
      pageNum: 1,
      pageSize: 10
    },
    // 状态选项卡
    tabValue: '0', // all-全部 pending-待审批 approved-已通过
    tabList: [{
        label: '待审批',
        value: '0'
      },
      {
        label: '已通过',
        value: '1'
      },
      {
        label: '已拒绝',
        value: '2'
      }
    ]
  },

  onLoad(options) {
    this.getApprovalList();
  },

  onShow() {
    // 页面显示时可以刷新数据
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
      status: this.data.tabValue === 'all' ? null : this.data.tabValue
    };

    // 调用真实接口
    getJoinTeamApi(params).then(res => {
      if (res.code === 200) {
        const {
          total,
          rows
        } = res.data;

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
        wx.showToast({
          title: res.msg || '加载失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('获取审批列表失败', err);
      this.setData({
        loading: false,
        refreshing: false
      });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
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
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      });
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
  // 获取用户信息
  getUser(info) {
    const {
      id,
      username,
      userid
    } = info
    getUserApi(userid).then(response => {
      this.setData({
        approvalUserInfo: response.data,
        approvalRoleIds: response.roleIds,
      })
      wx.showModal({
        title: '确认同意',
        content: `确认同意 ${username} 的加入申请吗？`,
        success: (res) => {
          if (res.confirm) {
            this.updateUser(id) // 更新用户信息
          }
        }
      });
    });
  },
  // 同意申请
  handleApprove(e) {
    const info = e.currentTarget.dataset;
    this.getUser(info)
  },

  // 拒绝申请
  handleReject(e) {
    const {
      id,
      username
    } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认拒绝',
      content: `确认拒绝 ${username} 的加入申请吗？`,
      success: (res) => {
        if (res.confirm) {
          // 调用拒绝接口
          this.approveRequest(id, '2');
        }
      }
    });
  },

  // 同意请求（真实接口）
  approveRequest(id, status) {
    wx.showLoading({
      title: '处理中...'
    });

    const data = {
      id,
      status
    };

    agreeJoinTeamApi(data).then(res => {
      wx.hideLoading();

      if (res.code === 200) {
        Message.success({
          context: this,
          offset: [90, 32],
          duration: 2000,
          content: '审批成功！',
        });
        // 刷新列表
        this.setData({
          'pageObj.pageNum': 1
        });
        this.getApprovalList('init');
      } else {
        wx.showToast({
          title: res.msg || '操作失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('审批失败！', err);
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      });
    });
  },
  // 更新用户信息
  updateUser(approvalId) {
    let {
      approvalUserInfo,
      approvalRoleIds
    } = this.data
    const params = {
      ...approvalUserInfo,
      roleIds: approvalRoleIds[0] == '2' ? ['10004'] : ['2'], // roleIds是2，就设置10004
    };
    updateUserApi(params)
      .then(() => {
        // 调用同意接口
        this.approveRequest(approvalId, '1');
      })
      .catch(() => {
        Message.error({
          context: this,
          offset: [90, 32],
          duration: 2000,
          content: '自动分配角色失败！',
        });
      });
  },
})