'use strict';

/**
 * sync-schema.js
 * 
 * Runs idempotent SQL to ensure all required columns exist.
 * This bypasses the Sequelize migration tracking system and is safe to run multiple times.
 * Use this to handle schema drift in production environments.
 */

const { Sequelize } = require('sequelize');
const configFile = require('../lib/db/config.json');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

const dialect = (process.env.DB_DIALECT || config.dialect || 'mysql').toLowerCase();

let sequelize;

if (dialect === 'sqlite') {
  const storage = process.env.DB_STORAGE || path.join(process.cwd(), 'lib/db/dev.sqlite');
  sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: false });
} else {
  const host = process.env.DB_HOST || config.host || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || String(config.port) || '3306', 10);
  const username = process.env.DB_USER || config.username || 'root';
  const password = process.env.DB_PASSWORD ?? config.password ?? '';
  const database = process.env.DB_NAME || config.database || 'farid_db';

  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'mysql',
    logging: false,
  });
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log('sync-schema: Database connected.');

    const qi = sequelize.getQueryInterface();

    // ---- Productions table ----
    const prodCols = await qi.describeTable('Productions');

    if (!prodCols.categoryFr) {
      await qi.addColumn('Productions', 'categoryFr', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      });
      console.log('sync-schema: Added Productions.categoryFr');
    }

    if (!prodCols.categoryEn) {
      await qi.addColumn('Productions', 'categoryEn', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      });
      console.log('sync-schema: Added Productions.categoryEn');
    }

    // Promote text fields to TEXT type if they are still VARCHAR
    if (prodCols.detailsFr && prodCols.detailsFr.type === 'VARCHAR(255)') {
      await qi.changeColumn('Productions', 'detailsFr', { type: Sequelize.TEXT, allowNull: false });
      console.log('sync-schema: Upgraded Productions.detailsFr to TEXT');
    }
    if (prodCols.detailsEn && prodCols.detailsEn.type === 'VARCHAR(255)') {
      await qi.changeColumn('Productions', 'detailsEn', { type: Sequelize.TEXT, allowNull: false });
      console.log('sync-schema: Upgraded Productions.detailsEn to TEXT');
    }

    // ---- Initiatives table ----
    const initCols = await qi.describeTable('Initiatives');

    if (!initCols.detailsFr) {
      await qi.addColumn('Initiatives', 'detailsFr', { type: Sequelize.TEXT, allowNull: true });
      console.log('sync-schema: Added Initiatives.detailsFr');
    }
    if (!initCols.detailsEn) {
      await qi.addColumn('Initiatives', 'detailsEn', { type: Sequelize.TEXT, allowNull: true });
      console.log('sync-schema: Added Initiatives.detailsEn');
    }

    if (!initCols.contentFr) {
      await qi.addColumn('Initiatives', 'contentFr', { type: Sequelize.TEXT, allowNull: true });
      console.log('sync-schema: Added Initiatives.contentFr');
    }
    if (!initCols.contentEn) {
      await qi.addColumn('Initiatives', 'contentEn', { type: Sequelize.TEXT, allowNull: true });
      console.log('sync-schema: Added Initiatives.contentEn');
    }

    console.log('sync-schema: Schema sync complete.');
    process.exit(0);
  } catch (err) {
    console.error('sync-schema: Error during schema sync:', err.message);
    process.exit(1);
  }
}

run();
