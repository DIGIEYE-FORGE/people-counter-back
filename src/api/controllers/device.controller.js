const httpStatus = require('http-status');
const { Device } = require('../models');

/**
 * Load device and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const device = await Device.findById(id);
    req.locals = { device };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Load device and append to req.
 * @public
 */
exports.getByOrg = async (req, res) => {
  try {
    const devices = await Device.findByOrg(req.body.id);
    res.json(devices);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get device
 * @public
 */
exports.get = (req, res) => res.json(req.locals.device);

/**
 * Create new device
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const device = new Device(req.body);
    const savedDevice = await device.save();
    res.status(httpStatus.CREATED);
    res.json(savedDevice.transform());
  } catch (error) {
    next(Device.checkDuplicateEmail(error));
  }
};

/**
 * Update existing device
 * @public
 */
exports.update = (req, res, next) => {
  const { device } = req.locals;
  device
    .update(req.body)
    .then((savedDevice) => res.json(savedDevice))
    .catch((e) => {
      console.log(e);
      next(Device.checkDuplicateEmail(e));
    });
};

/**
 * Get device list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const devices = await Device.list(req.query);
    res.json(devices);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete device
 * @public
 */
exports.remove = (req, res, next) => {
  const { device } = req.locals;

  device
    .destroy()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
