import "dotenv/config";
import sequelize from "../lib/db/sequelize";

async function run() {
  console.log("Starting BlogPosts database migration...");
  
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    // Check if the table exists first
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'BlogPosts'");
    if (tables.length === 0) {
      console.log("ℹ️  BlogPosts table does not exist yet. No migration needed.");
      process.exit(0);
    }

    // Select all posts using raw query so we can read the old columns if they exist
    const [posts] = await sequelize.query("SELECT * FROM BlogPosts");
    console.log(`Found ${posts.length} blog posts to migrate.`);

    for (const post of posts as any[]) {
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
        const legacyTitle = title || post.titleFr || "Untitled";
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
              description: description || post.descriptionFr || "",
              content: content || post.contentFr || "",
              pdfUrl: pdfUrl || post.pdfUrlFr || null,
              audioUrl: audioUrl || post.audioUrlFr || null,
              imageCaption: imageCaption || post.imageCaptionFr || null,
              readTime: readTime || post.readTimeFr || null,
              wordCount: wordCount || post.wordCountFr || null
            }
          }
        );
      } else {
        console.log(`Post: "${titleFr || title}" (ID: ${id}) is already migrated or has bilingual content.`);
      }
    }

    console.log("✅ BlogPosts database migration completed successfully.");
  } catch (error) {
    console.error("❌ Error running migration:", error);
  } finally {
    process.exit(0);
  }
}

run();
