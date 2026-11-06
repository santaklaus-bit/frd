'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Initiatives');
    if (!tableInfo.parentSlug) {
      await queryInterface.addColumn('Initiatives', 'parentSlug', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Initiatives');
    if (tableInfo.parentSlug) {
      await queryInterface.removeColumn('Initiatives', 'parentSlug');
    }
  }
};
