const Joi = require('joi');

module.exports = {
  // POST /v1/device
  createDevice: {
    body: {
      serial: Joi.string()
        .min(12)
        .max(13)
        .regex(/^[a-fA-F0-9]{13}$/)
        .required(),
      name: Joi.string().min(3).max(32).required(),
      placeId: Joi.number().required(),
    },
  },

  // PUT /v1/device
  updateDevice: {
    body: {
      serial: Joi.string()
        .min(12)
        .max(13)
        .regex(/^[a-fA-F0-9]{13}$/)
        .required(),
      name: Joi.string().min(3).max(32).required(),
      placeId: Joi.number(),
    },
    params: {
      deviceId: Joi.string()
        .regex(/^[a-fA-F0-9]{13}$/)
        .required(),
    },
  },

  // DELETE /v1/device
  deleteDevice: {
    params: {
      deviceId: Joi.string()
        .regex(/^[a-fA-F0-9]{13}$/)
        .required(),
    },
  },

  // GET /v1/device
  listDevices: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      serial: Joi.string().regex(/^[a-fA-F0-9]{12}$/),
      name: Joi.string(),
      placeId: Joi.number(),
    },
  },
};
