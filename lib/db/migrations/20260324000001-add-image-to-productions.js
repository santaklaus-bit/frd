'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Productions');
    if (!tableDescription.image) {
      await queryInterface.addColumn('Productions', 'image', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Productions');
    if (tableDescription.image) {
      await queryInterface.removeColumn('Productions', 'image');
    }
  }
};
