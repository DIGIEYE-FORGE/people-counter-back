module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      device_id: {
        type: Sequelize.STRING,
        references: {
          model: 'Devices', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
      },
      rec_type: {
        type: Sequelize.INTEGER,
      },
      in: {
        type: Sequelize.INTEGER,
      },
      out: {
        type: Sequelize.INTEGER,
      },
      time: {
        type: Sequelize.DATE,
      },
      warn_status: {
        type: Sequelize.INTEGER,
      },
      batterytx_level: {
        type: Sequelize.INTEGER,
      },
      signal_status: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('Events'),
};
