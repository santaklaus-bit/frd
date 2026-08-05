#!/usr/bin/env node
/**
 * fix-production-schema.js
 * 
 * Run this script DIRECTLY on the production server to fix the missing
 * categoryFr / categoryEn columns in the Productions table.
 * 
 * Usage:
 *   node fix-production-schema.js
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
    const cols = await qi.describeTable('Productions');

    let changed = false;

    // ── categoryFr ──────────────────────────────────────────────────────────
    if (!cols.categoryFr) {
      await qi.addColumn('Productions', 'categoryFr', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      });
      console.log('✅ Added column: Productions.categoryFr');
      changed = true;
    } else {
      console.log('ℹ️  Column already exists: Productions.categoryFr');
    }

    // ── categoryEn ──────────────────────────────────────────────────────────
    if (!cols.categoryEn) {
      await qi.addColumn('Productions', 'categoryEn', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      });
      console.log('✅ Added column: Productions.categoryEn');
      changed = true;
    } else {
      console.log('ℹ️  Column already exists: Productions.categoryEn');
    }

    // ── Upgrade detailsFr / detailsEn to TEXT ────────────────────────────────
    if (cols.detailsFr && cols.detailsFr.type === 'VARCHAR(255)') {
      await qi.changeColumn('Productions', 'detailsFr', { type: Sequelize.TEXT, allowNull: false });
      console.log('✅ Upgraded Productions.detailsFr → TEXT');
      changed = true;
    }
    if (cols.detailsEn && cols.detailsEn.type === 'VARCHAR(255)') {
      await qi.changeColumn('Productions', 'detailsEn', { type: Sequelize.TEXT, allowNull: false });
      console.log('✅ Upgraded Productions.detailsEn → TEXT');
      changed = true;
    }

    console.log('\n🔄 Migrating image URLs from /uploads/ to /api/uploads/...');
    const [results] = await sequelize.query(
      "SELECT id, image FROM Productions WHERE image LIKE '/uploads/%'"
    );
    
    for (const row of results) {
      const newUrl = row.image.replace('/uploads/', '/api/uploads/');
      await sequelize.query(
        "UPDATE Productions SET image = ? WHERE id = ?",
        { replacements: [newUrl, row.id] }
      );
      console.log(`✅ Migrated image URL for Production ID ${row.id}: ${newUrl}`);
    }

    if (results.length === 0) {
      console.log('ℹ️  No image URLs needed migration.');
    }

    if (!changed && results.length === 0) {
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
