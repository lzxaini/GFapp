import Message from 'tdesign-miniprogram/message/index';
import {
  onMqttReady
} from '../../utils/mqttReady';
const dayjs = require('dayjs')
const app = getApp()
Page({
  data: {
    marginBottom: app.globalData.marginBottom,
    deviceFlag: false,
    deviceId: '',
    duration: 1000 * 10, // 3秒无响应则自动返回首页
    messages: [], // 消息列表
    scrollToView: '', // 滚动到的消息id
    inputText: '', // 输入框内容
    sendType: 'HEX', // string 或 hex
    btnText: 'HEX' // 按钮文本
  },
  // 切换发送类型
  toggleSendType(e) {
    let {
      type
    } = e?.currentTarget?.dataset
    const sendType = type;
    const btnText = type;
    this.setData({
      sendType,
      btnText
    });
  },
  onLoad(option) {
    let {
      deviceId
    } = option
    this.setData({
      deviceId
    })
    wx.eventCenter.on('mqtt-message', this.handleMsg);
    onMqttReady(() => {
      this.subscribeTopic();
    });
  },
  onUnload() {
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
    } else {
      console.warn('MQTT 未连接或还未初始化');
      Message.error({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '小程序初始化失败，请稍后再试！',
      });
    }
  },
  // 收到消息
  handleMsg({
    topic,
    message
  }) {
    console.log('设备列表收到消息：', topic, message);
    let {
      msg,
      result
    } = message
    if (topic === `/resp/${this.data.deviceId}`) {
      // 追加消息到列表
      const time = Date.now();
      const newMsg = {
        id: `msg-${time}`,
        text: typeof msg !== 'undefined' ? msg : JSON.stringify(message),
        time: dayjs(time).format('YYYY-DD-MM HH:mm:ss'),
        type: 'receive' // 接收的消息
      };
      const messages = this.data.messages.concat(newMsg);
      this.setData({
        messages,
        scrollToView: newMsg.id
      });
    }
  },
  // 输入框内容变化
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    });
  },
  // 发送消息
  sendMessage() {
    const text = this.data.inputText.trim();
    if (!text) {
      Message.warning({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '请输入消息内容',
      });
      return;
    }

    const mqttClient = app.globalData.mqttClient;
    if (!mqttClient?.isConnected()) {
      Message.error({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: 'MQTT未连接，发送失败',
      });
      return;
    }

    const topic = `/req/${this.data.deviceId}`;
    try {
      const mqttQrotocol = app.globalData.mqttQrotocol;
      if (this.data.sendType === 'HEX') {
        // HEX模式，调用ProtocolHelper.sendRawHex
        mqttQrotocol.sendRawHex(text, topic);
      } else {
        // String模式，直接发送字符串
        mqttQrotocol.sendString(text, topic);
      }
      // 添加到消息列表（发送的消息）
      const time = Date.now();
      const newMsg = {
        id: `msg-${time}`,
        text: text,
        time: dayjs(time).format('YYYY-DD-MM HH:mm:ss'),
        type: 'send',
        sendType: this.data.sendType
      };
      const messages = this.data.messages.concat(newMsg);
      this.setData({
        messages,
        scrollToView: newMsg.id,
        inputText: '' // 清空输入框
      });
      console.log('发送消息：', topic, text);
    } catch (error) {
      console.error('发送消息失败：', error);
      Message.error({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '发送消息失败',
      });
    }
  },
  send(e) {
    let {
      type
    } = e?.currentTarget?.dataset
    this.setData({
      sendType: "HEX",
      btnText: "HEX"
    });
    if (type === 'scan') {
      this.setData({
        inputText: '06000001'
      })
      this.sendMessage()
    } else {
      this.setData({
        inputText: '100000ff'
      })
      this.sendMessage()
    }
  },
  hexToString(e) {
    const {
      item
    } = e.currentTarget.dataset;
    const messages = this.data.messages.map(msg => {
      if (msg.id === item.id) {
        let newText = msg.text;
        // 判断当前内容是HEX还是String
        if (/^([0-9A-Fa-f]{2}\s*)+$/.test(newText)) {
          // HEX转字符串
          newText = newText.replace(/\s+/g, '').match(/.{2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join('');
        } else {
          // String转HEX
          newText = newText.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ').toUpperCase();
        }
        return {
          ...msg,
          text: newText
        };
      }
      return msg;
    });
    this.setData({
      messages
    });
  },
  clearLog() {
    this.setData({
      messages: [],
      scrollToView: ''
    });
  },
  goPage() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.reLaunch({
        url: '/development/index/index'
      });
    }
  }
})