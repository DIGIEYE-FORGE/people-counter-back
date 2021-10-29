const httpStatus = require('http-status');
const Area = require('../models/area.model');

/**
 * Load area and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const area = await Area.findById(id);
    req.locals = { area };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get area
 * @public
 */
exports.get = (req, res) => res.json(req.locals.area);

/**
 * Create new area
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const area = new Area(req.body);
    const savedArea = await area.save();
    res.status(httpStatus.CREATED);
    res.json(savedArea.transform());
  } catch (error) {
    console.log(error);
    // next(Area.checkDuplicateEmail(error));
  }
};

/**
 * Update existing area
 * @public
 */
exports.update = (req, res, next) => {
  const { area } = req.locals;
  area
    .update(req.body)
    .then((savedArea) => res.json(savedArea))
    .catch((e) => {
      console.log(e);
      // next(Area.checkDuplicateEmail(e));
    });
};

/**
 * Get area list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const areas = await Area.findAll(req.query);
    res.json(areas);
  } catch (error) {
    next(error);
  }
};

/**
 * Get area list by organization
 * @public
 */
exports.listByOrg = async (req, res, next) => {
  try {
    const areas = await Area.findByOrg(req.params.orgId);
    res.json(areas);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete area
 * @public
 */
exports.remove = (req, res, next) => {
  const { area } = req.locals;

  area
    .destroy()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
