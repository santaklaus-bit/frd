'use strict';

/**
 * sync-testimonials-schema.js
 *
 * Creates the Testimonials table if it doesn't exist.
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
    console.log('✓ Database connected.');

    const qi = sequelize.getQueryInterface();

    // Check if Testimonials table exists
    const tables = await qi.showAllTables();

    if (!tables.includes('Testimonials')) {
      console.log('Creating Testimonials table...');

      // Create the Testimonials table
      await sequelize.define('Testimonial', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nameFr: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        nameEn: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        roleFr: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        roleEn: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        contentFr: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        contentEn: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        image: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        certified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        rating: {
          type: Sequelize.INTEGER,
          defaultValue: 5,
        },
        order: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }, {
        tableName: 'Testimonials',
        timestamps: true,
      });

      await sequelize.sync({ force: false });
      console.log('✓ Created Testimonials table');
    } else {
      console.log('✓ Testimonials table already exists');

      // Check and add missing columns if needed
      const testimonialCols = await qi.describeTable('Testimonials');

      const missingCols = [];

      if (!testimonialCols.certified) {
        missingCols.push({ name: 'certified', type: Sequelize.BOOLEAN, defaultValue: false });
      }
      if (!testimonialCols.rating) {
        missingCols.push({ name: 'rating', type: Sequelize.INTEGER, defaultValue: 5 });
      }
      if (!testimonialCols.order) {
        missingCols.push({ name: 'order', type: Sequelize.INTEGER, defaultValue: 0 });
      }

      for (const col of missingCols) {
        await qi.addColumn('Testimonials', col.name, {
          type: col.type,
          defaultValue: col.defaultValue,
        });
        console.log(`✓ Added Testimonials.${col.name}`);
      }
    }

    console.log('\n✅ Testimonials schema sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Schema sync failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

run();
