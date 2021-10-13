const Sequelize = require('sequelize');
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const BaseModel = require('./baseModel');

class Organization extends BaseModel {
  static get modelFields() {
    return {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      lat: {
        type: Sequelize.INTEGER,
      },
      lng: {
        type: Sequelize.INTEGER,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
      },
      zipCode: {
        type: Sequelize.INTEGER,
        field: 'zip_code',
      },
    };
  }

  transform() {
    return super.transform([
      'id',
      'name',
      'lat',
      'lng',
      'city',
      'country',
      'zipCode',
      'createdAt',
    ]);
  }

  static async list({ page = 1, perPage = 30, city, country, name }) {
    const where = omitBy(
      {
        city,
        country,
      },
      isNil,
    );
    if (name) {
      where.name = {
        [Sequelize.Op.like]: `%${name}%`,
      };
    }

    const { count, rows } = await Organization.findAndCountAll({
      where,
      order: [['createdAt', 'ASC']],
      offset: perPage * (page * 1 - 1),
      limit: perPage * 1,
    });

    return {
      docs: rows.map((deviceProfile) => deviceProfile.transform()),
      count,
      page,
      perPage,
    };
  }

  static init(sequelize) {
    const options = { ...this.modelOptions, sequelize };
    return super.init(this.modelFields, options);
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

  static async findById(id) {
    try {
      const parsedId = parseInt(id, 10);
      if (typeof parsedId == 'number') {
        const result = await Organization.findOne({
          where: {
            id,
          },
        });
        if (result) {
          return result;
        }
      }
      throw new APIError({
        message: `${Organization.name} does not exist`,
        status: httpStatus.NOT_FOUND,
      });
    } catch (err) {
      // logger.error(err);
      console.log(err);
      throw err;
    }
  }

  static associate(models) {
    this.hasMany(models.Area, { foreignKey: 'organization_id' });
    this.hasMany(models.User, { foreignKey: 'organization_id' });
  }
}

module.exports = Organization;
