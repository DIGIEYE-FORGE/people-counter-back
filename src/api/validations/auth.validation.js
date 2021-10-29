const Joi = require('joi');

module.exports = {
  // POST /v1/auth/register
  register: {
    body: {
      firstName: Joi.string().required().min(4).max(128),
      lastName: Joi.string().required().min(4).max(128),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
      name: Joi.string().required().min(6).max(128),
      lat: Joi.number(),
      lng: Joi.number(),
      zipCode: Joi.number(),
      country: Joi.string().min(6).max(128),
      city: Joi.string().min(6).max(128),
    },
  },

  // POST /v1/auth/login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128),
    },
  },

  // POST /v1/auth/refresh
  refresh: {
    body: {
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required(),
    },
  },

  // POST /v1/auth/refresh
  logout: {
    body: {
      refreshToken: Joi.string().required(),
    },
  },

  // POST /v1/auth/refresh
  sendPasswordReset: {
    body: {
      email: Joi.string().email().required(),
    },
  },

  // POST /v1/auth/password-reset
  passwordReset: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
      resetToken: Joi.string().required(),
    },
  },
};
