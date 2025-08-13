import Message from 'tdesign-miniprogram/message/index';
import {
  getTeamsMemberListApi,
  openTimesShareApi
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
    let {
      value
    } = e?.detail
    let {
      item
    } = e?.currentTarget?.dataset
    openTimesShareApi(item.userId, value).then(res => {
      console.log(res)
      if (res.code === 200) {
        Message.success({
          context: this,
          offset: [90, 32],
          duration: 1300,
          content: '共享权限设置成功！',
        });
        this.getTeamsMemberList()
      }
    })
  },
})