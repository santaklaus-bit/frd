import sequelize from "../lib/db/sequelize";
import { Initiative } from "../lib/db/models";
import { saveData, getData, ExpertiseItem } from "../lib/content-manager";

async function run() {
  console.log("Syncing database schema...");
  await sequelize.sync({ alter: true });
  console.log("Database schema synced!");

  const existing = await getData("expertise");

  // Filter out any placeholders
  const validExpertises = existing.filter((item: any) => item.slug && item.slug !== "");

  // Make sure to add our 4 new projects if they do not exist
  const newProjectsMap: ExpertiseItem[] = [
    {
      slug: "diagnostic-wash-benin",
      category: {
        fr: "Santé & Hygiène",
        en: "Health & Hygiene"
      },
      title: {
        fr: "Diagnostic WASH – Bénin",
        en: "WASH Diagnostic – Benin"
      },
      description: {
        fr: "Diagnostic sur la disponibilité et la fonctionnalité des infrastructures sanitaires dans les écoles publiques du Bénin. Un travail structurant pour orienter des interventions durables en eau, hygiène et assainissement.",
        en: "Assessment of availability and functionality of sanitary infrastructure in public schools in Benin. Structuring work to guide sustainable interventions in water, hygiene and sanitation."
      },
      content: {
        fr: "Diagnostic sur la disponibilité et la fonctionnalité des infrastructures sanitaires dans les écoles publiques du Bénin.\n\nUn travail structurant pour orienter des interventions durables en eau, hygiène et assainissement.",
        en: "Diagnostic on the availability and functionality of sanitary infrastructures in public schools in Benin.\n\nStructuring work to guide sustainable interventions in water, hygiene and sanitation."
      },
      details: {
        fr: "Diagnostic sur la disponibilité et la fonctionnalité des infrastructures sanitaires dans les écoles publiques du Bénin.\n\nUn travail structurant pour orienter des interventions durables en eau, hygiène et assainissement.",
        en: "Diagnostic on the availability and functionality of sanitary infrastructures in public schools in Benin.\n\nStructuring work to guide sustainable interventions in water, hygiene and sanitation."
      }
    },
    {
      slug: "filiere-viticole-quebec",
      category: {
        fr: "Agriculture & Valorisation",
        en: "Agriculture & Valorisation"
      },
      title: {
        fr: "Filière viticole – Québec",
        en: "Wine sector – Quebec"
      },
      description: {
        fr: "Observation terrain de la production pour mieux comprendre les leviers de valorisation, de structuration et de durabilité économique.",
        en: "Field observation of production to better understand the levers of valorisation, structuring and economic sustainability."
      },
      content: {
        fr: "L’importance de l’observation du terrain dans le développement économique...\n\nSur le terrain, l’économie apparaît sous une forme beaucoup plus concrète...",
        en: "The importance of field observation in economic development...\n\nIn the field, the economy appears in a much more concrete form..."
      },
      details: {
        fr: "L’importance de l’observation du terrain dans le développement économique",
        en: "The importance of field observation in economic development"
      }
    },
    {
      slug: "filiere-pomicole-quebec",
      category: {
        fr: "Agriculture & Transformation",
        en: "Agriculture & Processing"
      },
      title: {
        fr: "Filière pomicole – Québec",
        en: "Apple sector – Quebec"
      },
      description: {
        fr: "Lecture terrain des dynamiques de production locale et des opportunités de transformation à plus forte valeur ajoutée.",
        en: "Field reading of local production dynamics and higher value-added transformation opportunities."
      },
      content: {
        fr: "Quand la transformation change l’économie d’une filière...",
        en: "When processing changes the economy of a sector..."
      },
      details: {
        fr: "Quand la transformation change l’économie d’une filière",
        en: "When processing changes the economy of a sector"
      }
    },
    {
      slug: "piri-piri-kenya",
      category: {
        fr: "Chaîne de Valeur",
        en: "Value Chain"
      },
      title: {
        fr: "Champ de piri piri – Coopérative",
        en: "Piri piri field – Cooperative"
      },
      description: {
        fr: "Analyse de la chaîne de valeur et des opportunités de transformation pour renforcer les revenus des coopératives de femmes productrices.",
        en: "Analysis of the value chain and transformation opportunities to strengthen incomes of women producers' cooperatives."
      },
      content: {
        fr: "Comprendre une chaîne de valeur agricole : leçons du terrain...",
        en: "Understanding an agricultural value chain: lessons from the field..."
      },
      details: {
        fr: "Comprendre une chaîne de valeur agricole : leçons du terrain",
        en: "Understanding an agricultural value chain: lessons from the field"
      }
    }
  ];

  // Merge items
  const combined: ExpertiseItem[] = [...validExpertises];
  for (const proj of newProjectsMap) {
    const existingIndex = combined.findIndex(c => c.slug === proj.slug);
    if (existingIndex !== -1) {
      combined[existingIndex] = { ...combined[existingIndex], ...proj };
    } else {
      combined.push(proj);
    }
  }

  // Also handle wash-schools-benin renaming if necessary
  const obsoleteIndex = combined.findIndex(c => c.slug === "wash-schools-benin");
  if (obsoleteIndex !== -1) {
    combined.splice(obsoleteIndex, 1);
  }

  await saveData("expertise", combined);
  console.log("Successfully seeded new projects into Initiatives DB!");
  process.exit(0);
}

run();
