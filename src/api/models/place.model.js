const Sequelize = require('sequelize');
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const logger = require('../../config/logger');

const { Model } = Sequelize;

class Place extends Model {
  static get modelFields() {
    return {
      placeId: {
        primaryKey: true,
        type: Sequelize.STRING,
        autoIncrement: true,
        allowNull: false,
        field: 'id',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      areaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'area_id',
      },
    };
  }

  transform() {
    const transformed = {};
    const fields = ['placeId', 'name', 'areaId', 'createdAt'];

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
  async list({ page = 1, perPage = 30, name }) {
    const options = omitBy(
      {
        name,
      },
      isNil,
    );
    const { count, rows } = await this.findAndCountAll({
      where: { options },
      order: [['createdAt', 'DESC']],
      offset: perPage * (page - 1),
      limit: perPage,
    });
    return {
      docs: rows.map((deviceProfile) => deviceProfile.transform()),
      count,
      page,
      perPage,
    };
  }

  static async findById(id) {
    try {
      const parsedId = parseInt(id, 10);
      if (typeof parsedId == 'number') {
        const result = await Place.findOne({
          where: {
            id,
          },
        });
        if (result) {
          return result;
        }
      }
      throw new APIError({
        message: `${Place.name} does not exist`,
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
    this.hasMany(models.Device, { foreignKey: 'place_id' });
    this.belongsTo(models.Area, { foreignKey: 'area_id' });
  }
}

module.exports = Place;
