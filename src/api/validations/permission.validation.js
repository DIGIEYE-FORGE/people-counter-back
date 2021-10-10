const Joi = require('joi');

module.exports = {
  // POST /v1/device-type
  createDeviceType: {
    body: {
      name: Joi.string().min(6).max(13).required(),
      pubTopic: Joi.string()
        .regex(/^[[a-zA-Z0-9]+\/\{[a-zA-Z0-9]+\}\/events$/)
        .required(),
      rpcTopic: Joi.string()
        .regex(/^[[a-zA-Z0-9]+\/\{[a-zA-Z0-9]+\}\/rpc$/)
        .required(),
      infoTopic: Joi.string()
        .regex(/^[a-zA-Z0-9]+\/\{[a-zA-Z0-9]+\}\/info$/)
        .required(),
      uniqueId: Joi.number().required(),
      queuePrefix: Joi.string().required(),
      description: Joi.string().min(10).max(255),
    },
  },

  // PUT /v1/device-type
  updateDeviceType: {
    body: {
      name: Joi.string().min(6).max(13),
      pubTopic: Joi.string().regex(/^[a-zA-Z0-9]+\/\{[a-zA-Z0-9]+\}\/events$/),
      rpcTopic: Joi.string().regex(/^[a-zA-Z0-9]+\/\{[a-zA-Z0-9]+\}\/rpc$/),
      infoTopic: Joi.string().regex(/^[a-zA-Z0-9]+\/\{[a-zA-Z0-9]+\}\/info$/),
      queuePrefix: Joi.string(),
      description: Joi.string().min(10).max(255),
    },
    params: {
      deviceTypeId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },

  // PATCH /v1/device-type
  replaceDeviceType: {
    body: {
      name: Joi.string().min(6).max(13),
      pubTopic: Joi.string().regex(/^[a-zA-Z0-9]+\/\{[a-zA-Z0-9]+\}\/events$/),
      rpcTopic: Joi.string().regex(/^[a-zA-Z0-9]+\/\{[a-zA-Z0-9]+\}\/rpc$/),
      infoTopic: Joi.string().regex(/^[a-zA-Z0-9]+\/\{[a-zA-Z0-9]+\}\/info$/),
      queuePrefix: Joi.string(),
      description: Joi.string().min(10).max(255),
    },
    params: {
      deviceTypeId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },

  // DELETE /v1/device-type
  deleteDeviceType: {
    params: {
      deviceTypeId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },

  // DELETE /v1/device-type
  getDeviceTypeByUniqueId: {
    params: {
      deviceTypeUniqueId: Joi.string()
        .regex(/^[0-9]{3}$/)
        .required(),
    },
  },

  // GET /v1/device-type
  listDeviceType: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
    },
  },
};
