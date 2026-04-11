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

    const prodCols = await qi.describeTable('Productions');

    if (prodCols.icon) {
      await qi.removeColumn('Productions', 'icon');
      console.log('sync-schema: Dropped Productions.icon');
    }

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

    if (!prodCols.pdfUrl) {
      await qi.addColumn('Productions', 'pdfUrl', { type: Sequelize.STRING, allowNull: true });
      console.log('sync-schema: Added Productions.pdfUrl');
    }
    if (!prodCols.isFeatured) {
      await qi.addColumn('Productions', 'isFeatured', { type: Sequelize.BOOLEAN, defaultValue: false });
      console.log('sync-schema: Added Productions.isFeatured');
    }
    if (!prodCols.imageCaptionFr) {
      await qi.addColumn('Productions', 'imageCaptionFr', { type: Sequelize.STRING, allowNull: true });
      console.log('sync-schema: Added Productions.imageCaptionFr');
    }
    if (!prodCols.imageCaptionEn) {
      await qi.addColumn('Productions', 'imageCaptionEn', { type: Sequelize.STRING, allowNull: true });
      console.log('sync-schema: Added Productions.imageCaptionEn');
    }

    if (!prodCols.imageEn) {
      await qi.addColumn('Productions', 'imageEn', { type: Sequelize.STRING, allowNull: true });
      console.log('sync-schema: Added Productions.imageEn');
    }

    const initCols = await qi.describeTable('Initiatives');

    if (initCols.icon) {
      await qi.removeColumn('Initiatives', 'icon');
      console.log('sync-schema: Dropped Initiatives.icon');
    }

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
    if (!initCols.imageCaptionFr) {
      await qi.addColumn('Initiatives', 'imageCaptionFr', { type: Sequelize.STRING, allowNull: true });
      console.log('sync-schema: Added Initiatives.imageCaptionFr');
    }
    if (!initCols.imageCaptionEn) {
      await qi.addColumn('Initiatives', 'imageCaptionEn', { type: Sequelize.STRING, allowNull: true });
      console.log('sync-schema: Added Initiatives.imageCaptionEn');
    }
    if (!initCols.projectSlugs) {
      await qi.addColumn('Initiatives', 'projectSlugs', { type: Sequelize.TEXT, allowNull: true });
      console.log('sync-schema: Added Initiatives.projectSlugs');
    }

    // ---- BlogPosts table ----
    const blogCols = await qi.describeTable('BlogPosts');
    if (!blogCols.readTime) {
      await qi.addColumn('BlogPosts', 'readTime', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('sync-schema: Added BlogPosts.readTime');
    }
    if (!blogCols.imageCaption) {
      await qi.addColumn('BlogPosts', 'imageCaption', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('sync-schema: Added BlogPosts.imageCaption');
    }

    console.log('Schema sync completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Schema sync failed:', error);
    process.exit(1);
  }
}

run();
