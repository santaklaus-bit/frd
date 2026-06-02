const { Sequelize } = require('sequelize');
const configFile = require('../lib/db/config.json');
const path = require('path');
require('dotenv').config();

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
  console.log("Starting BlogPosts database migration...");
  
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    // Select all posts using raw query so we can read the old columns if they exist
    const [posts] = await sequelize.query("SELECT * FROM BlogPosts");
    console.log(`Found ${posts.length} blog posts to migrate.`);

    for (const post of posts) {
      const {
        id,
        title,
        description,
        content,
        pdfUrl,
        audioUrl,
        imageCaption,
        readTime,
        wordCount,
        titleFr,
        titleEn
      } = post;

      // Only migrate if titleFr or titleEn is not set yet
      if (!titleFr && !titleEn) {
        const legacyTitle = title || "Untitled";
        console.log(`Migrating post: "${legacyTitle}" (ID: ${id})`);
        
        await sequelize.query(
          `UPDATE BlogPosts SET 
            titleFr = :title, 
            titleEn = :title,
            descriptionFr = :description,
            descriptionEn = :description,
            contentFr = :content,
            contentEn = :content,
            pdfUrlFr = :pdfUrl,
            pdfUrlEn = :pdfUrl,
            audioUrlFr = :audioUrl,
            audioUrlEn = :audioUrl,
            imageCaptionFr = :imageCaption,
            imageCaptionEn = :imageCaption,
            readTimeFr = :readTime,
            readTimeEn = :readTime,
            wordCountFr = :wordCount,
            wordCountEn = :wordCount
          WHERE id = :id`,
          {
            replacements: {
              id,
              title: legacyTitle,
              description: description || "",
              content: content || "",
              pdfUrl: pdfUrl || null,
              audioUrl: audioUrl || null,
              imageCaption: imageCaption || null,
              readTime: readTime || null,
              wordCount: wordCount || null
            }
          }
        );
      } else {
        console.log(`Post: "${titleFr || title}" (ID: ${id}) is already migrated or has bilingual content.`);
      }
    }

    console.log("✅ BlogPosts database migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running migration:", error);
    process.exit(1);
  }
}

run();
