import { changeTeamInfoApi, getMyTeamsApi } from '../../api/api'
import { hexToRgba } from '../../utils/tools'
import Message from 'tdesign-miniprogram/message/index';
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    teamTags: [],
    teamInfo: {},
    form: {
      id: '',
      name: '',
      avatar: ''
    },
    nameError: '',
  },
  onLoad(options) {
    let { id } = options
    this.getMyTeams(id)
  },
  getMyTeams(id) {
    getMyTeamsApi(id).then(res => {
      const tags = res.data.teamTags.map(item => ({
        ...item,
        bgColor: hexToRgba(item.color, 0.1) // 背景颜色淡化
      }))
      this.setData({
        teamInfo: res.data,
        'form.id': res.data.id,
        'form.name': res.data.name,
        'form.avatar': res.data.avatar,
        teamTags: tags
      })
    })
  },
  // 上传团队封面
  updateTeamCover() {
    let { id } = this.data.teamInfo
    let _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        // 这里假设有上传接口 /api/upload
        wx.uploadFile({
          url: app.globalData.baseUrl + `/system/user/profile/teamAvatar/${id}`, // 替换为你的上传接口
          filePath: tempFilePath,
          header: {
            'Authorization': app.globalData.token
          },
          name: 'avatarfile',
          success: (uploadRes) => {
            // 上传成功后的处理，比如保存图片地址到data
            const data = JSON.parse(uploadRes.data);
            this.setData({
              'form.avatar': data.imgUrl // 假设返回的图片地址字段为url
            });
            _this.message('success', '团队头像上传成功')
          },
          fail: () => {
            _this.message('error', `系统错误：${error}`, 3000)
          }
        });
      },
      fail: () => {
        wx.showToast({ title: '未选择图片', icon: 'none' });
      }
    });
  },
  verify() {
    let { form } = this.data
    let nameError = ''
    // 新密码长度校验
    if (!form.name) {
      nameError = '请输入用户名称！'
    } else {
      nameError = ''
    }
    this.setData({
      nameError: nameError
    })
    return !nameError
  },
  onNameInput(e) {
    let { value } = e?.detail
    this.setData({
      'form.name': value
    })
  },
  onSubmit() {
    let _this = this
    if (!this.verify()) return;
    let { form } = this.data
    changeTeamInfoApi(form).then(res => {
      wx.showLoading({
        title: '正在加载...',
        mask: true,
      });
      if (res.code === 200) {
        _this.message('success', '修改成功！', 1500)
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
          wx.hideLoading();
        }, 1000);
      } else {
        _this.message('error', res.msg, 3000)
      }
    })
  },
  message(type, text, duration = 1500) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: duration,
      content: text,
    });
  }
})