'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('BlogPosts');

    if (!tableDescription.authorName) {
      await queryInterface.addColumn('BlogPosts', 'authorName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableDescription.authorPhoto) {
      await queryInterface.addColumn('BlogPosts', 'authorPhoto', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('BlogPosts', 'authorName');
    await queryInterface.removeColumn('BlogPosts', 'authorPhoto');
  }
};
