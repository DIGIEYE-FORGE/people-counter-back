const { Event } = require('../models');

/**
 * Get event list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const events = await Event.list(req.query);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

/**
 * Get event list by area
 * @public
 */
exports.listByArea = async (req, res, next) => {
  try {
    const events = await Event.findAll(req.query);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

/**
 * Get event list by place
 * @public
 */
exports.listByPlace = async (req, res, next) => {
  try {
    const events = await Event.findAll(req.query);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

/**
 * Get event list by place
 * @public
 */
exports.allInOut = async (req, res, next) => {
  try {
    const events = await Event.inOut(req.query);
    res.json(events);
  } catch (error) {
    next(error);
  }
};
