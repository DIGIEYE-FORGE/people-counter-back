const Joi = require('joi');

module.exports = {
  // POST /v1/organization
  createOrganization: {
    body: {
      name: Joi.string().min(3).max(13).required(),
      lat: Joi.number(),
      lng: Joi.number(),
      country: Joi.string().required(),
      city: Joi.string(),
      zipCode: Joi.number(),
    },
  },

  // PUT /v1/organization
  updateOrganization: {
    body: {
      name: Joi.string().min(3).max(13),
      lat: Joi.number(),
      lng: Joi.number(),
      country: Joi.string(),
      city: Joi.string(),
      zipCode: Joi.number(),
    },
    params: {
      organizationId: Joi.number().required(),
    },
  },

  // DELETE /v1/organization
  deleteOrganization: {
    params: {
      organizationId: Joi.number().required(),
    },
  },

  // GET /v1/organization
  listOrganization: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
    },
  },
};
