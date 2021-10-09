const Joi = require('joi');

module.exports = {
  // POST /v1/config
  createConfig: {
    body: {
      uploadInterval: Joi.string().min(5).max(5).required(),
      dataStartTime: Joi.string().min(5).max(5).required(),
      dataEndTime: Joi.string().min(5).max(5).required(),
      ret: Joi.number(),
    },
  },

  // PUT /v1/config
  updateConfig: {
    body: {
      uploadInterval: Joi.string().min(5).max(5),
      dataStartTime: Joi.string().min(5).max(5),
      dataEndTime: Joi.string().min(5).max(5),
      ret: Joi.number(),
    },
    params: {
      configId: Joi.number().required(),
    },
  },

  // DELETE /v1/config
  deleteConfig: {
    params: {
      configId: Joi.number().required(),
    },
  },

  // GET /v1/config
  listConfig: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
    },
  },
};
