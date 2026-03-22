import sequelize from "../lib/db/sequelize";
import { Initiative } from "../lib/db/models";
import { saveData, getData } from "../lib/content-manager";

async function run() {
  console.log("Syncing database schema...");
  await sequelize.sync({ alter: true });
  console.log("Database schema synced!");

  const existing = await getData("expertise");

  // Filter out any placeholders
  const validExpertises = existing.filter((item: any) => item.slug && item.slug !== "");

  // Make sure to add our 3 new projects if they do not exist
  const newProjectsMap = [
    {
      slug: "diagnostic-wash-benin",
      icon: "Target",
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
      details: {
        fr: "Diagnostic sur la disponibilité et la fonctionnalité des infrastructures sanitaires dans les écoles publiques du Bénin.\\n\\nUn travail structurant pour orienter des interventions durables en eau, hygiène et assainissement.",
        en: "Diagnostic on the availability and functionality of sanitary infrastructures in public schools in Benin.\\n\\nStructuring work to guide sustainable interventions in water, hygiene and sanitation."
      },
      image: "/projects/image5.jpg"
    },
    {
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
        fr: "L’importance de l’observation du terrain dans le développement économique\\n\\nDans les discussions sur le développement économique, les stratégies sont souvent élaborées à partir de rapports, de données et d’analyses théoriques. Ces outils sont nécessaires. Ils permettent de structurer la réflexion et d’identifier des pistes d’action.\\n\\nMais ils ont une limite : ils restent souvent éloignés de la réalité du terrain.\\n\\nSur le terrain, l’économie apparaît sous une forme beaucoup plus concrète. On voit comment les activités productives s’organisent réellement, comment les producteurs prennent leurs décisions et quelles contraintes influencent leur travail au quotidien.\\n\\nObserver une filière agricole, par exemple, permet de comprendre bien plus que le simple processus de production. On découvre les relations entre les différents acteurs, les conditions de travail, l’accès aux marchés et les difficultés qui freinent la création de valeur.\\n\\nCes observations révèlent souvent des dynamiques invisibles dans les analyses purement théoriques. Une coopérative peut fonctionner de manière informelle mais efficace. Une activité de transformation peut exister sans être reconnue comme un véritable levier économique. À l’inverse, certaines initiatives présentées comme prometteuses peuvent se heurter à des obstacles très concrets.\\n\\nLe terrain permet donc de poser les bonnes questions.\\nQuels sont les points forts d’une filière ? Quelles sont les étapes qui limitent la création de valeur ? Quels acteurs jouent déjà un rôle structurant dans l’organisation de la production ?\\n\\nComprendre ces dynamiques permet d’éviter des interventions déconnectées de la réalité. Les stratégies deviennent alors plus pertinentes, parce qu’elles s’appuient sur ce qui existe déjà et cherchent à renforcer les capacités locales plutôt qu’à imposer des modèles extérieurs.\\n\\nL’observation du terrain ne remplace pas l’analyse stratégique. Elle la complète. Elle permet d’ancrer les décisions dans une compréhension fine des contextes économiques et sociaux.\\n\\nDans de nombreux cas, ce sont ces observations directes qui révèlent les véritables opportunités de transformation : améliorer une organisation existante, structurer une étape de transformation locale ou renforcer les liens entre les différents acteurs d’une filière.\\n\\nLe développement économique durable commence souvent par cette étape simple, mais essentielle : prendre le temps de regarder, d’écouter et de comprendre comment les systèmes productifs fonctionnent réellement.",
        en: "The importance of field observation in economic development...\\n\\nIn economic development discussions, strategies are often developed from reports, data and theoretical analysis. These tools are necessary... But they have a limit: they often remain far from the reality on the ground.\\n\\nIn the field, the economy appears in a much more concrete form..."
      },
      image: "/projects/image3.jpg"
    },
    {
      slug: "filiere-pomicole-quebec",
      icon: "TrendingUp",
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
      details: {
        fr: "Quand la transformation change l’économie d’une filière\\n\\nDans beaucoup de filières agricoles, tout commence par la production. On cultive, on récolte, on vend. Le cycle paraît simple.\\n\\nMais derrière cette simplicité apparente se cache une réalité économique plus complexe. La production, à elle seule, ne suffit presque jamais à capter la valeur d’un produit.\\n\\nLe plus souvent, la valeur se construit plus loin dans la chaîne.\\n\\nEntre la récolte et le consommateur final, plusieurs étapes interviennent : transformation, conditionnement, transport, distribution. À chacune de ces étapes, le produit change. Et avec lui, sa valeur économique.\\n\\nC’est pour cette raison que la transformation occupe une place stratégique dans l’organisation des filières.\\n\\nTransformer un produit agricole ne signifie pas seulement modifier sa forme. Cela signifie souvent lui donner une durée de vie plus longue, faciliter son transport, ou le rendre accessible à de nouveaux marchés. Dans certains cas, cela permet aussi de répondre à des attentes spécifiques des consommateurs.\\n\\nPrenons un exemple simple. Un produit vendu brut sur un marché local peut générer un revenu limité. Mais une fois transformé, conditionné et correctement positionné sur le marché, ce même produit peut atteindre une valeur beaucoup plus élevée.\\n\\nLa transformation devient alors un levier économique.\\n\\nElle permet de déplacer une partie de la valeur vers les producteurs et les territoires où la production a lieu. Elle ouvre aussi la porte à de nouvelles activités : transformation artisanale, petites unités de production, création de marques locales.\\n\\nMais cette transition ne se fait pas automatiquement.\\n\\nPour qu’une transformation réussisse, plusieurs conditions doivent être réunies : accès aux équipements, compétences techniques, organisation collective et accès aux marchés. Sans ces éléments, les initiatives restent fragiles.\\n\\nC’est pourquoi les projets de développement qui s’intéressent aux filières agricoles doivent regarder l’ensemble de la chaîne de valeur. Produire davantage ne suffit pas toujours. Structurer les étapes qui suivent la production devient souvent la véritable clé.\\n\\nDans de nombreux contextes, la transformation représente ainsi un passage important : celui qui permet à une activité agricole de devenir un véritable moteur économique pour les producteurs et leurs communautés.",
        en: "When processing changes the economy of a sector...\\n\\nIn many agricultural sectors, everything starts with production. We cultivate, harvest, sell. The cycle seems simple...\\n\\nBut behind this apparent simplicity hides a more complex economic reality. Production alone is almost never enough to capture the value of a product..."
      },
      image: "/projects/image4.jpg"
    },
    {
      slug: "piri-piri-kenya",
      icon: "Target",
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
      details: {
        fr: "Comprendre une chaîne de valeur agricole : leçons du terrain\\n\\nDans de nombreux contextes de développement économique, les stratégies sont souvent conçues à distance du terrain. Pourtant, comprendre réellement une activité productive exige d’observer les systèmes économiques là où ils prennent forme : dans les exploitations, les coopératives et les espaces de production.\\n\\nMes différentes immersions dans des filières agricoles m’ont rappelé une réalité simple : l’économie d’une filière ne se résume pas à la production. Elle repose sur une chaîne d’acteurs, de décisions et de transformations qui déterminent la valeur finale d’un produit.\\n\\nObserver un vignoble, un verger ou un champ de piments n’est donc pas seulement une expérience agricole. C’est une manière de comprendre les mécanismes économiques qui structurent les revenus des producteurs.\\n\\nDans une filière agricole, plusieurs étapes déterminent la création de valeur : la production, la transformation, la distribution et la commercialisation. Lorsque les producteurs restent limités à la production brute, la plus grande partie de la valeur est souvent captée ailleurs dans la chaîne. Cela est un peu la réalité de plusieurs producteurs en terrain africain.\\n\\nC’est précisément pour cette raison que la transformation locale devient un enjeu stratégique. Transformer un produit agricole — que ce soit par le séchage, la transformation alimentaire ou l’emballage — permet d’augmenter sa valeur économique et d’améliorer la résilience des producteurs face aux fluctuations des marchés.\\n\\nCes observations montrent également l’importance de l’organisation collective. Les coopératives et les structures de producteurs jouent un rôle central dans la structuration des filières. Elles permettent de mutualiser les ressources, de négocier de meilleurs prix et d’accéder plus facilement aux marchés.\\n\\nMais pour que ces structures fonctionnent durablement, elles doivent s’appuyer sur une gouvernance solide, des capacités organisationnelles renforcées et une vision économique claire.\\n\\nL’observation terrain permet précisément d’identifier ces dynamiques : les forces existantes, les contraintes structurelles et les opportunités de transformation.\\n\\nAu-delà de l’analyse technique, ces immersions rappellent que le développement économique repose d’abord sur une compréhension fine des réalités locales. Les stratégies efficaces ne sont pas celles qui imposent des modèles abstraits, mais celles qui partent des systèmes existants pour renforcer leur potentiel.\\n\\nComprendre une chaîne de valeur agricole, c’est donc comprendre comment transformer une activité productive en véritable levier de développement économique.",
        en: "Understanding an agricultural value chain: lessons from the field...\\n\\nIn many contexts of economic development, strategies are often designed away from the field. However, to truly understand a productive activity requires observing economic systems where they take shape...\\n\\nMy various immersions in agricultural sectors have reminded me of a simple reality: the economy of a sector is not limited to production..."
      },
      image: "/projects/image2.png"
    }
  ];

  // Merge items
  const combined = [...validExpertises];
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
