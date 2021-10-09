const Joi = require('joi');

module.exports = {
  // POST /v1/area
  createArea: {
    body: {
      name: Joi.string().min(3).max(13).required(),
      description: Joi.string().min(10).max(255),
    },
  },

  // PUT /v1/area
  updateArea: {
    body: {
      name: Joi.string().min(6).max(13),
      description: Joi.string().min(10).max(255),
    },
    params: {
      areaId: Joi.number().required(),
    },
  },

  // DELETE /v1/area
  deleteArea: {
    params: {
      areaId: Joi.number().required(),
    },
  },

  // GET /v1/area
  listArea: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
    },
  },
};
