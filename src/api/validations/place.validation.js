const Joi = require('joi');

module.exports = {
  // POST /v1/place
  createPlace: {
    body: {
      name: Joi.string().min(3).max(13).required(),
      description: Joi.string().min(10).max(255),
      areaId: Joi.number().required(),
    },
  },

  // PUT /v1/place
  updatePlace: {
    body: {
      name: Joi.string().min(6).max(13),
      description: Joi.string().min(10).max(255),
      areaId: Joi.number(),
    },
    params: {
      placeId: Joi.number().required(),
    },
  },

  // DELETE /v1/place
  deletePlace: {
    params: {
      placeId: Joi.number().required(),
    },
  },

  // GET /v1/place
  listPlace: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      areaId: Joi.number(),
    },
  },
};
