import sequelize from "../lib/db/sequelize";
import { Initiative } from "../lib/db/models";
import { saveData, getData } from "../lib/content-manager";

async function run() {
  await sequelize.sync();
  
  // Update the Database Content via content-manager for safety
  const existing = await getData("expertise");
  
  // Filter out filiere-viticole-quebec
  let combined = existing.filter((item: any) => item.slug !== "filiere-viticole-quebec");
  
  // Find piri-piri-kenya or create it
  const piriIndex = combined.findIndex((c: any) => c.slug === "piri-piri-kenya");
  
  const updatedPiri = {
    slug: "piri-piri-kenya",
    icon: "Target",
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
    details: {
      fr: "Comprendre une chaîne de valeur agricole : leçons du terrain\n\nDans de nombreux contextes de développement économique, les stratégies sont souvent conçues à distance du terrain. Pourtant, comprendre réellement une activité productive exige d'observer les systèmes économiques là où ils prennent forme : dans les exploitations, les coopératives et les espaces de production.\n\nMes différentes immersions dans des filières agricoles m'ont rappelé une réalité simple : l'économie d'une filière ne se résume pas à la production. Elle repose sur une chaîne d'acteurs, de décisions et de transformations qui déterminent la valeur finale d'un produit.\n\nObserver un vignoble, un verger ou un champ de piments n'est donc pas seulement une expérience agricole. C'est une manière de comprendre les mécanismes économiques qui structurent les revenus des producteurs.\n\nDans une filière agricole, plusieurs étapes déterminent la création de valeur : la production, la transformation, la distribution et la commercialisation. Lorsque les producteurs restent limités à la production brute, la plus grande partie de la valeur est souvent captée ailleurs dans la chaîne. Cela est un peu la réalité de plusieurs producteurs en terrain africain.\n\nC'est précisément pour cette raison que la transformation locale devient un enjeu stratégique. Transformer un produit agricole — que ce soit par le séchage, la transformation alimentaire ou l'emballage — permet d'augmenter sa valeur économique et d'améliorer la résilience des producteurs face aux fluctuations des marchés.\n\nCes observations montrent également l'importance de l'organisation collective. Les coopératives et les structures de producteurs jouent un rôle central dans la structuration des filières. Elles permettent de mutualiser les ressources, de négocier de meilleurs prix et d'accéder plus facilement aux marchés.\n\nMais pour que ces structures fonctionnent durablement, elles doivent s'appuyer sur une gouvernance solide, des capacités organisationnelles renforcées et une vision économique claire.\n\nL'observation terrain permet précisément d'identifier ces dynamiques : les forces existantes, les contraintes structurelles et les opportunités de transformation.\n\nAu-delà de l'analyse technique, ces immersions rappellent que le développement économique repose d'abord sur une compréhension fine des réalités locales. Les stratégies efficaces ne sont pas celles qui imposent des modèles abstraits, mais celles qui partent des systèmes existants pour renforcer leur potentiel.\n\nComprendre une chaîne de valeur agricole, c'est donc comprendre comment transformer une activité productive en véritable levier de développement économique.",
      en: "Understanding an agricultural value chain: lessons from the field...\n\nIn many contexts of economic development, strategies are often designed away from the field. However, to truly understand a productive activity requires observing economic systems where they take shape...\n\nMy various immersions in agricultural sectors have reminded me of a simple reality: the economy of a sector is not limited to production..."
    },
    image: "/projects/image2.png",
    link: null
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
