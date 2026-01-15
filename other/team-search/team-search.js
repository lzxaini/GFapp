import Message from 'tdesign-miniprogram/message/index';
import { joinDeptApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    confirmBtn: { content: '确定', variant: 'base' },
    showConfirm: false
  },
  searchTeam() {
    wx.navigateTo({
      url: '/other/search-page/search-page'
    })
  },
  scanTeam() {
    let _this = this
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        const { result } = res;
        if (result) {
          const match = result.match(/^dept-(.+)$/);
          if (match) {
            const deptId = match[1]; // deptId
            _this.joinDept(deptId)
          } else { // 加入团队
            _this.joinTeam(result)
          }
        }
      },
      fail: (err) => {
        console.log('扫码', err)
      }
    });
  },
  // 加入团队
  joinTeam(deptId) {
    wx.navigateTo({
      url: `/pages/team-join/team-join?deptId=${deptId}`,
    });
  },
  // 加入部门
  joinDept(searchValue) {
    const userInfo = app.globalData.userInfo
    joinDeptApi(userInfo.userId, searchValue).then(res => {
      if (res.code === 200) {
        Message.success({
          context: this,
          offset: [90, 32],
          duration: 1300,
          content: '加入成功，即将跳转首页！',
        });
        // 扫码成功
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }, 1500)
      }
    })
  }
})