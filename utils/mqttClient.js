// utils/mqttClient.js
import mqtt from './mqtt.min.4.2.1.js'

class MqttClient {
  constructor() {
    this.client = null;
    this.options = {};
    this.url = '';
    this.onMessageCallback = null;
  }

  init(url, options = {}, callbacks = {}) {
    this.url = url;
    this.options = options;
    this.onMessageCallback = callbacks.onMessage || null;

    this.client = mqtt.connect(url, options);

    this.client.on('connect', (connack) => {
      console.log('[MQTT] ✅ Connected:', connack);
      callbacks.onConnect?.(connack);
    });

    this.client.on('reconnect', () => {
      console.log('[MQTT] 🔄 Reconnecting...');
      callbacks.onReconnect?.();
    });

    this.client.on('error', (error) => {
      console.error('[MQTT] ❌ Error:', error);
      callbacks.onError?.(error);
    });

    this.client.on('offline', () => {
      console.warn('[MQTT] ⚠️ Offline');
      callbacks.onOffline?.();
    });

    this.client.on('message', (topic, payload) => {
      const hexPayload = payload.toString('hex').toUpperCase();
      console.log(`[MQTT] 📩 Message: ${topic} => ${hexPayload}`);
      this.onMessageCallback?.(topic, hexPayload);
    });
  }

  isConnected() {
    return this.client && this.client.connected;
  }

  subscribe(topic, qos = 0) {
    if (!this.isConnected()) return this._showErr('请先连接服务器');
    this.client.subscribe(topic, { qos }, (err, granted) => {
      if (err) {
        this._showErr('订阅失败');
      } else {
        // this._showToast('订阅成功');
      }
    });
  }

  subscribeMany(topics) {
    if (!this.isConnected()) return this._showErr('请先连接服务器');
    this.client.subscribe(topics, (err, granted) => {
      if (err) {
        this._showErr('多主题订阅失败');
      } else {
        this._showToast('多主题订阅成功');
      }
    });
  }

  unsubscribe(topic) {
    if (!this.isConnected()) return this._showErr('请先连接服务器');
    this.client.unsubscribe(topic);
  }

  unsubscribeMany(topics) {
    this.unsubscribe(topics);
  }

  publish(topic, message) {
    if (!this.isConnected()) return this._showErr('请先连接服务器');
    this.client.publish(topic, JSON.stringify(message));
    // this._showToast('发布成功');
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client.removeAllListeners(); // ✅ 清除所有监听
      this.client = null;
      console.log('[MQTT] 🔌 Disconnected');
    }
  }

  _showToast(title) {
    wx.showToast({ title });
  }

  _showErr(title) {
    wx.showToast({ title, icon: 'none', duration: 2000 });
  }
}

export const mqttClient = new MqttClient();
