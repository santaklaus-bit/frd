import sequelize from "../lib/db/sequelize";
import { Initiative } from "../lib/db/models";
import { saveData, getData, ExpertiseItem } from "../lib/content-manager";

async function run() {
  await sequelize.sync();
  
  // Update the Database Content via content-manager for safety
  const existing = await getData("expertise");
  
  // Filter out filiere-viticole-quebec
  let combined: ExpertiseItem[] = existing.filter((item: any) => item.slug !== "filiere-viticole-quebec");
  
  // Find piri-piri-kenya or create it
  const piriIndex = combined.findIndex((c: any) => c.slug === "piri-piri-kenya");
  
  const updatedPiri: ExpertiseItem = {
    slug: "piri-piri-kenya",
    category: {
      fr: "Chaîne de Valeur",
      en: "Value Chain"
    },
    title: {
      fr: "Champ de piri piri – Coopérative de femmes productrices, Kenya",
      en: "Piri piri field – Women producers' cooperative, Kenya"
    },
    description: {
      fr: "Analyse de la chaîne de valeur et des opportunités de transformation pour renforcer les revenus",
      en: "Analysis of the value chain and transformation opportunities to strengthen incomes"
    },
    content: {
      fr: "Comprendre une chaîne de valeur agricole : leçons du terrain\n\nDans de nombreux contextes de développement économique, les stratégies sont souvent conçues à distance du terrain...",
      en: "Understanding an agricultural value chain: lessons from the field..."
    },
    details: {
      fr: "Comprendre une chaîne de valeur agricole : leçons du terrain",
      en: "Understanding an agricultural value chain: lessons from the field"
    }
  };

  if (piriIndex !== -1) {
    combined[piriIndex] = { ...combined[piriIndex], ...updatedPiri };
  } else {
    combined.push(updatedPiri);
  }

  await saveData("expertise", combined);
  
  // also explicitly delete the old one from the db if saveData doesn't prune it
  await Initiative.destroy({ where: { slug: "filiere-viticole-quebec" } });
  
  console.log("Database updated successfully.");
  process.exit(0);
}

run();
