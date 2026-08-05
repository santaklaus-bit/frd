const { Sequelize } = require('sequelize');
const config = require('../lib/db/config.json').development;

async function clearDemoContent() {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  });

  try {
    console.log('--- Clearing Demo Content ---');
    
    // Clear BlogPosts
    await sequelize.query('DELETE FROM BlogPosts');
    console.log('✓ BlogPosts cleared');

    // Clear Initiatives (Expertise)
    await sequelize.query('DELETE FROM Initiatives');
    console.log('✓ Initiatives cleared');

    // Clear Productions (Projects)
    await sequelize.query('DELETE FROM Productions');
    console.log('✓ Productions cleared');

    // Clear Subscribers
    await sequelize.query('DELETE FROM Subscribers');
    console.log('✓ Subscribers cleared');

    // Clear ContactMessages
    await sequelize.query('DELETE FROM ContactMessages');
    console.log('✓ ContactMessages cleared');

    console.log('--- Done ---');
  } catch (error) {
    console.error('Error clearing demo content:', error);
  } finally {
    await sequelize.close();
  }
}

clearDemoContent();
