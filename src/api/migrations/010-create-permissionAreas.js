module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('PermissionAreas', {
      area_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
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
  down: (queryInterface) => queryInterface.dropTable('PermissionAreas'),
};
