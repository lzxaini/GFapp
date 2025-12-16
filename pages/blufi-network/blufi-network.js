import {
  showMessage
} from '../../utils/tools';
import {
  deviceBindApi
} from '../../api/api.js'
import {
  onMqttReady
} from '../../utils/mqttReady';
import emojiRegex from 'emoji-regex';
const app = getApp()
var xBlufi = require("../../utils/blufi/xBlufi.js");
var _this = null;
var timeout = null;
var interval_timer = null;
var sequenceCounet = 0;
var newScanListLength = -1;
var oldScanListLength = 0;

const SCAN_STEP = 1;
const INPUT_STEP = 2;
const DONE_STEP = 3;

Page({
  data: {
    phoneEnv: app.globalData.phoneEnv, // 手机系统
    blufiloadInfo: "扫描设备",
    blufiLoadStatus: false,
    blufiScanStatus: false,
    showPassword: false,
    macFilter: "",
    stepActive: 0,
    ssid: "",
    password: "",
    subMqtt: false, // mqtt是否订阅
    steps: [{
      text: '1.配网事项'
    },
    {
      text: '2.连接设备'
    },
    {
      text: '3.配置WIFI'
    },
    {
      text: '4.配网成功'
    }
    ],
    deviceId: '',
    deviceName: '',
    devicesListTemp: [],
    devicesList: [],
    deviceInfo: null, // 选择的设备信息
    // 配网状态变量
    sendSuccess: false,
    networkSuccess: false,
    addSuccess: false,
    addFlag: false,
    deptId: '',
    empty: false,
  },
  setValue(key, value) {
    this.setData({
      [key]: value,
    });
  },
  onClickeye() {
    this.setValue("showPassword", !this.data.showPassword)
  },
  blufiBtnHandle() {
    wx.vibrateShort()
    let status = this.data.stepActive
    switch (status) {
      case SCAN_STEP:
        this.setValue("blufiScanStatus", !this.data.blufiScanStatus)
        if (this.data.blufiScanStatus) {
          xBlufi.notifyStartDiscoverBle({
            'isStart': true
          })
          console.log("start scan!")
          this.setValue("blufiloadInfo", "扫描中")
          this.setValue('empty', false)
          this.setValue("blufiLoadStatus", true)
          interval_timer = setInterval(() => {
            this.blufiUpdateList();
          }, 900);
        } else {
          this.blufiIntercalClear()
          console.log("stop scan!")
          xBlufi.notifyStartDiscoverBle({
            'isStart': false
          })
          this.setValue("blufiloadInfo", "开始扫描")
          this.setValue("blufiLoadStatus", false)
        }
        // 扫描超时
        setTimeout(() => {
          this.setValue('empty', true)
        }, 30 * 1000)
        break;
      case INPUT_STEP:
        this.setValue("stepActive", 3);
        this.startConfig()
      case DONE_STEP:
        break;
      default:
        break;
    }
  },
  blufiConnect(e) {
    if (!this.data.deviceInfo) {
      return showMessage('error', '请先选择要连接的设备', 2000, this);
    }
    let deviceId = this.data.deviceInfo.deviceId
    this.setValue("blufiloadInfo", "连接中")
    if (interval_timer) {
      clearInterval(interval_timer)
    }
    //停止搜索
    xBlufi.notifyStartDiscoverBle({
      'isStart': false
    })
    for (var i = 0; i < this.data.devicesList.length; i++) {
      if (deviceId === this.data.devicesList[i].deviceId) {
        let name = this.data.devicesList[i].name
        console.log('连接deviceId:' + deviceId)
        xBlufi.notifyConnectBle({
          isStart: true,
          deviceId: deviceId,
          name
        });
        wx.showLoading({
          title: '连接设备中...',
        })
      }
    }
    timeout = setTimeout(() => {
      this.blufiTimeoutHandle()
    }, 30 * 1000)
  },
  blufiEventHandler: function (options) {
    switch (options.type) {
      case xBlufi.XBLUFI_TYPE.TYPE_GET_DEVICE_LISTS:
        if (options.result) {
          _this.setData({
            devicesListTemp: options.data
          });
        }
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_CONNECTED:
        console.log("连接回调：" + JSON.stringify(options))
        if (options.result) {
          wx.eventCenter.on('mqtt-message', this.handleMsg);
          onMqttReady(() => {
            this.subscribeTopic();
            this.setValue("subMqtt", true)
          });
          wx.hideLoading()
          wx.showToast({
            title: '连接成功',
            icon: 'none'
          })
          this.blufiTimeoutClear()
          this.setValue("blufiloadInfo", "配置WiFi")
          this.setValue("stepActive", 2);
          this.setValue("blufiLoadStatus", false)
          this.setValue("deviceId", options.data.deviceId)
          // 更新发送成功状态
          this.setValue("sendSuccess", true)
          xBlufi.notifyInitBleEsp32({
            deviceId: options.data.deviceId,
          })
          this.initWifi();
          sequenceCounet = 0;
          // wx.showLoading({
          //   title: '设备初始化中',
          // })
        }
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_GET_DEVICE_LISTS_START:
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_GET_DEVICE_LISTS_STOP:
        if (options.result) {
          //停止搜索ok
          console.log('停止搜索ok')
          this.setValue("blufiLoadStatus", false)
          this.setValue("blufiScanStatus", false)
        } else {
          //停止搜索失败
          console.log('停止搜索失败')
        }
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_STATUS_CONNECTED:
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_CONNECT_ROUTER_RESULT:
        wx.hideLoading();
        if (!options.result) {
          wx.showModal({
            title: '温馨提示',
            content: '配网失败，请重试',
            showCancel: false, //是否显示取消按钮
          })
          this.blufiReset()
        } else {
          if (options.data.progress == 100) {
            let ssid = options.data.ssid;
            console.log(ssid);
            this.setValue("blufiloadInfo", "配网成功")
            this.setValue("blufiLoadStatus", false)
            // 更新网络配置成功和添加成功状态
            this.setValue("networkSuccess", true)
            if (!this.data.addFlag) {
              this.addWifiDevice() // 添加设备
            }
            this.blufiTimeoutClear()
            timeout = setTimeout(() => {
              wx.closeBLEConnection({
                deviceId: this.data.deviceId,
                success: function (res) { },
              })
              this.blufiReset('ok')
            }, 1500)
          }
        }
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_RECIEVE_CUSTON_DATA:
        console.log("收到设备发来的自定义数据结果：", (options.data))
        wx.showModal({
          title: '收到自定义设备数据',
          content: `【${options.data}】`,
          showCancel: false, //是否显示取消按钮
        })
        break;
      case xBlufi.XBLUFI_TYPE.TYPE_INIT_ESP32_RESULT:
        wx.hideLoading();
        console.log("初始化结果：", JSON.stringify(options))
        if (options.result) {
          console.log('初始化成功')

        } else {
          console.log('初始化失败')
          that.setData({
            connected: false
          })
          wx.showModal({
            title: '温馨提示',
            content: `设备初始化失败`,
            showCancel: false, //是否显示取消按钮
            success: function (res) {
              wx.redirectTo({
                url: '/pages/index/index'
              })
            }
          })
        }
        break;
    }
  },
  blufiReset: function (type) {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId,
      success: function (res) { },
    })
    if (type !== 'ok') {
      this.setValue("stepActive", 0)
      // 重置配网状态
      this.setValue("sendSuccess", false)
      this.setValue("networkSuccess", false)
      this.setValue("addSuccess", false)
    }
    this.setValue("blufiloadInfo", "扫描设备")
    this.setValue("blufiLoadStatus", false)
    this.setValue("devicesList", [])
    this.setValue("deviceId", '')
    this.setValue("macFilter", '')
  },
  blufiUpdateList: function () {
    console.log('data.devicesListTemp', this.data.devicesListTemp)
    let list = this.data.devicesListTemp.filter(item => item.localName && item.localName.indexOf('GFKM-') === 0);
    var listLen = list.length;
    for (var i = 0; i < listLen - 1; i++) {
      for (var j = 0; j < listLen - 1 - i; j++) {
        if (list[j].RSSI < list[j + 1].RSSI) { // 相邻元素两两对比
          var temp = list[j + 1]; // 元素交换
          list[j + 1] = list[j];
          list[j] = temp;
        }
      }
    }
    _this.setData({
      devicesList: list
    });
  },
  blufiTimeoutHandle: function () {
    wx.hideLoading()
    this.message('error', '配网超时，请重试！', 3000)
    this.blufiReset()
    timeout = null;
  },
  blufiTimeoutClear: function () {
    if (timeout) {
      clearTimeout(timeout)
    }
  },
  blufiIntercalClear: function () {
    if (interval_timer) {
      clearInterval(interval_timer)
    }
  },
  encodeUtf8: function (text) {
    const code = encodeURIComponent(text);
    const bytes = [];
    for (var i = 0; i < code.length; i++) {
      const c = code.charAt(i);
      if (c === '%') {
        const hex = code.charAt(i + 1) + code.charAt(i + 2);
        const hexVal = parseInt(hex, 16);
        bytes.push(hexVal);
        i += 2;
      } else bytes.push(c.charCodeAt(0));
    }
    return bytes;
  },
  onLoad: function (options) {
    this.setValue("deptId", options.deptId || "")
    _this = this;
    xBlufi.initXBlufi(1);
    console.log("xBlufi", xBlufi.XMQTT_SYSTEM)
    xBlufi.listenDeviceMsgEvent(true, this.blufiEventHandler);
    //clear status
    this.blufiIntercalClear()
    xBlufi.notifyStartDiscoverBle({
      'isStart': false
    })
    _this.setData({
      devicesList: []
    });
  },
  onUnload: function () {
    console.log('blufi-network页面卸载')
    _this = this
    xBlufi.notifyConnectBle({
      isStart: false,
      deviceId: _this.data.deviceId,
      name: _this.data.deviceName,
    });
    xBlufi.notifyStartDiscoverBle({
      'isStart': false  // 修改为false，停止扫描
    })
    xBlufi.listenDeviceMsgEvent(false, this.blufiEventHandler);  // 修改为false，取消监听
    this.blufiIntercalClear()
    this.blufiTimeoutClear()
    const mqttClient = app.globalData.mqttClient;
    if (this.data.subMqtt && this.data.deviceInfo) { // mqtt订阅了才卸载
      wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
      wx.eventCenter.off('mqtt-message', this.handleMsg);
      mqttClient.unsubscribe(`/resp/${this.data.deviceInfo.localName}`); // 取消MQTT订阅
    }
  },
  onShow: function (options) { },
  filterChange(event) {
    // tdesign input/search 组件输入事件为 event.detail.value
    this.setValue("macFilter", event.detail.value)
  },
  // 检查SSID是否包含特殊字符（如emoji）
  isSSIDValid(ssid) {
    const regex = emojiRegex();
    return !regex.test(ssid);
  },
  ssidChange(event) {
    const value = event.detail.value;
    if (!this.isSSIDValid(value)) {
      this.message('error', '该WiFi名称包含特殊字符或表情，暂不支持！', 5000);
      this.setValue("ssid", "");
      return;
    }
    this.setValue("ssid", value);
  },
  passwordChange(event) {
    this.setValue("password", event.detail.value)
  },
  initWifi() {
    wx.startWifi();
    wx.getConnectedWifi({
      success: function (res) {
        console.log('_this.isSSIDValid(value)', _this.isSSIDValid(res.wifi.SSID))
        if (!_this.isSSIDValid(res.wifi.SSID)) {
          _this.message('error', '该WiFi名称包含特殊字符或表情，暂不支持！', 5000);
          _this.setValue("ssid", "");
          return;
        }
        if (res.wifi.SSID.indexOf("5G") != -1) {
          _this.message('error', '不支持配置 5G 频段WiFi网络', 3000)
          return;
        }
        let password = wx.getStorageSync(res.wifi.SSID)
        console.log("restore password:", password)
        _this.setData({
          ssid: res.wifi.SSID,
          password: password == undefined ? "" : password
        })
      },
      fail: function (res) {
        console.log(res);
        _this.setData({
          ssid: null,
        })
      }
    });
  },
  writeCharacteristicValue: function (data) {
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: "0000FFFF-0000-1000-8000-00805F9B34FB",
      characteristicId: "0000FF01-0000-1000-8000-00805F9B34FB",
      value: data,
      success: function (res) { },
      fail: function (res) { }
    });
  },
  _startConfig: function () {
    if (!this.data.ssid) {
      this.message('error', 'WIFI名称不能为空', 3000)
      return;
    }
    if (!this.data.password) {
      this.message('error', 'WIFI密码不能为空', 3000)
      return;
    }
    // wx.showLoading({
    //   title: '正在配网',
    //   mask: true
    // });
    this.setValue("blufiloadInfo", "配网中")
    this.setValue("blufiLoadStatus", true)
    // 开始WiFi配置，设置网络配置状态为进行中
    this.setValue("networkSuccess", false)
    // xBlufi.notifySendRouterSsidAndPassword({
    //   ssid: this.data.ssid,
    //   password: this.data.password
    // })

    let ssid_payload = [0x09, 0x00, sequenceCounet++];
    let pwd_payload = [0x0D, 0x00, sequenceCounet++];
    let connect_payload = [0x0C, 0x00, 0x02, sequenceCounet++];

    var temp_ssid_payload = []
    for (var i = 0; i < this.data.ssid.length; i++) {
      var ssid_utf8 = this.encodeUtf8(this.data.ssid[i])
      console.log(ssid_utf8)
      temp_ssid_payload.push(...ssid_utf8);
    }

    ssid_payload.push(temp_ssid_payload.length);
    ssid_payload.push(...temp_ssid_payload);
    var temp_pwd_payload = []
    for (var i = 0; i < this.data.password.length; i++) {
      var pwd_utf8 = this.encodeUtf8(this.data.password[i])
      console.log(pwd_utf8)
      temp_pwd_payload.push(...pwd_utf8);
    }
    pwd_payload.push(temp_pwd_payload.length);
    pwd_payload.push(...temp_pwd_payload);


    var ssidArray = new Uint8Array(ssid_payload);
    var passwordArray = new Uint8Array(pwd_payload);
    var connectCMD = new Uint8Array(connect_payload);

    this.writeCharacteristicValue(ssidArray.buffer)
    this.writeCharacteristicValue(passwordArray.buffer)
    this.writeCharacteristicValue(connectCMD.buffer)

    timeout = setTimeout(() => {
      this.blufiTimeoutHandle()
    }, 60 * 1000)
  },
  get startConfig() {
    return this._startConfig;
  },
  set startConfig(value) {
    this._startConfig = value;
  },
  onShareAppMessage: function () {
    /// ignore
  },
  // 下一步
  nextBtnHandle() {
    this.setData({
      stepActive: this.data.stepActive + 1
    })

    // 扫描设备
    this.blufiBtnHandle()
  },
  // 选择设备
  bindChange(e) {
    let {
      value
    } = e?.detail
    this.setData({
      deviceInfo: value
    })
  },
  // 添加设备到团队
  addWifiDevice() {
    // 先检查是否已经在添加中，防止重复调用
    if (this.data.addFlag) {
      console.log('设备已在添加中，跳过重复调用');
      return;
    }

    // 立即设置标志，防止重复调用
    this.setValue("addFlag", true);

    let {
      deptId,
      deviceInfo
    } = this.data
    // 去掉deviceInfo.localName前面的GFKM-
    deviceBindApi(deptId, deviceInfo.localName).then(res => {
      if (res.code === 200) {
        this.message('success', '设备绑定成功！', 2000)
        setTimeout(() => {
          this.setValue("addSuccess", true)
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
      console.error("绑定接口异常", err)
      this.message('error', '设备绑定失败，请联系管理员绑定！', 3000)
      // 接口异常时重置标志，允许重试
      this.setValue("addFlag", false);
    })
  },
  startWifiInfo() {
    // 判断wifi名称和密码不能为空
    if (!this.data.ssid) {
      this.message('error', 'WIFI名称不能为空', 3000)
      return;
    }
    if (!this.data.password) {
      this.message('error', 'WIFI密码不能为空', 3000)
      return;
    }
    this.blufiBtnHandle();
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  message(type, text, duration = 1500) {
    showMessage(type, text, duration, this);
  },
  // 订阅MQTT消息
  subscribeTopic() {
    if (!this.data.deviceInfo) {
      return;
    }
    const mqttClient = app.globalData.mqttClient;
    if (mqttClient?.isConnected()) {
      const topic = `/resp/${this.data.deviceInfo.localName}`;
      console.log('订阅MQTT主题:', topic);
      mqttClient.subscribe(topic);
    } else {
      console.warn('MQTT未连接');
    }
  },
  // 处理MQTT消息
  handleMsg({
    topic,
    message
  }) {
    if (!this.data.deviceInfo) return;
    const expectedTopic = `/resp/${this.data.deviceInfo.localName}`;
    console.log('收到MQTT消息:', topic, message);
    if (topic === expectedTopic) {
      console.log('设备已联网，收到消息:', message);
      // 更新网络配置成功状态
      this.setValue('networkSuccess', true);
      // 如果还没添加设备，则添加
      if (!this.data.addFlag) {
        this.message('success', '设备已联网，正在添加到团队...', 2000);
        this.addWifiDevice();
      }
    }
  },
  // navBar的左侧返回
  handleBack() {
    console.log('自定义返回触发')
    // 获取当前页面栈实例
    let pages = getCurrentPages();
    console.log('页面栈长度:', pages, pages.length)
    if (pages.length <= 1) {
      // 如果只有一个页面，跳转到首页
      console.log('页面栈只有1个，跳转首页')
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
});