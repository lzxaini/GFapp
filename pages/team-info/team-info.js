import {
  changeTeamInfoApi,
  getMyTeamsApi,
  getRegionApi
} from '../../api/api'
import {
  hexToRgba
} from '../../utils/tools'
import {
  showMessage
} from '../../utils/tools';
const app = getApp()
Page({
  data: {
    ossUrl: app.globalData.ossUrl,
    teamTags: [],
    teamInfo: {},
    form: {
      deptId: '',
      deptName: '',
      deptAvatar: ''
    },
    nameError: '',
    addressError: '',
    addressDetailError: '',
    visible: false, // 省市区组件
    options: [], // 省市区列表
    value: '', // 组件值
    addressValue: '', // 用于展示
  },
  onLoad(options) {
    let {
      deptId
    } = options
    this.getMyTeams(deptId)
  },
  getMyTeams(deptId) {
    getMyTeamsApi(deptId).then(res => {
      if (res.code === 200) {
        this.setData({
          form: res.data
        })
        this.getRegion()
      }
    })
  },
  // 上传团队封面
  updateTeamCover() {
    let {
      deptId
    } = this.data.form
    let _this = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        // 这里假设有上传接口 /api/upload
        wx.uploadFile({
          url: app.globalData.baseUrl + `/system/user/profile/deptAvatar/${deptId}`, // 替换为你的上传接口
          filePath: tempFilePath,
          header: {
            'Authorization': app.globalData.token
          },
          name: 'avatarfile',
          success: (uploadRes) => {
            // 上传成功后的处理，比如保存图片地址到data
            const data = JSON.parse(uploadRes.data);
            _this.setData({
              'form.deptAvatar': data.imgUrl // 假设返回的图片地址字段为url
            });
            _this.message('success', '团队头像上传成功')
          },
          fail: () => {
            _this.message('error', `系统错误：${error}`, 3000)
          }
        });
      },
      fail: () => {
        wx.showToast({
          title: '未选择图片',
          icon: 'none'
        });
      }
    });
  },
  verify() {
    let {
      form
    } = this.data
    let nameError = ''
    let addressError = ''
    let addressDetailError = ''
    // 新密码长度校验
    if (!form.deptName) {
      nameError = '请输入名称！'
    } else {
      nameError = ''
    }
    // 地址非空校验
    if (!form.address) {
      addressError = '请选择地址！'
    } else {
      addressError = ''
    }
    // 详细地址非空校验
    if (!form.addressDetail) {
      addressDetailError = '请输入详细地址！'
      this.message('error', '请输入详细地址！', 1500)
    } else {
      addressDetailError = ''
    }
    this.setData({
      nameError: nameError,
      addressError: addressError,
      addressDetailError: addressDetailError
    })
    return !nameError && !addressError && !addressDetailError
  },
  onNameInput(e) {
    let {
      value
    } = e?.detail
    this.setData({
      'form.deptName': value
    })
  },
  onAddressDetailInput(e) {
    let {
      value
    } = e?.detail
    this.setData({
      'form.addressDetail': value
    })
  },
  onSubmit() {
    let _this = this
    if (!this.verify()) return;
    let {
      form
    } = this.data
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
  // 获取省市区
  // 递归查找 label 路径
  findLabelPath(list, code, path = []) {
    for (let item of list) {
      if (item.value === code) {
        return [...path, item.label];
      }
      if (item.children) {
        const result = this.findLabelPath(item.children, code, [...path, item.label]);
        if (result) return result;
      }
    }
    return null;
  },
  getRegion() {
    getRegionApi().then(res => {
      const options = res.data || [];
      this.setData({
        options
      });
      const addressCode = this.data.form.addressKey;
      if (!addressCode) return;
      try {
        const labelPath = this.findLabelPath(options, addressCode);
        if (labelPath) {
          this.setData({
            addressValue: labelPath.join('/'),
            value: addressCode
          });
        } else {
          this.setData({
            addressValue: '',
            value: ''
          });
        }
      } catch (err) {
        this.setData({
          addressValue: '',
          value: ''
        });
        this.message('error', '地址回显异常', 2000);
      }
    })
  },
  showCascader() {
    this.setData({
      visible: true
    });
  },
  onChange(e) {
    const {
      selectedOptions,
      value
    } = e.detail;
    this.setData({
      'form.address': selectedOptions.map((item) => item.label).join('/'),
      'form.addressKey': value,
      addressValue: selectedOptions.map((item) => item.label).join('/'),
      value,
    });
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  }
})