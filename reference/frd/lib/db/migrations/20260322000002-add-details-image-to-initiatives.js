'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Initiatives');

    if (!tableDescription.detailsFr) {
      await queryInterface.addColumn('Initiatives', 'detailsFr', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    if (!tableDescription.detailsEn) {
      await queryInterface.addColumn('Initiatives', 'detailsEn', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    if (!tableDescription.image) {
      await queryInterface.addColumn('Initiatives', 'image', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Initiatives', 'detailsFr');
    await queryInterface.removeColumn('Initiatives', 'detailsEn');
    await queryInterface.removeColumn('Initiatives', 'image');
  }
};
