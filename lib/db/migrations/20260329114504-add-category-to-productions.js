'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Productions');

    // Add categoryFr if missing
    if (!tableDescription.categoryFr) {
      await queryInterface.addColumn('Productions', 'categoryFr', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      });
    }

    // Add categoryEn if missing
    if (!tableDescription.categoryEn) {
      await queryInterface.addColumn('Productions', 'categoryEn', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      });
    }

    // Upgrade fields to TEXT to avoid truncation
    await queryInterface.changeColumn('Productions', 'descriptionFr', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.changeColumn('Productions', 'descriptionEn', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.changeColumn('Productions', 'detailsFr', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.changeColumn('Productions', 'detailsEn', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Productions', 'categoryFr');
    await queryInterface.removeColumn('Productions', 'categoryEn');
    
    // We don't necessarily want to downgrade TEXT back to STRING as it might truncate data
    // but for completeness of the migration file:
    await queryInterface.changeColumn('Productions', 'descriptionFr', {
      type: Sequelize.STRING,
      allowNull: false
    });
    // ... skipping other downgrades for safety unless explicitly needed
  }
};
