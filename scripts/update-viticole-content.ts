import sequelize from "../lib/db/sequelize";
import { Initiative } from "../lib/db/models";
import { saveData, getData } from "../lib/content-manager";

async function run() {
  await sequelize.sync();
  
  // Update the Database Content via content-manager for safety
  const existing = await getData("expertise");
  
  // Filter out diagnostic-wash-benin
  let combined = existing.filter((item: any) => item.slug !== "diagnostic-wash-benin");
  
  // Find filiere-viticole-quebec or create it
  const viticoleIndex = combined.findIndex((c: any) => c.slug === "filiere-viticole-quebec");
  
  const updatedViticole = {
    slug: "filiere-viticole-quebec",
    icon: "TrendingUp",
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
    details: {
      fr: "L’importance de l’observation du terrain dans le développement économique\n\nDans les discussions sur le développement économique, les stratégies sont souvent élaborées à partir de rapports, de données et d’analyses théoriques. Ces outils sont nécessaires. Ils permettent de structurer la réflexion et d’identifier des pistes d’action.\n\nMais ils ont une limite : ils restent souvent éloignés de la réalité du terrain.\n\nSur le terrain, l’économie apparaît sous une forme beaucoup plus concrète. On voit comment les activités productives s’organisent réellement, comment les producteurs prennent leurs décisions et quelles contraintes influencent leur travail au quotidien.\n\nObserver une filière agricole, par exemple, permet de comprendre bien plus que le simple processus de production. On découvre les relations entre les différents acteurs, les conditions de travail, l’accès aux marchés et les difficultés qui freinent la création de valeur.\n\nCes observations révèlent souvent des dynamiques invisibles dans les analyses purement théoriques. Une coopérative peut fonctionner de manière informelle mais efficace. Une activité de transformation peut exister sans être reconnue comme un véritable levier économique. À l’inverse, certaines initiatives présentées comme prometteuses peuvent se heurter à des obstacles très concrets.\n\nLe terrain permet donc de poser les bonnes questions.\nQuels sont les points forts d’une filière ?\nQuelles sont les étapes qui limitent la création de valeur ?\nQuels acteurs jouent déjà un rôle structurant dans l’organisation de la production ?\n\nComprendre ces dynamiques permet d’éviter des interventions déconnectées de la réalité. Les stratégies deviennent alors plus pertinentes, parce qu’elles s’appuient sur ce qui existe déjà et cherchent à renforcer les capacités locales plutôt qu’à imposer des modèles extérieurs.\n\nL’observation du terrain ne remplace pas l’analyse stratégique. Elle la complète. Elle permet d’ancrer les décisions dans une compréhension fine des contextes économiques et sociaux.\n\nDans de nombreux cas, ce sont ces observations directes qui révèlent les véritables opportunités de transformation : améliorer une organisation existante, structurer une étape de transformation locale ou renforcer les liens entre les différents acteurs d’une filière.\n\nLe développement économique durable commence souvent par cette étape simple, mais essentielle : prendre le temps de regarder, d’écouter et de comprendre comment les systèmes productifs fonctionnent réellement.",
      en: "The importance of field observation in economic development...\n\nIn economic development discussions, strategies are often developed from reports, data and theoretical analysis. These tools are necessary... But they have a limit: they often remain far from the reality on the ground.\n\nIn the field, the economy appears in a much more concrete form..."
    },
    image: "/projects/image3.jpg",
    link: null
  };

  if (viticoleIndex !== -1) {
    combined[viticoleIndex] = { ...combined[viticoleIndex], ...updatedViticole };
  } else {
    combined.push(updatedViticole);
  }

  await saveData("expertise", combined);
  
  // also explicitly delete the old one from the db if saveData doesn't prune it
  await Initiative.destroy({ where: { slug: "diagnostic-wash-benin" } });
  
  console.log("Database updated successfully.");
  process.exit(0);
}

run();
