'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('BlogPosts');
    if (table.content) {
      await queryInterface.removeColumn('BlogPosts', 'content');
      console.log('✓ Removed orphaned content column from BlogPosts');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('BlogPosts');
    if (!table.content) {
      await queryInterface.addColumn('BlogPosts', 'content', {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      });
      console.log('✓ Restored content column to BlogPosts');
    }
  },
};
