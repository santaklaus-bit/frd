'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('BlogPosts');
    if (table.title) {
      await queryInterface.removeColumn('BlogPosts', 'title');
      console.log('✓ Removed orphaned title column from BlogPosts');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('BlogPosts');
    if (!table.title) {
      await queryInterface.addColumn('BlogPosts', 'title', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✓ Restored title column to BlogPosts');
    }
  },
};
