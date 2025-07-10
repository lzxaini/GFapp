/*
 * @Author: 17630921248 1245634367@qq.com
 * @Date: 2025-06-18 13:25:55
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-07-10 12:55:30
 * @FilePath: \medical\utils\mqttProtocol.js
 * @Description: Fuck Bug
 * 微信：lizx2066
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
   * 发送指令
   * @param {number} funcCode 功能码，如 0x01
   * @param {string} dataHex 数据域，必须是十六进制字符串，如 '000001'
   * @param {string} topic 主题
   */
  send(funcCode, dataHex, topic) {
    if (!this.mqttClient?.isConnected()) {
      console.warn('MQTT 未连接');
      return;
    }

    const payload = funcCode.toString(16).padStart(2, '0') + dataHex.padStart(6, '0');
    console.log('发送 payload:', payload);
    this.mqttClient.publish(topic, payload);
  }

  /**
   * 解析接收到的消息
   * @param {string} hexPayload 十六进制字符串，如 '01000001'
   * @returns {object} 解析结果
   */
  parse(hexPayload) {
    const funcCode = parseInt(hexPayload.slice(0, 2), 16);
    const dataHex = hexPayload.slice(2);

    let result = { funcCode, dataHex };

    switch (funcCode) {
      case FunctionCode.StatusQuery:
        result.status = parseInt(dataHex, 16) === 1 ? '运行中' : '已停止';
        break;
      case FunctionCode.TimeQuery:
        result.minutes = parseInt(dataHex, 16);
        break;
      case FunctionCode.ServiceQuery:
        result.service = parseInt(dataHex, 16) === 1 ? '脸部护理' : '身体护理';
        break;
      case FunctionCode.HeartBeat:
        result.service = parseInt(dataHex.slice(0, 2), 16);
        result.remaining = parseInt(dataHex.slice(2, 4), 16);
        result.runState = parseInt(dataHex.slice(4, 6), 16);
        break;
      case FunctionCode.ScanQrCode:
        result.qrStatus = parseInt(dataHex, 16) === 1 ? '扫码成功' : '扫码失败';
        break;
      case FunctionCode.ControlDevice:
        const action = parseInt(dataHex.slice(0, 2), 16) === 1 ? '开始' : '结束';
        const time = parseInt(dataHex.slice(4, 6), 16);
        result.action = action;
        result.minutes = time;
        break;
      default:
        result.info = '未知功能码';
    }

    return result;
  }

  /**
   * 具体指令封装
   */
  sendStatusQuery(topic) {
    this.send(FunctionCode.StatusQuery, '', topic);
  }

  sendTimeQuery(topic) {
    this.send(FunctionCode.TimeQuery, '', topic);
  }

  sendServiceQuery(topic) {
    this.send(FunctionCode.ServiceQuery, '', topic);
  }

  sendScanQrCode(topic) {
    this.send(FunctionCode.ScanQrCode, '000001', topic);
  }

  sendControlDevice(topic, start, minutes) {
    // start: true = 开始，false = 结束
    const startHex = start ? '10' : '00';
    const timeHex = minutes.toString(16).padStart(2, '0');
    const dataHex = startHex + '000' + timeHex; // 例如: 10003C
    this.send(FunctionCode.ControlDevice, dataHex, topic);
  }
}

export { FunctionCode, ProtocolHelper };
