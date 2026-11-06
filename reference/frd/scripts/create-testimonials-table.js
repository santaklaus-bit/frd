'use strict';

const { Sequelize } = require('sequelize');
const configFile = require('../lib/db/config.json');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

const dialect = (process.env.DB_DIALECT || config.dialect || 'mysql').toLowerCase();

let sequelize;

if (dialect === 'sqlite') {
  const storage = process.env.DB_STORAGE || path.join(process.cwd(), 'lib/db/dev.sqlite');
  sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: console.log });
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
    logging: console.log,
  });
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected.');

    // Define Testimonial model
    const Testimonial = sequelize.define('Testimonial', {
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
    }, {
      tableName: 'Testimonials',
      timestamps: true,
      freezeTableName: true,
    });

    // Force sync to create table
    await sequelize.sync({ force: false });
    console.log('✓ Testimonial table created/synced successfully');

    // Seed testimonials if table is empty
    const count = await Testimonial.count();
    if (count === 0) {
      const testimonials = [
        {
          nameFr: "Marie Dupont",
          nameEn: "Marie Dupont",
          roleFr: "Fondatrice, Coopérative de femmes entrepreneures",
          roleEn: "Founder, Women Entrepreneurs Cooperative",
          contentFr: "Farid a transformé notre vision en stratégie concrète. Son accompagnement a permis à notre coopérative de croître de 40% en un an.",
          contentEn: "Farid transformed our vision into concrete strategy. His support enabled our cooperative to grow by 40% in one year.",
          certified: true,
          rating: 5,
          image: null,
          order: 1,
        },
        {
          nameFr: "Jean-Pierre Martin",
          nameEn: "Jean-Pierre Martin",
          roleFr: "Directeur général, ONG environnementale",
          roleEn: "General Director, Environmental NGO",
          contentFr: "L'expertise de Farid en développement organisationnel a révolutionné notre structure interne et notre impact social.",
          contentEn: "Farid's expertise in organizational development revolutionized our internal structure and social impact.",
          certified: true,
          rating: 5,
          image: null,
          order: 2,
        },
        {
          nameFr: "Amara Sow",
          nameEn: "Amara Sow",
          roleFr: "Responsable projet, Initiative d'inclusion socioprofessionnelle",
          roleEn: "Project Manager, Socioprofessional Inclusion Initiative",
          contentFr: "L'approche systémique de Farid et sa connaissance du terrain ont été déterminantes pour le succès de notre programme d'employabilité.",
          contentEn: "Farid's systemic approach and field knowledge were decisive for the success of our employability program.",
          certified: true,
          rating: 5,
          image: null,
          order: 3,
        },
        {
          nameFr: "Sophie Bernard",
          nameEn: "Sophie Bernard",
          roleFr: "Gérante, Startup agritech",
          roleEn: "Manager, Agritech Startup",
          contentFr: "Farid a su nous guider dans les phases critiques de notre développement. Son mentorat nous a permis de sécuriser des financements majeurs.",
          contentEn: "Farid guided us through critical phases of our development. His mentorship helped us secure major funding.",
          certified: true,
          rating: 5,
          image: null,
          order: 4,
        },
        {
          nameFr: "David Okonkwo",
          nameEn: "David Okonkwo",
          roleFr: "Coordinateur régional, Programme de développement économique",
          roleEn: "Regional Coordinator, Economic Development Program",
          contentFr: "La capacité de Farid à créer du consensus et à mobiliser les acteurs autour d'une vision commune est remarquable.",
          contentEn: "Farid's ability to create consensus and mobilize stakeholders around a shared vision is remarkable.",
          certified: false,
          rating: 5,
          image: null,
          order: 5,
        },
        {
          nameFr: "Fatima Traoré",
          nameEn: "Fatima Traoré",
          roleFr: "Présidente, Réseau de femmes entrepreneuses",
          roleEn: "President, Women Entrepreneurs Network",
          contentFr: "Un partenaire fiable qui comprend réellement les enjeux des organisations sociales et la complexité du terrain.",
          contentEn: "A reliable partner who truly understands the challenges of social organizations and field complexity.",
          certified: true,
          rating: 5,
          image: null,
          order: 6,
        },
      ];

      await Testimonial.bulkCreate(testimonials);
      console.log(`✓ Created ${testimonials.length} testimonials`);
    } else {
      console.log(`✓ Table already has ${count} testimonials`);
    }

    console.log('\n✅ Testimonials setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

run();
