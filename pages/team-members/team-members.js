import {
  getTeamsMemberListApi
} from '../../api/api'
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    memberList: [],
    refresher: false,
    defaultVal: false,
  },
  onLoad(options) {
    let {
      editFlag,
      deptId
    } = options
    this.setData({
      editFlag: editFlag === 'admin' ? true : false,
      deptId
    })
    this.getTeamsMemberList()
  },
  getTeamsMemberList() {
    getTeamsMemberListApi(this.data.deptId).then(res => {
      if (res.code === 200) {
        this.setData({
          memberList: res.data
        })
        this.setData({
          refresher: false
        })
      }
    })
  },
  handleChange(e) {
    this.setData({
      defaultVal: e.detail.value,
    });
  },
})