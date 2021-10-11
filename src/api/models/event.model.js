const Sequelize = require('sequelize');
const { Model } = Sequelize;

class Event extends Model {
  static get modelFields() {
    return {
      uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'device_id',
      },
      recType: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        field: 'rec_type',
      },
      in: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      out: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      warnStatus: {
        type: Sequelize.INTEGER,
        field: 'warn_status',
      },
      batterytxLevel: {
        type: Sequelize.INTEGER,
        field: 'batterytx_level',
      },
      signalStatus: {
        type: Sequelize.INTEGER,
        field: 'signal_status',
      },
    };
  }

  transform() {
    const transformed = {};
    const fields = [
      'uuid',
      'recType',
      'in',
      'out',
      'time',
      'warnStatus',
      'batterytxLevel',
      'signalStatus',
      'createdAt',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

  static async list({ page = 1, perPage = 30, startDate, endDate }) {
    const now = new Date();
    if (!endDate) {
      endDate = new Date();
      endDate.setHours(23, 59, 59);
    }
    if (!startDate) {
      now.setTime(now.getTime() - 24 * 60 * 60 * 1000 * 7);
      startDate = new Date(now.getTime());
    }

    const { count, rows } = await Event.findAndCountAll({
      where: {
        time: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
      order: [['createdAt', 'ASC']],
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

  static async inOut({ startDate, endDate }) {
    const now = new Date();
    if (!endDate) endDate = new Date(now.getTime());
    if (!startDate) {
      now.setTime(now.getTime() - 24 * 60 * 60 * 1000 * 30);
      startDate = new Date(now.getTime());
    }

    const _in = await Event.sum('in', {
      where: {
        time: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });

    const out = await Event.sum('out', {
      where: {
        time: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });

    return {
      in: _in,
      out,
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

module.exports = Event;
