/* eslint-disable indent */
const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');
const { checkBlackListToken } = require('../../config/redis');

const SYSADMIN = ['SYSADMIN'];
const ADMIN = [...SYSADMIN, 'ADMIN'];
const USER = [...ADMIN, 'USER'];
const LOGGED_USER = '_loggedUser';

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });
  // const { organization } = req.headers;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const check = await checkBlackListToken(token);
    if (error || !user || check.isBlack) throw error;
    await logIn(user, { session: false });
  } catch (e) {
    return next(apiError);
  }
  // TODO disable org role on sysadmin
  // const orgRole = user.roles.filter(
  //   (role) => role.organization == organization,
  // );
  if (roles === LOGGED_USER) {
    if (!req.params.userId) req.params.userId = user.id.toString();
    if (req.params.userId !== user.id.toString()) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else if (
    // (orgRole && orgRole.length === 0) ||
    !roles.includes(user.role)
  ) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }
  req.user = user;
  return next();
};

exports.ADMIN = ADMIN.pop();
exports.LOGGED_USER = LOGGED_USER;
exports.USER = USER.pop();
exports.SYSADMIN = SYSADMIN.pop();

exports.authorize =
  (roles = User.roles) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (req, res, next) => {
    passport.authenticate(
      'jwt',
      { session: false },
      handleJWT(req, res, next, roles),
    )(req, res, next);
  };
