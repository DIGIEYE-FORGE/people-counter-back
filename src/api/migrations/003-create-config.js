module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Configs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      upload_interval: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '00:05',
      },
      data_start_time: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '08:00',
      },
      data_end_time: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '20:00',
      },
      ret: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      uploaded: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
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
  down: (queryInterface) => queryInterface.dropTable('Configs'),
};
