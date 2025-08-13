import Message from 'tdesign-miniprogram/message/index';
import { getTeamsInfoListApi, joinTeamApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    teamList: [],
    refresher: false,
    btnFlag: false,
    query: {
      deptId: '',
      deptName: ''
    }
  },
  onLoad(options) {
    let { deptId, deptName } = options
    this.setData({
      'query.deptId': deptId || '',
      'query.deptName': deptName || ''
    })
    this.getTeamsInfoList()
  },
  getTeamsInfoList() {
    getTeamsInfoListApi(this.data.query).then(res => {
      this.setData({
        teamList: res.data
      })
      this.setData({
        refresher: false
      })
    })
  },
  joinTeam(e) {
    let { id } = e?.currentTarget?.dataset
    let userId = app.globalData.userInfo.userId
    let params = {
      deptId: id,
      userId
    }
    joinTeamApi(params).then(res => {
      if (res.code === 200) {
        this.setData({
          btnFlag: true
        });
        // 扫码成功
        wx.reLaunch({
          url: '/pages/submit-success/submit-success'
        });
      }
    })
  }
})