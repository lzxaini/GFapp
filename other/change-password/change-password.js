import Message from 'tdesign-miniprogram/message/index';
import { resetPasswordApi } from '../../api/api'
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    from: {
      old: '',
      new1: '',
      new2: ''
    },
    oldError: '',
    new1Error: '',
    new2Error: '',
    oldFlag: false,
    new1Flag: false,
    new2Flag: false,
  },
  onPasswordInput(e) {
    let { type } = e?.currentTarget?.dataset
    let { value } = e?.detail
    switch (type) {
      case 'old':
        this.setData({
          'from.old': value
        })
        break
      case 'new1':
        this.setData({
          'from.new1': value
        })
        break
      case 'new2':
        this.setData({
          'from.new2': value
        })
        break
      default:
        break
    }
  },
  onSubmit() {
    if (!this.verify()) return;
    let { from } = this.data
    resetPasswordApi(from.old, from.new2).then(res => {
      if (res.code === 200) {
        Message.success({
          context: this,
          offset: [90, 32],
          duration: 1500,
          content: '修改密码成功！',
        });
        setTimeout(() => {
          this.goBack()
        }, 1000);
      } else {
        Message.error({
          context: this,
          offset: [90, 32],
          duration: 5000,
          content: res.msg,
        });
      }
    })
  },
  // 校验方法
  verify() {
    const { from } = this.data;
    let oldError = '';
    let new1Error = '';
    let new2Error = '';
    // 新密码长度校验
    if (!from.old) {
      oldError = '请输入旧密码！';
    }
    // 新密码长度校验
    if (!from.new1 || from.new1.length < 8) {
      new1Error = '新密码不能少于8位';
    } else if (!/[A-Za-z]/.test(from.new1) || !/[0-9]/.test(from.new1)) {
      // 必须包含字母和数字
      new1Error = '新密码需包含字母和数字';
    }
    // 两次新密码一致性校验
    if (from.new1 !== from.new2) {
      new2Error = '两次输入的新密码不一致';
    }
    this.setData({
      oldError,
      new1Error,
      new2Error
    });
    // 返回校验是否通过
    return !oldError && !new1Error && !new2Error;
  },
  passwordFlag(e) {
    let { type, flag } = e?.currentTarget?.dataset
    let { value } = e?.detail
    switch (type) {
      case 'old':
        this.setData({
          'oldFlag': !flag
        })
        break
      case 'new1':
        this.setData({
          'new1Flag': !flag
        })
        break
      case 'new2':
        this.setData({
          'new2Flag': !flag
        })
        break
      default:
        break
    }
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
})