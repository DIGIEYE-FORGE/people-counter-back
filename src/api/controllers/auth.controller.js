const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const bcrypt = require('bcryptjs');
const { PasswordResetToken, User, Organization } = require('../models');
const { jwtExpirationInterval } = require('../../config/vars');
const APIError = require('../errors/api-error');
const emailProvider = require('../services/emails/emailProvider');
const {
  generateRefreshToken,
  removeRefreshToken,
} = require('../../config/redis');
const { env } = require('../../config/vars');

/**
 * Returns a formatted object with tokens
 * @private
 */
async function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = (await generateRefreshToken(user)).token;
  // console.log(refreshToken);
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
// eslint-disable-next-line consistent-return
exports.register = async (req, res, next) => {
  const data = omit(req.body, 'role');
  try {
    const orgData = {
      name: data.name,
      lat: data.lat,
      lng: data.lng,
      zipCode: data.zipCode,
      country: data.country,
      city: data.city,
    };
    const org = new Organization(orgData);
    await org.save();
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      organizationId: org.dataValues.id,
    };
    const user = new User(userData);
    user.role = 'ADMIN';
    await user.save();
    const userTransformed = user.transform();
    const token = await generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({ token, user: userTransformed });
  } catch (error) {
    console.log(error);
    // next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  // TODO check if session is open
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = await generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const { refreshObject } = await removeRefreshToken(refreshToken);
    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject,
    });
    const response = await generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * close user session and delete it from redis
 * @public
 */
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    // eslint-disable-next-line no-unused-vars
    const { refreshObject } = await removeRefreshToken(refreshToken);
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};

exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json('success');
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, resetToken } = req.body;
    const resetTokenObject = await PasswordResetToken.findOne({
      where: { user_email: email, reset_token: resetToken },
      attributes: [
        'id',
        'reset_token',
        'user_id',
        'user_email',
        'expires',
        'createdAt',
        'updatedAt',
      ],
    });
    await PasswordResetToken.destroy({
      where: { id: resetTokenObject.dataValues.id },
    });
    console.log(resetTokenObject.dataValues.user_email);

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      err.message = 'Cannot find matching reset token';
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = 'Reset token is expired';
      throw new APIError(err);
    }

    const user = await User.findOne({
      where: { email: resetTokenObject.dataValues.user_email },
    });
    const rounds = env === 'test' ? 1 : 10;
    const hash = await bcrypt.hash(password, rounds);
    user.password = hash;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);

    res.status(httpStatus.OK);
    return res.json('Password Updated');
  } catch (error) {
    return next(error);
  }
};
