const airkiss = requirePlugin('airkiss');
import {
  deviceBindApi
} from '../../api/api.js'
import {
  showMessage
} from '../../utils/tools';
import tool from '../../utils/tools'
/*********** hal_version 版本迭代 ***********/
//  211209 ：纠正输入的SSID判断长度问题
/*************************************/

Page({
  data: {
    ssid: '',
    password: '',
    is5G: true,
    showClearBtn: false,
    isWaring: false,
    hal_version: 211209,
    ui: {
      background: [{
          url: 'https://aithinker-static.oss-cn-shenzhen.aliyuncs.com/officialwebsite/banner/ESP32-C3.png'
        },
        {
          url: 'https://aithinker-static.oss-cn-shenzhen.aliyuncs.com/officialwebsite/banner/banner32.jpg'
        },
        {
          url: 'https://aithinker-static.oss-cn-shenzhen.aliyuncs.com/officialwebsite/banner/banner32.jpg'
        },
      ],
      indicatorDots: true,
      vertical: false,
      autoplay: false,
      interval: 2000,
      duration: 500,
      showPassword: false,
      addFlag: false,
      deptId: '',
      deviceId: '',
    }
  },
  onLoad(options) {
    this.setData({
      version: airkiss.version,
      deptId: options.deptId,
      deviceId: options.deviceId
    })
    let that = this
    wx.startWifi({
      success(res) {
        console.log(res.errMsg, 'wifi初始化成功')
        that.getWifiInfo();
      },
      fail: function (res) {
        wx.showToast({
          title: '请连接路由器!',
          duration: 2000,
          icon: 'none'
        })
      }
    })
    this.getWifiInfo()
  },
  setValue(key, value) {
    this.setData({
      [key]: value,
    });
  },
  getWifiInfo() {
    let that = this
    wx.getConnectedWifi({
      success(res) {
        console.log("getConnectedWifi ok:", JSON.stringify(res))
        if ('getConnectedWifi:ok' === res.errMsg) {
          that.setData({
            ssid: res.wifi.SSID,
            bssid: res.wifi.BSSID,
            is5G: res.wifi.frequency > 4900
          })
        } else {
          wx.showToast({
            title: '请连接路由器',
            duration: 2000,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '请连接路由器',
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  onInputSSID(evt) {
    const {
      value
    } = evt.detail;
    this.setData({
      ssid: value,
    });
  },
  onInputPassword(evt) {
    const {
      value
    } = evt.detail;
    this.setData({
      password: value,
      showClearBtn: !!value.length,
      isWaring: false,
    });
  },
  onClear() {
    this.setData({
      password: '',
      showClearBtn: false,
      isWaring: false,
    });
  },
  onConfirm() {
    console.log("ssid:", this.data.ssid, ",password:", this.data.password)
    let _this = this
    if (this.data.ssid == '') {
      wx.showToast({
        title: '请连接路由器',
        duration: 2000,
        icon: 'none'
      })
      return;
    }

    if (this.data.password.length < 8) {
      wx.showToast({
        title: '请输出不少于8位的密码',
        duration: 2000,
        icon: 'none'
      })
      return;
    }

    if (this.data.is5G) {
      wx.showToast({
        title: '请链接至2.4G频段的路由器',
        duration: 2000,
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '正在配网...',
    })
    //这里最好加微信小程序判断账号密码是否为空，以及其长度和是否为5G频段
    airkiss.startAirkiss(this.data.ssid, this.data.password, function (res) {
      wx.hideLoading();
      switch (res.code) {
        case 0:
          wx.showModal({
            title: '初始化失败',
            content: res.result,
            showCancel: false,
            confirmText: '确定',
          })
          break;
        case 1:
          wx.showLoading({
            title: '设备注册中...',
          })
          _this.addWifiDevice()
          // wx.showModal({
          //   title: '配网成功',
          //   content: '设备IP：' + res.ip + '\r\n 设备Mac：' + res.bssid,
          //   showCancel: false,
          //   confirmText: '好的',
          // })
          break;
        case 2:
          // wx.showModal({
          //   title: '配网失败',
          //   content: '请检查密码是否正确',
          //   showCancel: false,
          //   confirmText: '收到',
          // })
          _this.message('error', '设备配网失败，请检查密码是否正确！', 3000)
          break;

        default:
          break;
      }

    })
  },
  onShareAppMessage: function () {
    /// ignore
  },
  onClickeye() {
    this.setData({
      showPassword: !this.data.showPassword
    })
  },
  // 添加设备到团队
  addWifiDevice: tool.debounce(function () {
    // 先检查是否已经在添加中，防止重复调用
    if (this.data.addFlag) {
      wx.hideLoading();
      console.log('设备已在添加中，跳过重复调用');
      return;
    }

    // 立即设置标志，防止重复调用
    this.setValue("addFlag", true);

    let {
      deptId,
      deviceId
    } = this.data
    deviceBindApi(deptId, deviceId).then(res => {
      wx.hideLoading();
      if (res.code === 200) {
        this.message('success', '设备绑定成功！', 2000)
        setTimeout(() => {
          wx.navigateBack({
            delta: 2
          })
        }, 1500);
      } else {
        console.log("绑定失败", res)
        this.message('warning', res.msg, 3000)
        // 绑定失败时重置标志，允许重试
        this.setValue("addFlag", false);
        setTimeout(() => {
          this.goBack()
        }, 2000);
      }
    }).catch(err => {
      wx.hideLoading();
      console.error("绑定接口异常", err)
      this.message('error', '设备绑定失败，请联系管理员绑定！', 3000)
      // 接口异常时重置标志，允许重试
      this.setValue("addFlag", false);
    })
  }, 1666),
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  },
});