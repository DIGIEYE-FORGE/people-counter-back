const Sequelize = require('sequelize');
const { Model } = Sequelize;

class Organization extends Model {
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
    const transformed = {};
    const fields = [
      'name',
      'lat',
      'lng',
      'city',
      'country',
      'zipCode',
      'createdAt',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

  static async list({ page = 1, perPage = 30, name = '' }) {
    const { count, rows } = await Organization.findAndCountAll({
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${name}%`,
        },
      },
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

  static associate(models) {
    this.belongsTo(models.Device, { foreignKey: 'uuid' });
  }
}

module.exports = Organization;
