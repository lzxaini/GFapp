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
    reconnectInterval: 2000, // 重试间隔（单位：ms）
    reconnectMaxCount: 20, // 最多重试次数
    reconnectCount: 0, // 当前重试次数
    reconnectTimer: null, // 定时器引用
    resetNetwork: false, // 是否重新配网
    showGuide: false, // 是否显示引导
    current: 0, // 当前步骤
    steps: [],
    btnObj: {
      content: '取消',
      theme: 'danger'
    }
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
      // 立即执行一次扫码连接
      const mqttQrotocol = app.globalData.mqttQrotocol;
      mqttQrotocol.sendScanQrCode(`/req/${deviceId}`);
      this.connectDevice(); // 启动定时重连
    });
  },
  onUnload() {
    const mqttClient = app.globalData.mqttClient;
    wx.eventCenter.off('mqtt-ready', this.subscribeTopic);
    wx.eventCenter.off('mqtt-message', this.handleMsg);
    this.clearReconnect(); // 清除重连定时器
    mqttClient.unsubscribe(`/resp/${this.data.deviceId}`);
  },
  subscribeTopic() {
    const mqttClient = app.globalData.mqttClient;
    if (mqttClient?.isConnected()) {
      console.log('订阅', `/resp/${this.data.deviceId}`)
      mqttClient.subscribe(`/resp/${this.data.deviceId}`);
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
    console.log('设备列表收到消息：', topic, message);
    const {
      msg,
      result
    } = message;
    if (topic === `/resp/${this.data.deviceId}` && msg === '06000001') {
      this.setData({
        deviceFlag: true
      });
      this.clearReconnect(); // 停止重连
    }
    if (
      topic === `/resp/${this.data.deviceId}` &&
      result?.funcCode === 5 &&
      result?.state === 1
    ) {
      wx.redirectTo({
        url: `/pages/device-use/device-use?deviceId=${this.data.deviceId}`,
      });
    }
    if (topic === `/resp/${this.data.deviceId}` && result?.string === this.data.deviceId && this.data.resetNetwork) {
      wx.showLoading({
        title: '重置中...',
      })
      const mqttQrotocol = app.globalData.mqttQrotocol;
      mqttQrotocol.sendString('network-reset', `/req/${this.data.deviceId}`);
      setTimeout(() => {
        mqttQrotocol.sendString('network-reset', `/req/${this.data.deviceId}`);
        setTimeout(() => {
          wx.hideLoading()
          wx.navigateBack(1);
        }, 1000);
      }, 7 * 1000)
    }
  },

  // 引导
  attached() {
    this.setData({
      current: 0,
      showGuide: true,
      steps: [{
        element: () =>
          new Promise((resolve) =>
            this.createSelectorQuery()
            .select('.item1')
            .boundingClientRect((rect) => resolve(rect))
            .exec(),
          ),
        title: '重要提醒',
        body: '您将对该设备，进行重置网络的操作，重置网络后可对该设备重新联网，重置网络的操作不可逆，请您确定！',
        placement: 'bottom',
      }, {
        element: () =>
          new Promise((resolve) =>
            this.createSelectorQuery()
            .select('.item2')
            .boundingClientRect((rect) => resolve(rect))
            .exec(),
          ),
        title: '重置网络',
        body: '确定设备为通电状态，并且保持设备的网络在线！',
        placement: 'center',
      }, {
        element: () =>
          new Promise((resolve) =>
            this.createSelectorQuery()
            .select('.item3')
            .boundingClientRect((rect) => resolve(rect))
            .exec(),
          ),
        title: '重置网络',
        body: '设备重置网络的过程中，请勿将设备断电，等待页面提醒！',
        placement: 'center',
      }, {
        element: () =>
          new Promise((resolve) =>
            this.createSelectorQuery()
            .select('.item4')
            .boundingClientRect((rect) => resolve(rect))
            .exec(),
          ),
        title: '重置网络',
        body: '不可撤销，点击重置按钮，设备将重新进入网络配置模式！',
        placement: 'center',
      }],
    });
  },
  // === 启动扫码连接 + 定时重连逻辑 ===
  connectDevice() {
    const {
      reconnectInterval,
      reconnectMaxCount,
      deviceId
    } = this.data;
    let _this = this;
    const mqttQrotocol = app.globalData.mqttQrotocol;
    this.clearReconnect(); // 防止多次触发
    const timer = setInterval(() => {
      if (this.data.reconnectCount >= reconnectMaxCount) {
        console.warn('连接超时，已超过最大重试次数');
        this.clearReconnect();
        showMessage('error', '连接超时，设备激活失败，请稍后再试！', 3000, _this);
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }, 2500);
        return;
      }
      console.log(`第 ${this.data.reconnectCount + 1} 次尝试连接设备...`);
      mqttQrotocol.sendScanQrCode(`/req/${deviceId}`);
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
  // === 显示设备移机引导 ===
  showDeviceMoveGuide() {
    this.attached();
  },
  // === 重置设备配网 ===
  resetDeviceNetwork() {
    console.log('adasd', this.data.deviceId)
    const mqttQrotocol = app.globalData.mqttQrotocol;
    mqttQrotocol.sendString('get-qr-code', `/req/${this.data.deviceId}`);
    this.setData({
      resetNetwork: true
    })
  },
  // === 引导步骤变化 ===
  handleGuideChange(e) {
    const {
      current
    } = e.detail;
    this.setData({
      current
    });
  },
  // === 跳过引导 ===
  handleGuideSkip() {
    this.setData({
      current: 0,
      showGuide: false,
    });
  },
  // === 完成引导并重置设备 ===
  handleGuideFinish() {
    console.log('完成引导')
  },
  // navBar的左侧返回
  handleBack() {
    this.clearReconnect()
    // 获取当前页面栈实例
    let pages = getCurrentPages();
    console.log('页面栈', pages)
    if (pages.length === 1) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
});