const Sequelize = require('sequelize');
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const logger = require('../../config/logger');

const { Model } = Sequelize;

class Config extends Model {
  static get modelFields() {
    return {
      ConfigId: {
        primaryKey: true,
        type: Sequelize.STRING,
        autoIncrement: true,
        allowNull: false,
        field: 'id',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      uploadInterval: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '00:05',
        field: 'upload_interval',
      },
      dataStartTime: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '08:00',
        field: 'data_start_time',
      },
      dataEndTime: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '20:00',
        field: 'data_end_time',
      },
      ret: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      uploaded: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    };
  }

  transform() {
    const transformed = {};
    const fields = [
      'ConfigId',
      'name',
      'uploadInterval',
      'dataStartTime',
      'dataEndTime',
      'ret',
      'uploaded',
      'createdAt',
    ];

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
    const { count, rows } = await this.findAndCountAll({
      where: options,
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
        const result = await Config.findOne({
          where: {
            id,
          },
        });
        if (result) {
          return result;
        }
      }
      throw new APIError({
        message: `${Config.name} does not exist`,
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
    this.hasOne(models.Device, { foreignKey: 'config_id' });
  }
}

module.exports = Config;
