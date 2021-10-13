const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

const { Model } = Sequelize;

class baseModel extends Model {
  transform(fields) {
    const transformed = {};
    const _fields = [...fields];

    _fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

  static checkDuplicate(error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return new APIError({
        message: 'Validation Error',
        errors: [
          error.errors.map((err) => ({
            field: err.path.split('.')[1],
            location: 'body',
            messages: [`"${err.value}" already exists`],
          })),
        ],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  }

  static async findById(model, id) {
    try {
      const parsedId = parseInt(id, 10);
      if (typeof parsedId == 'number') {
        const result = await model.findOne({
          where: {
            id,
          },
        });
        if (result) {
          return result;
        }
      }
      throw new APIError({
        message: `${model.name} does not exist`,
        status: httpStatus.NOT_FOUND,
      });
    } catch (err) {
      // logger.error(err);
      console.log(err);
      throw err;
    }
  }
}

module.exports = baseModel;
