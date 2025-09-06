var xBlufi = require("../../utils/blufi/xBlufi.js");
var _this = null;
var timeout = null;
var sequenceCounet = 0;

const INPUT_STEP = 0;
const DONE_STEP = 1;

Page({
  data: {
    blufiloadInfo: "配置WiFi",
    blufiLoadStatus: false,
    showPassword: false,
    stepActive: 0,
    ssid: "",
    password: "",
    steps: [{
      text: '1.填写WiFi'
    },
    {
      text: '2.配网成功'
    }],
    deviceId: '',
    deviceName: '',
    wifiMac: '', // 扫码传入的wifi-mac地址
    targetMac: '', // 格式化后的MAC地址
    targetDevice: null // 目标设备信息
  },

  onLoad(options) {
    _this = this;
    const { wifiMac } = options;
    
    // 处理传入的wifi-mac地址
    let targetMac = '';
    if (wifiMac && wifiMac.startsWith('wifi-')) {
      const macWithoutPrefix = wifiMac.replace('wifi-', '');
      // 将无冒号的MAC地址转换为带冒号的格式 (aabbccddee -> aa:bb:cc:dd:ee)
      targetMac = macWithoutPrefix.match(/.{2}/g)?.join(':') || '';
      console.log('提取的目标MAC:', targetMac);
    }
    
    this.setData({
      wifiMac: wifiMac,
      targetMac: targetMac // 保存格式化后的MAC地址
    });
    
    xBlufi.initXBlufi(1);
    xBlufi.listenDeviceMsgEvent(true, this.blufiEventHandler);
    
    // 直接开始扫描并连接指定设备
    this.startScanAndConnect();
  },

  onUnload() {
    _this = this;
    if (_this.data.deviceId) {
      xBlufi.notifyConnectBle({
        isStart: false,
        deviceId: _this.data.deviceId,
        name: _this.data.deviceName,
      });
    }
    xBlufi.listenDeviceMsgEvent(false, null);
  },

  setValue(key, value) {
    this.setData({
      [key]: value,
    });
  },

  onClickeye() {
    this.setValue("showPassword", !this.data.showPassword);
  },

  // 开始扫描并连接指定设备
  startScanAndConnect() {
    wx.showLoading({
      title: '扫描设备中...',
    });
    
    xBlufi.notifyStartDiscoverBle({
      'isStart': true
    });
    
    // 设置扫描超时
    timeout = setTimeout(() => {
      xBlufi.notifyStartDiscoverBle({
        'isStart': false
      });
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '未找到指定设备，请确认设备是否处于配网模式',
        showCancel: false
      });
    }, 10000);
  },

  // 连接指定的设备
  connectTargetDevice(device) {
    clearTimeout(timeout);
    wx.showLoading({
      title: '连接设备中...',
    });
    
    xBlufi.notifyStartDiscoverBle({
      'isStart': false
    });
    
    console.log('连接deviceId:' + device.deviceId);
    xBlufi.notifyConnectBle({
      isStart: true,
      deviceId: device.deviceId,
      name: device.name
    });
    
    timeout = setTimeout(() => {
      this.blufiTimeoutHandle();
    }, 10000);
  },

  blufiEventHandler(options) {
    switch (options.type) {
      case xBlufi.XBLUFI_TYPE.TYPE_GET_DEVICE_LISTS:
        if (options.result && options.data) {
          console.log('扫描到的设备列表:', options.data);
          // 查找匹配的设备
          const targetDevice = options.data.find(device => {
            if (!device.deviceId || !_this.data.targetMac) return false;
            
            // 直接匹配，不转换大小写
            const match = device.deviceId === _this.data.targetMac;
            if (match) {
              console.log('找到匹配设备:', device);
            }
            return match;
          });
          
          if (targetDevice) {
            console.log('开始连接目标设备:', targetDevice);
            _this.setData({
              targetDevice: targetDevice
            });
            _this.connectTargetDevice(targetDevice);
          } else {
            console.log('未找到匹配设备，目标MAC:', _this.data.targetMac);
          }
        }
        break;
        
      case xBlufi.XBLUFI_TYPE.TYPE_CONNECTED:
        console.log("连接回调：" + JSON.stringify(options));
        if (options.result) {
          wx.hideLoading();
          wx.showToast({
            title: '连接成功',
            icon: 'none'
          });
          this.blufiTimeoutClear();
          this.setValue("deviceId", options.data.deviceId);
          xBlufi.notifyInitBleEsp32({
            deviceId: options.data.deviceId,
          });
          this.initWifi();
          sequenceCounet = 0;
        }
        break;
        
      case xBlufi.XBLUFI_TYPE.TYPE_CONNECT_ROUTER_RESULT:
        wx.hideLoading();
        if (!options.result) {
          wx.showModal({
            title: '温馨提示',
            content: '配网失败，请重试',
            showCancel: false
          });
          this.blufiReset();
        } else {
          if (options.data.progress == 100) {
            this.setValue("stepActive", 1);
            this.setValue("blufiloadInfo", "配网成功");
            this.setValue("blufiLoadStatus", false);
            this.blufiTimeoutClear();
            timeout = setTimeout(() => {
              wx.closeBLEConnection({
                deviceId: this.data.deviceId,
                success: function (res) { },
              });
              this.blufiReset();
              // 配网成功后返回上一页
              setTimeout(() => {
                wx.navigateBack();
              }, 1000);
            }, 1500);
          }
        }
        break;
        
      case xBlufi.XBLUFI_TYPE.TYPE_INIT_ESP32_RESULT:
        wx.hideLoading();
        console.log("初始化结果：", JSON.stringify(options));
        if (options.result) {
          console.log('初始化成功');
        } else {
          console.log('初始化失败');
          wx.showModal({
            title: '温馨提示',
            content: `设备初始化失败`,
            showCancel: false,
            success: function (res) {
              wx.navigateBack();
            }
          });
        }
        break;
    }
  },

  blufiReset() {
    if (this.data.deviceId) {
      wx.closeBLEConnection({
        deviceId: this.data.deviceId,
        success: function (res) { },
      });
    }
    this.setValue("blufiloadInfo", "配置WiFi");
    this.setValue("blufiLoadStatus", false);
    this.setValue("stepActive", 0);
    this.setValue("deviceId", '');
  },

  blufiTimeoutHandle() {
    wx.hideLoading();
    wx.showToast({
      title: '配网超时, 请重试',
      icon: 'none'
    });
    this.blufiReset();
    timeout = null;
  },

  blufiTimeoutClear() {
    if (timeout) {
      clearTimeout(timeout);
    }
  },

  encodeUtf8(text) {
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

  ssidChange(event) {
    this.setValue("ssid", event.detail.value);
  },

  passwordChange(event) {
    this.setValue("password", event.detail.value);
  },

  initWifi() {
    wx.startWifi();
    wx.getConnectedWifi({
      success: function (res) {
        if (res.wifi.SSID.indexOf("5G") != -1) {
          wx.showToast({
            title: '不支持配置5G WiFi网络',
            icon: 'none',
            duration: 3000
          });
        }
        let password = wx.getStorageSync(res.wifi.SSID);
        console.log("restore password:", password);
        _this.setData({
          ssid: res.wifi.SSID,
          password: password == undefined ? "" : password
        });
      },
      fail: function (res) {
        console.log(res);
        _this.setData({
          ssid: null,
        });
      }
    });
  },

  writeCharacteristicValue(data) {
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: "0000FFFF-0000-1000-8000-00805F9B34FB",
      characteristicId: "0000FF01-0000-1000-8000-00805F9B34FB",
      value: data,
      success: function (res) { },
      fail: function (res) { }
    });
  },

  startConfig() {
    if (!this.data.ssid) {
      wx.showToast({
        title: 'SSID不能为空',
        icon: 'none'
      });
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '正在配网',
      mask: true
    });
    this.setValue("blufiloadInfo", "配网中");
    this.setValue("blufiLoadStatus", true);

    let ssid_payload = [0x09, 0x00, sequenceCounet++];
    let pwd_payload = [0x0D, 0x00, sequenceCounet++];
    let connect_payload = [0x0C, 0x00, 0x02, sequenceCounet++];

    var temp_ssid_payload = [];
    for(var i = 0; i < this.data.ssid.length; i++){
      var ssid_utf8 = this.encodeUtf8(this.data.ssid[i]);
      temp_ssid_payload.push(...ssid_utf8);
    }

    ssid_payload.push(temp_ssid_payload.length);
    ssid_payload.push(...temp_ssid_payload);
    
    var temp_pwd_payload = [];
    for(var i = 0; i < this.data.password.length; i++){
      var pwd_utf8 = this.encodeUtf8(this.data.password[i]);
      temp_pwd_payload.push(...pwd_utf8);
    }
    pwd_payload.push(temp_pwd_payload.length);
    pwd_payload.push(...temp_pwd_payload);

    var ssidArray = new Uint8Array(ssid_payload);
    var passwordArray = new Uint8Array(pwd_payload);
    var connectCMD = new Uint8Array(connect_payload);

    this.writeCharacteristicValue(ssidArray.buffer);
    this.writeCharacteristicValue(passwordArray.buffer);
    this.writeCharacteristicValue(connectCMD.buffer);

    timeout = setTimeout(() => {
      this.blufiTimeoutHandle();
    }, 20000);
  }
})