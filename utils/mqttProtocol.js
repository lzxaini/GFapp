/*
 * @Author: 17630921248 1245634367@qq.com
 * @Date: 2025-06-18 13:25:55
 * @LastEditors: 17630921248 1245634367@qq.com
 * @LastEditTime: 2025-09-01 08:59:21
 * @FilePath: \medical\utils\mqttProtocol.js
 * @Description: Fuck Bug
 * 微信：lizx2066
 */
import { Buffer } from 'buffer';
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

    const hexCode = funcCode.toString(16).padStart(2, '0').toUpperCase();  // 保持 funcCode 为十六进制
    const hexData = dataHex.replace(/\s+/g, ''); // 去除dataHex中的空格，确保它是有效的十六进制数
    const payload = Buffer.from(hexCode + hexData, 'hex');
    console.log("🥵 ~ ProtocolHelper ~ send ~ payload: ", payload)
    this.mqttClient.client.publish(topic, payload);
  }

  /**
   * 直接发送原始HEX数据，不拼接功能码
   * @param {string} dataHex HEX字符串（不带0x）
   * @param {string} topic MQTT主题
   */
  sendRawHex(dataHex, topic) {
    if (!this.mqttClient?.isConnected()) {
      console.warn('MQTT 未连接');
      return;
    }
    const hexData = dataHex.replace(/\s+/g, '');
    const payload = Buffer.from(hexData, 'hex');
    this.mqttClient.client.publish(topic, payload);
  }
  /**
   * 解析 HEX 返回值
   * @param {string} hexPayload 例如 01000001
   * @returns {object}
   */
  parse(hexPayload) {
    console.log("🥵 ~ ProtocolHelper ~ parse ~ hexPayload: ", hexPayload)
    
    // 按协议解析
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
        // 未知功能码，尝试转换为字符串
        try {
          const hexStr = hexPayload.replace(/\s+/g, '');
          if (hexStr.length % 2 === 0) {
            const bytes = hexStr.match(/.{2}/g);
            const str = bytes.map(h => String.fromCharCode(parseInt(h, 16))).join('');
            // 检测是否为可打印字符串（ASCII 32-126，加上常见的换行符等）
            const isPrintable = str.split('').every(c => {
              const code = c.charCodeAt(0);
              return (code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9;
            });
            
            if (isPrintable && str.length > 2) {
              // 如果是可读字符串，返回字符串格式
              return {
                type: 'string',
                string: str.trim(),
                hex: hexPayload
              };
            }
          }
        } catch (e) {
          console.log('转换字符串失败，保持原格式');
        }
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
    const dataHex = startHex + '00' + timeHex; // 10003C
    this.send(FunctionCode.ControlDevice, dataHex, topic);
  }

  /**
   * 发送纯字符串消息
   * @param {string} str 要发送的字符串
   * @param {string} topic MQTT主题
   */
  sendString(str, topic) {
    this.mqttClient.client.publish(topic, str);
  }
}

export { FunctionCode, ProtocolHelper };
