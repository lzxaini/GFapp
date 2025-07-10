/*
 * @Author: 17630921248 1245634367@qq.com
 * @Date: 2025-06-18 13:25:55
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-07-10 14:24:06
 * @FilePath: \medical\utils\mqttProtocol.js
 * @Description: Fuck Bug
 * 微信：lizx2066
 */
/**
 * 协议功能码
 */
const FunctionCode = {
  StatusQuery: 0x01,
  TimeQuery: 0x02,
  ServiceQuery: 0x03,
  HeartBeat: 0x05,
  ScanQrCode: 0x06,
  ControlDevice: 0x10
};

class ProtocolHelper {
  constructor(mqttClient) {
    this.mqttClient = mqttClient;
  }

  /**
   * 拼接 HEX 指令并发送
   * @param {number} funcCode 功能码
   * @param {string} dataHex 数据域（已是 HEX，不带0x）
   * @param {string} topic MQTT主题
   */
  send(funcCode, dataHex, topic) {
    if (!this.mqttClient?.isConnected()) {
      console.warn('MQTT 未连接');
      return;
    }

    const hexCode = funcCode.toString(16).padStart(2, '0').toUpperCase();
    const hexData = dataHex.padStart(6, '0').toUpperCase();
    const payload = hexCode + hexData;

    console.log('🚀 发送 HEX:', payload);
    this.mqttClient.publish(topic, payload);
  }

  /**
   * 解析 HEX 返回值
   * @param {string} hexPayload 例如 01000001
   * @returns {object}
   */
  parse(hexPayload) {
    const funcCode = parseInt(hexPayload.slice(0, 2), 16);
    const dataHex = hexPayload.slice(2).toUpperCase();
    const result = { funcCode, dataHex };

    switch (funcCode) {
      case FunctionCode.StatusQuery:
        result.status = this._parseStatus(dataHex);
        break;
      case FunctionCode.TimeQuery:
        result.minutes = parseInt(dataHex, 16);
        break;
      case FunctionCode.ServiceQuery:
        result.service = parseInt(dataHex, 16);
        break;
      case FunctionCode.HeartBeat:
        result.service = parseInt(dataHex.slice(0, 2), 16);
        result.remaining = parseInt(dataHex.slice(2, 4), 16);
        result.state = parseInt(dataHex.slice(4, 6), 16);
        break;
      case FunctionCode.ScanQrCode:
        result.qr = parseInt(dataHex, 16);
        break;
      case FunctionCode.ControlDevice:
        result.action = parseInt(dataHex.slice(0, 2), 16);
        result.minutes = parseInt(dataHex.slice(4, 6), 16);
        break;
      default:
        result.info = '未知功能码';
    }
    return result;
  }

  _parseStatus(dataHex) {
    const status = parseInt(dataHex, 16);
    if (status === 1) return '运行中';
    if (status === 2) return '停止';
    return '未知状态';
  }

  /**
   * 下面是快捷指令，自动生成 HEX
   */
  statusQuery(topic) {
    this.send(FunctionCode.StatusQuery, '', topic);
  }

  timeQuery(topic) {
    this.send(FunctionCode.TimeQuery, '', topic);
  }

  serviceQuery(topic) {
    this.send(FunctionCode.ServiceQuery, '', topic);
  }

  sendScanQrCode(topic) {
    this.send(FunctionCode.ScanQrCode, '000001', topic);
  }

  controlDevice(topic, start, minutes) {
    const startHex = start ? '10' : '00';
    const timeHex = minutes.toString(16).padStart(2, '0').toUpperCase();
    const dataHex = startHex + '000' + timeHex; // 10003C
    this.send(FunctionCode.ControlDevice, dataHex, topic);
  }
}

export { FunctionCode, ProtocolHelper };
