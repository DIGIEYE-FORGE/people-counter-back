const httpStatus = require('http-status');
const { omit } = require('lodash');
const { Config } = require('../models');

/**
 * Load config and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const config = await Config.findById(id);
    req.locals = { config };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get config
 * @public
 */
exports.get = (req, res) => res.json(req.locals.config.transform());

/**
 * Get logged in config info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.config.transform());

/**
 * Create new config
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const config = new Config(req.body);
    const savedConfig = await config.save();
    res.status(httpStatus.CREATED);
    res.json(savedConfig.transform());
  } catch (error) {
    next(Config.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing config
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { config } = req.locals;
    const newConfig = new Config(req.body);
    const ommitRole = config.role !== 'admin' ? 'role' : '';
    const newConfigObject = omit(newConfig.toObject(), '_id', ommitRole);

    await config.updateOne(newConfigObject, { override: true, upsert: true });
    const savedConfig = await Config.findById(config._id);

    res.json(savedConfig.transform());
  } catch (error) {
    next(Config.checkDuplicateEmail(error));
  }
};

/**
 * Update existing config
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.config.role !== 'admin' ? 'role' : '';
  const updatedConfig = omit(req.body, ommitRole);
  const config = Object.assign(req.locals.config, updatedConfig);

  config
    .save()
    .then((savedConfig) => res.json(savedConfig.transform()))
    .catch((e) => next(Config.checkDuplicateEmail(e)));
};

/**
 * Get config list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const configs = await Config.list(req.query);
    res.json(configs);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete config
 * @public
 */
exports.remove = (req, res, next) => {
  const { config } = req.locals;

  config
    .destroy()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
