const httpStatus = require('http-status');
const { Organization } = require('../models');

/**
 * Load organization and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const organization = await Organization.findById(id);
    req.locals = { organization };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get organization
 * @public
 */
exports.get = (req, res) => res.json(req.locals.organization);

/**
 * Create new organization
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const organization = new Organization(req.body);
    const savedOrg = await organization.save();
    res.status(httpStatus.CREATED);
    res.json(savedOrg.transform());
  } catch (error) {
    next(Organization.checkDuplicate(error));
  }
};

/**
 * Update existing organization
 * @public
 */
exports.update = (req, res, next) => {
  const { organization } = req.locals;
  organization
    .update(req.body)
    .then((savedOrg) => res.json(savedOrg))
    .catch((e) => {
      next(Organization.checkDuplicate(e));
    });
};

/**
 * Get organization list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const organizations = await Organization.list(req.query);
    res.json(organizations);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete organization
 * @public
 */
exports.remove = (req, res, next) => {
  const { organization } = req.locals;

  organization
    .destroy()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
