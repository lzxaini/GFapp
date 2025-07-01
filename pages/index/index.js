const app = getApp()
const dayjs = require('dayjs')
import {
  addVisitorApi
} from '../../api/api.js'
import { onMqttReady } from '../../utils/mqttReady';
Page({
  data: {
    statusBarHeight: app.globalData.capsuleHeight,
    isVerification: false,
    phoneError: false, // 手机号格式错误
    nameError: false, // 姓名不能为空
    dateError: false, // 日期不能为空
    contentError: false, // 内容不能为空
    start: {
      domVisible: false,
      datetime: '', // 日期时间选择器的值
      startTime: '', // 限制起始时间
      datetimeText: '',
    },
    end: {
      mode: '',
      domVisible: false,
      datetime: '', // 日期时间选择器的值
      startTime: '', // 限制起始时间
      datetimeText: '', // 显示的时间文本
    },
    datetimeText: '', // 显示的时间文本
    startFormatter(option, columnIndex) {
      // columnIndex 对应列索引：0=年，1=月，2=日，3=时，4=分
      if (columnIndex === 0) {
        // 删除年的label并返回
        return { ...option, label: '' }; // 隐藏“年”的 label
      }
      return option;
    },
    endFormatter(option, columnIndex) {
      if (columnIndex === 0) {
        return { ...option, label: '' };
      }
      return option;
    },
    fileList: [],
    from: {
      visitorName: '',
      mobile: '',
      content: '',
      validStart: '',
      validEnd: '',
      picture: '',
      sex: 1, // 不展示随便先传一个
    }
  },
  onLoad() {
    this.setTabBar()
    const now = dayjs();
    const formattedNow = now.format('YYYY-MM-DD HH:mm');
    // 设置初始时间为当前时间
    this.setData({
      'start.datetime': formattedNow,
      'start.startTime': formattedNow
    });
    // 获取缓存的手机号和姓名
    const mobile = wx.getStorageSync('mobile') || '';
    const visitorName = wx.getStorageSync('visitorName') || '';
    // 设置手机号和姓名到表单中
    this.setData({
      'from.mobile': mobile,
      'from.visitorName': visitorName,
    });

    onMqttReady(() => {
      this.subscribeTopic();
    });
    wx.eventCenter.on('mqtt-message', this.handleMsg);
  },
  onUnload() {
    console.log('页面卸载',)
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
  },
  // 订阅
  subscribeTopic() {
    const mqttClient = app.globalData.mqttClient;
    console.log("🥵 ~ onShow ~ mqttClient: ", mqttClient)

    if (mqttClient?.isConnected()) {
      mqttClient.publish(`resp/861556077047305`, '小程序发');
      mqttClient.subscribe(`req/861556077047305`);
    } else {
      console.warn('MQTT 未连接或还未初始化');
    }
  },
  // 收到消息
  handleMsg({ topic, message }) {
    console.log('📩 收到 MQTT 消息', topic, message);
  },
  // 设置tabBar
  setTabBar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  showPicker(e) {
    const { mode } = e?.currentTarget?.dataset;
    this.setData({
      [`${mode}.domVisible`]: true,
    });
  },
  hidePicker(e) {
    const { mode } = e?.currentTarget?.dataset;
    this.setData({
      [`${mode}.domVisible`]: false,
    });
  },
  onConfirm(e) {
    const { value } = e?.detail;
    const { mode } = e?.currentTarget?.dataset;
    if (mode === 'start') {
      this.setData({
        [`start.domVisible`]: false,
        [`end.domVisible`]: true,
        'start.datetime': value,
        'start.datetimeText': value,
        'from.validStart': value,
        'end.startTime': value, // 设置结束时间的起始时间为开始时间
      });
    } else if (mode === 'end') {
      const startDatetime = dayjs(this.data.start.datetime).format('MM-DD HH');
      const endDateTime = dayjs(value).format('MM-DD HH');
      this.setData({
        [`end.domVisible`]: false,
        'end.datetime': value,
        'end.datetimeText': value,
        'from.validEnd': value,
        datetimeText: `${startDatetime}~${endDateTime}`,
      });
    }
  },
  handleAdd(e) {
    console.log("🥵 ~ handleAdd ~ e: ", e)
    const { fileList } = this.data;
    const { files } = e.detail;

    wx.navigateTo({
      url: '/pages/cropping/cropping?src=' + files[0].url,
    })

    // 方法2：每次选择图片都上传，展示每次上传图片的进度
    // files.forEach(file => this.uploadFile(file))
    // this.onUpload(files[0]); // 这里仅上传第一个文件，实际应用中可以遍历 files 数组上传所有文件
  },
  handleRemove(e) {
    const { index } = e.detail;
    const { fileList } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
      'from.picture': ''
    });
  },
  onNameInput(e) {
    const { value } = e?.detail;
    // 判断不能为空
    if (!value.trim()) {
      wx.showToast({
        icon: 'none',
        title: '姓名不能为空',
      });
      this.setData({
        nameError: true,
      });
      return;
    }
    this.setData({
      'from.visitorName': value,
      nameError: false,
    });
  },
  onContentInput(e) {
    const { value } = e?.detail;
    // 判断不能为空
    if (!value.trim()) {
      wx.showToast({
        icon: 'none',
        title: '拜访事由不能为空',
      });
      this.setData({
        contentError: true,
      });
      return;
    }
    this.setData({
      'from.content': value,
      contentError: false,
    });
  },
  onPhoneInput(e) {
    const { value } = e?.detail;
    // 手机号格式校验
    const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号码',
      });
      this.setData({
        phoneError: true,
      });
      return;
    }
    this.setData({
      'from.mobile': value,
      phoneError: false,
    });
  },
  verify() {
    const { visitorName, mobile, validStart, validEnd, content } = this.data.from;
    const rules = [
      {
        key: 'nameError',
        value: visitorName,
        msg: '请检查姓名输入',
      },
      {
        key: 'phoneError',
        value: mobile,
        msg: '请检查手机号输入',
      },
      {
        key: 'dateError',
        value: validStart,
        msg: '请检查拜访开始时间',
      },
      {
        key: 'dateError',
        value: validEnd,
        msg: '请检查拜访结束时间',
      },
      {
        key: 'contentError',
        value: content,
        msg: '请检查拜访事由',
      },
    ];

    for (const rule of rules) {
      if (!rule.value || !rule.value.trim()) {
        this.setData({
          [rule.key]: true,
        });
        wx.showToast({
          icon: 'none',
          title: rule.msg,
        });
        return;
      }
    }

    // 所有校验通过
    this.setData({
      isVerification: true,
      nameError: false,
      phoneError: false,
      dateError: false,
    });
    // 缓存输入的姓名
    wx.setStorageSync('visitorName', this.data.from.visitorName);
    // 缓存输入的手机号
    wx.setStorageSync('mobile', this.data.from.mobile);
  },
  // 提交表单
  submit() {
    addVisitorApi(this.data.from).then(res => {
      console.log("🥵 ~ addVisitorApi ~ res: ", res)
      wx.hideLoading()
      if (res.code == 200) {
        wx.showToast({
          title: '等待审核',
          icon: 'loading',
          duration: 1500,
          success: () => {
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/history/history',
              })
            }, 1000);
          }
        });
      }
    })
  },
  verifySuccess() {
    wx.showToast({
      title: '验证成功',
      duration: 1000
    })
    wx.showLoading({
      title: '提交中...',
    })
    this.submit()
    console.log('表单', this.data.from);
  },
  verifyError() {
    wx.showToast({
      icon: 'error',
      title: '验证失败',
    })
  },
  clearInfo() {
    app.logout()
    wx.clearStorageSync()
    wx.reLaunch({
      url: '/pages/login/login'
    })
  }
})