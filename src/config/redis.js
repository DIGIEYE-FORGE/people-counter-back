const redis = require('redis');
const crypto = require('crypto');
const { promisify } = require('util');
const logger = require('./logger');
const { redisConfig } = require('./vars');

// create redis client
const client = redis.createClient(redisConfig);

// convert redis promises to async functions
const hgetall = promisify(client.hgetall).bind(client);
const del = promisify(client.del).bind(client);
const hmset = promisify(client.hmset).bind(client);
const get = promisify(client.get).bind(client);

// Exit application on error
client.on('error', (err) => {
  logger.error(`redis connection error: ${err}`);
  process.exit(-1);
});

/**
 * select token db and return client redis
 * @return {Object} redis client
 * @public
 *
 */
exports.refreshTokens = () => {
  client.select(5);
  return client;
};

/**
 * select token db and return client redis
 * @return {Object} redis client
 * @public
 *
 */
exports.blackListToken = () => {
  client.select(4);
  return client;
};

/**
 * Generate a refresh token object and saves it into the database
 *
 * @param {User} user
 * @returns {RefreshToken|Error}
 */
exports.generateRefreshToken = async (user) => {
  try {
    client.select(5);
    const userId = user.id;
    const userEmail = user.email;
    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const body = {
      token,
      userId: userId.toString(),
      email: userEmail,
    };
    const result = await hmset(token, Object.entries(body).flat());
    client.expire(token, 30 * 24 * 60 * 60);
    if (result) return body;
  } catch (err) {
    logger.error(err);
  }
  return {};
};

/**
 * remove refresh token from database
 *
 * @param {User} user
 * @returns {RefreshToken|Error}
 */
exports.removeRefreshToken = async (refreshToken) => {
  try {
    client.select(5);
    const result = await hgetall(refreshToken);
    const resultDel = await del(refreshToken);
    return { refreshObject: result, state: resultDel };
  } catch (err) {
    logger.error(err);
  }
  return { refreshObject: null, state: false };
};

/**
 * check if refresh token object is in back list database
 *
 * @param {User} user
 * @returns {RefreshToken|Error}
 */
exports.checkBlackListToken = async (token) => {
  let result = false;
  try {
    client.select(5);
    result = await get(token);
  } catch (err) {
    logger.error(err);
  }
  return { isBack: result || false };
};
