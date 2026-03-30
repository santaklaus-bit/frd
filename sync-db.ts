import sequelize from "./lib/db/sequelize";
import { BlogPost, Initiative, Production, ContactMessage, Subscriber, Dictionary } from "./lib/db/models";

async function run() {
  console.log("Starting DB sync with alter: true...");
  
  // Initialize models
  BlogPost; Initiative; Production; ContactMessage; Subscriber; Dictionary;

  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully. Added new fields.");
  } catch (error) {
    console.error("Error syncing database:", error);
  } finally {
    process.exit(0);
  }
}

run();
