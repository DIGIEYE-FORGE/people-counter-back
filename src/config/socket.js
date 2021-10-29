const net = require('net');
const dayjs = require('dayjs');
const { Event, Device } = require('../api/models');

const HEAD_OFFSET = 3;
const FOOT_OFFSET = 3;

const server = net.createServer((socket) => {
  socket.write('Echo server\r\n');

  socket.on('data', (dataBuffer) => {
    // remove header + footer bytes and decode
    const payload = dataBuffer.toString(
      'utf8',
      HEAD_OFFSET,
      dataBuffer.length - FOOT_OFFSET,
    );
    handleMessage(socket, payload);
  });

  socket.on('close', () => {});

  socket.on('error', (err) => {
    console.log(err);
  });
});

// eslint-disable-next-line consistent-return
const handleMessage = (socket, payload) => {
  if (payload.includes('UP_SENSOR_DATA_REQ')) {
    return handleSensorDataUpload(socket, payload);
  }

  if (payload.includes('TIME_SYSNC_REQ')) {
    return handleSensorTimeSync(socket, payload);
  }

  console.log('unknown message type');
};

const getValueInTag = (str, tagName) =>
  // eslint-disable-next-line no-useless-escape
  str.match(new RegExp(`(?<=<${tagName}>)(.*)(?=<\/${tagName}>)`))[0];

const handleSensorDataUpload = async (socket, payload) => {
  const uuid = getValueInTag(payload, 'uuid');
  const inCount = getValueInTag(payload, 'in');
  const outCount = getValueInTag(payload, 'out');
  const batteryLevel = getValueInTag(payload, 'battery_level');
  const recType = getValueInTag(payload, 'rec_type');
  const signalStatus = getValueInTag(payload, 'warn_status');
  const batterytxLevel = getValueInTag(payload, 'batterytx_level');
  const warnStatus = getValueInTag(payload, 'signal_status');
  if (inCount === 0 && outCount === 0) return;
  await Event.create({
    uuid,
    in: inCount,
    out: outCount,
    batteryLevel,
    recType,
    signalStatus,
    batterytxLevel,
    warnStatus,
  });
};

const generateTimeSyncResponsePayload = (
  uuid,
  uploadInterval,
  time,
  start,
  end,
  ret,
) =>
  `<TIME_SYSNC_RES><uuid>${uuid}</uuid><ret>${ret}</ret><time>${time}</time><uploadInterval>${uploadInterval}</uploadInterval><dataStartTime>${start}</dataStartTime><dataEndTime>${end}</dataEndTime></TIME_SYSNC_RES>`;

const generateResponseBuffer = (strPayload) => {
  const head = Buffer.from('fa f5 f6');
  const foot = Buffer.from('fa f6 f5');
  const payload = Buffer.from(strPayload, 'utf-8');
  return Buffer.concat([head, payload, foot]);
};
const handleSensorTimeSync = async (socket, payload) => {
  const uuid = getValueInTag(payload, 'uuid');

  const device = await Device.findById(uuid);
  const responsePayload = generateTimeSyncResponsePayload(
    uuid,
    device.Config.uploadInterval.replace(':', ''),
    dayjs(new Date()).format('yyyyMMddHHmmss'),
    device.Config.dataStartTime.replace(':', ''), // HHMM military time format
    device.Config.dataEndTime.replace(':', ''),
    device.Config.ret,
  );

  const response = generateResponseBuffer(responsePayload);
  socket.write(response);
};

module.exports = server;
