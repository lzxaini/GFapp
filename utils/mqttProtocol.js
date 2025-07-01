const FunctionCode = {
  StatusQuery: 0x01,     // 运行状态查询
  TimeQuery: 0x02,       // 运行时间查询
  ServiceQuery: 0x03,    // 服务内容查询
  ControlDevice: 0x10    // 控制设备运行
};

function padHex(str, length) {
  return str.toString().padStart(length, '0');
}

// 构建发送指令
function buildMessage(code, data = '000000') {
  const codeHex = padHex(code.toString(16), 2);
  const dataHex = padHex(data, 6);
  return codeHex + dataHex;
}

// 解析设备返回的指令
function parseMessage(hexStr) {
  const codeHex = hexStr.slice(0, 2);
  const dataHex = hexStr.slice(2, 8);
  const code = parseInt(codeHex, 16);

  let description = '';
  switch (code) {
    case FunctionCode.StatusQuery:
      if (dataHex === '000001') {
        description = '正在运行';
      } else if (dataHex === '000002') {
        description = '停止运行';
      } else {
        description = '未知状态';
      }
      break;

    case FunctionCode.TimeQuery:
      const minutes = parseInt(dataHex, 16);
      description = `${minutes} 分钟后结束`;
      break;

    case FunctionCode.ServiceQuery:
      if (dataHex === '000001') {
        description = '脸部护理';
      } else if (dataHex === '000002') {
        description = '身体护理';
      } else {
        description = '未知服务';
      }
      break;

    case FunctionCode.ControlDevice:
      const state = dataHex[0] === '1' ? '开始运行' : '停止运行';
      const runTime = parseInt(dataHex.slice(3), 16);
      description = `${state} ${runTime} 分钟`;
      break;

    default:
      description = '未知功能码';
  }

  return {
    code,
    rawData: dataHex,
    description
  };
}
module.exports = { FunctionCode, buildMessage, parseMessage };
// // 模块导出
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = { FunctionCode, buildMessage, parseMessage };
// } else {
//   // 适配小程序
//   window.MQTTProtocol = { FunctionCode, buildMessage, parseMessage };
// }
