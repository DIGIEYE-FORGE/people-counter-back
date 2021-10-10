const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

const { Model } = Sequelize;

class Permission extends Model {
  static get modelFields() {
    return {
      permissionId: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
        field: 'id',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    };
  }

  transform() {
    const transformed = {};
    const fields = ['placeId', 'name', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

  static init(sequelize) {
    const options = { ...this.modelOptions, sequelize };
    return super.init(this.modelFields, options);
  }

  static associate(models) {
    this.belongsToMany(models.Area, { through: 'PermissionAreas' });
    this.belongsTo(models.User);
  }
}

module.exports = Permission;
