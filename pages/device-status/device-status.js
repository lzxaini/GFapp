import {
  onMqttReady
} from '../../utils/mqttReady';
const app = getApp();
import {
  showMessage
} from '../../utils/tools';
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    deviceFlag: false,
    deviceId: '',
    reconnectInterval: 1500, // 重试间隔（单位：ms）
    reconnectMaxCount: 6, // 最多重试次数
    reconnectCount: 0, // 当前重试次数
    reconnectTimer: null, // 定时器引用
  },
  onLoad(option) {
    const {
      deviceId
    } = option;
    this.setData({
      deviceId
    });
    wx.eventCenter.on('mqtt-message', this.handleMsg);
    onMqttReady(() => {
      this.subscribeTopic();
    });
    this.connectDevice()
  },
  onUnload() {
    this.clearReconnect()
    const mqttClient = app.globalData.mqttClient;
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
    mqttClient.unsubscribe(`/resp/${this.data.deviceId}`);
  },
  subscribeTopic() {
    const mqttClient = app.globalData.mqttClient;
    if (mqttClient?.isConnected()) {
      console.log('订阅', `/resp/${this.data.deviceId}`)
      mqttClient.subscribe(`/resp/${this.data.deviceId}`);
      this.connectDevice()
    } else {
      console.warn('MQTT 未连接或还未初始化');
      showMessage('error', '小程序初始化失败，请稍后再试！', 3000, this);
    }
  },
  // === 接收消息 ===
  handleMsg({
    topic,
    message
  }) {
    if (!this.data.deviceId) return;
    const expectedTopic = `/resp/${this.data.deviceId}`;
    console.log('收到MQTT消息:', topic, message);
    if (topic === expectedTopic) {
      this.clearReconnect()
      console.log('设备已联网，收到消息:', message);
      this.setData({
        deviceFlag: true
      })
      wx.redirectTo({
        url: `/pages/device-active/device-active?deviceId=${this.data.deviceId}`,
      });
    }
  },

  // === 启动扫码连接 + 定时重连逻辑 ===
  connectDevice() {
    const {
      reconnectInterval,
      reconnectMaxCount,
      deviceId
    } = this.data;
    let userInfo = getApp().globalData.userInfo
    let _this = this;
    const mqttQrotocol = app.globalData.mqttQrotocol;
    this.clearReconnect(); // 防止多次触发
    const timer = setInterval(() => {
      if (this.data.reconnectCount >= reconnectMaxCount) {
        console.warn('查询超时，已超过最大重试次数');
        this.clearReconnect();
        showMessage('error', '设备未配网，请先将设备配网！', 3000, _this);
        setTimeout(() => {
          wx.redirectTo({
            url: `/pages/blufi-network/blufi-network?deptId=${userInfo.dept.deptId}`,
          })
        }, 2500);
        return;
      }
      console.log(`第 ${this.data.reconnectCount + 1} 次尝试连接设备...`);
      mqttQrotocol.sendString('get-qr-code', `/req/${deviceId}`);
      this.setData({
        reconnectCount: this.data.reconnectCount + 1
      });
    }, reconnectInterval);
    this.setData({
      reconnectTimer: timer,
      reconnectCount: 0
    });
  },
  // === 清除定时器 ===
  clearReconnect() {
    if (this.data.reconnectTimer) {
      clearInterval(this.data.reconnectTimer);
      this.setData({
        reconnectTimer: null,
        reconnectCount: 0
      });
    }
  },
  // navBar的左侧返回
  handleBack() {
    this.clearReconnect()
    wx.navigateBack(1)
  }
});