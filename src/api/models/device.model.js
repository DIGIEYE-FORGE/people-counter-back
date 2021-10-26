const Sequelize = require('sequelize');
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const logger = require('../../config/logger');

const { Model } = Sequelize;

class Device extends Model {
  static get modelFields() {
    return {
      serial: {
        type: Sequelize.STRING,
        primaryKey: true,
        field: 'id',
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      placeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'place_id',
      },
      configId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'config_id',
      },
    };
  }

  transform() {
    const transformed = {};
    const fields = ['serial', 'name', 'Place', 'Config', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

  /**
   * List DeviceProfile in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of DeviceProfiles to be skipped.
   * @param {number} limit - Limit number of DeviceProfiles to be returned.
   * @returns {Promise<DeviceProfile[]>}
   */
  static async list({ page = 1, perPage = 30, name }) {
    const options = omitBy(
      {
        name,
      },
      isNil,
    );

    const { count, rows } = await Device.findAndCountAll({
      where: options,
      order: [['createdAt', 'DESC']],
      offset: perPage * (page - 1),
      limit: perPage,
    });
    return {
      docs: Object.values(rows).map((deviceProfile) =>
        deviceProfile.transform()),
      count,
      page,
      perPage,
    };
  }

  static async findById(id) {
    try {
      const parsedId = parseInt(id, 10);
      if (typeof parsedId == 'number') {
        const result = await Device.findOne({
          where: {
            id,
          },
          include: ['Config'],
        });
        if (result) {
          return result;
        }
      }
      throw new APIError({
        message: `${Device.name} does not exist`,
        status: httpStatus.NOT_FOUND,
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  static init(sequelize) {
    const options = { ...this.modelOptions, sequelize };
    return super.init(this.modelFields, options);
  }

  static associate(models) {
    this.belongsTo(models.Config, { foreignKey: 'config_id', as: 'Config' });
    this.hasMany(models.Event, { foreignKey: 'uuid' });
    this.belongsTo(models.Place, { foreignKey: 'place_id', as: 'Place' });
  }
}

module.exports = Device;
