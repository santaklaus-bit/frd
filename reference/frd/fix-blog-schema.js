#!/usr/bin/env node
/**
 * fix-blog-schema.js
 * 
 * Run this script DIRECTLY on the production server to fix the missing
 * columns in the BlogPosts table (wordCount, pdfUrl, audioUrl, etc.).
 * 
 * Usage:
 *   node fix-blog-schema.js
 */

const { Sequelize } = require('sequelize');
const configFile = require('./lib/db/config.json');

const env = process.env.NODE_ENV || 'production';
const config = configFile[env];

const sequelize = new Sequelize(
  process.env.DB_NAME || config.database,
  process.env.DB_USER || config.username,
  process.env.DB_PASSWORD ?? config.password,
  {
    host:    process.env.DB_HOST || config.host || '127.0.0.1',
    port:    parseInt(process.env.DB_PORT || String(config.port) || '3306', 10),
    dialect: 'mysql',
    logging: false,
  }
);

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database:', process.env.DB_NAME || config.database);

    const qi = sequelize.getQueryInterface();
    const cols = await qi.describeTable('BlogPosts');

    let changed = false;

    const columnsToAdd = [
      { name: 'readTime', type: Sequelize.STRING, allowNull: true },
      { name: 'wordCount', type: Sequelize.INTEGER, allowNull: true },
      { name: 'pdfUrl', type: Sequelize.STRING, allowNull: true },
      { name: 'audioUrl', type: Sequelize.STRING, allowNull: true },
      { name: 'imageCaption', type: Sequelize.STRING, allowNull: true }
    ];

    for (const colDef of columnsToAdd) {
      if (!cols[colDef.name]) {
        await qi.addColumn('BlogPosts', colDef.name, {
          type: colDef.type,
          allowNull: colDef.allowNull
        });
        console.log(`✅ Added column: BlogPosts.${colDef.name}`);
        changed = true;
      } else {
        console.log(`ℹ️  Column already exists: BlogPosts.${colDef.name}`);
      }
    }

    if (!changed) {
      console.log('✅ Schema is already up-to-date. Nothing to do.');
    } else {
      console.log('\n🎉 Schema fix complete. Restart the app if it is running.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
