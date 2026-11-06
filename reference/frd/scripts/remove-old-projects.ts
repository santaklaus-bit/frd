import sequelize from "../lib/db/sequelize";
import { Initiative } from "../lib/db/models";

async function run() {
  try {
    await sequelize.sync();
    
    const deleted = await Initiative.destroy({
      where: {
        slug: ["programme-apprentissage", "insertion-socioprofessionnelle"]
      }
    });
    
    console.log(`Successfully removed ${deleted} old projects.`);
  } catch (error) {
    console.error("Error removing projects:", error);
  } finally {
    process.exit(0);
  }
}

run();
