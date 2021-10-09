const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const { Place } = require('../models');

/**
 * Load place and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const place = await Place.findById(id);
    req.locals = { place };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get place
 * @public
 */
exports.get = (req, res) => res.json(req.locals.place);

/**
 * Create new place
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const data = omitBy(req.body, isNil);
    const place = new Place(data);

    const savedPlace = await place.save();
    res.status(httpStatus.CREATED);
    res.json(savedPlace.transform());
  } catch (error) {
    next(Place.checkDuplicateEmail(error));
  }
};

/**
 * Update existing place
 * @public
 */
exports.update = (req, res, next) => {
  const data = omitBy(req.body, isNil);
  const { place } = req.locals;
  // TODO handle area not found
  place
    .update(data)
    .then((savedPlace) => res.json(savedPlace.transform()))
    .catch((e) => {
      console.log(e);
      next(Place.checkDuplicateEmail(e));
    });
};

/**
 * Get place list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const places = await Place.findAll(req.query);
    res.json(places);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete place
 * @public
 */
exports.remove = (req, res, next) => {
  const { place } = req.locals;

  place
    .destroy()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
