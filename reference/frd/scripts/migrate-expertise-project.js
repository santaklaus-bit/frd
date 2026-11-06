#!/usr/bin/env node

const { Sequelize } = require('sequelize');
const configFile = require('../lib/db/config.json');

const env = process.env.NODE_ENV || 'production';
const config = configFile[env] || configFile['development'];

const isMysql = config && config.dialect === 'mysql';

const sequelize = new Sequelize(
  process.env.DB_NAME || config.database,
  process.env.DB_USER || config.username,
  process.env.DB_PASSWORD ?? config.password,
  {
    host:    process.env.DB_HOST || config.host || '127.0.0.1',
    port:    parseInt(process.env.DB_PORT || String(config.port) || '3306', 10),
    dialect: process.env.DB_DIALECT || config.dialect || 'sqlite',
    storage: config.storage || './lib/db/dev.sqlite',
    logging: false,
  }
);

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    const qi = sequelize.getQueryInterface();
    
    const initCols = await qi.describeTable('Initiatives');
    
    if (!initCols.contentFr) {
      await qi.addColumn('Initiatives', 'contentFr', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
      console.log('✅ Added column: Initiatives.contentFr');
    }

    if (!initCols.contentEn) {
      await qi.addColumn('Initiatives', 'contentEn', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
      console.log('✅ Added column: Initiatives.contentEn');
    }

    // Try to remove icon from Initiatives
    if (initCols.icon) {
      try {
        await qi.removeColumn('Initiatives', 'icon');
        console.log('✅ Removed column: Initiatives.icon');
      } catch (e) {
        console.log('⚠️ Could not remove Initiatives.icon (SQLite might not support it). Ignoring.');
      }
    }

    const prodCols = await qi.describeTable('Productions');
    if (prodCols.icon) {
      try {
        await qi.removeColumn('Productions', 'icon');
        console.log('✅ Removed column: Productions.icon');
      } catch (e) {
        console.log('⚠️ Could not remove Productions.icon. Ignoring.');
      }
    }

    console.log('🎉 Migration successful');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
