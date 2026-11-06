import sequelize from "../lib/db/sequelize";
import { saveData, getData } from "../lib/content-manager";

async function run() {
  await sequelize.sync();
  
  const existing = await getData("expertise");
  
  const index = existing.findIndex((c: any) => c.slug === "filiere-pomicole-quebec");
  
  if (index !== -1) {
    existing[index] = { 
      ...existing[index], 
      description: {
        fr: "Lecture terrain des dynamiques de production locale et des opportunités de transformation à plus forte valeur ajoutée.",
        en: "Field reading of local production dynamics and higher value-added transformation opportunities."
      },
      content: {
        fr: "Quand la transformation change l’économie d’une filière\n\nDans beaucoup de filières agricoles, tout commence par la production. On cultive, on récolte, on vend. Le cycle paraît simple.\n\nMais derrière cette simplicité apparente se cache une réalité économique plus complexe. La production, à elle seule, ne suffit presque jamais à capter la valeur d’un produit.\n\nLe plus souvent, la valeur se construit plus loin dans la chaîne.\n\nEntre la récolte et le consommateur final, plusieurs étapes interviennent : transformation, conditionnement, transport, distribution. À chacune de ces étapes, le produit change. Et avec lui, sa valeur économique.\n\nC’est pour cette raison que la transformation occupe une place stratégique dans l’organisation des filières.\n\nTransformer un produit agricole ne signifie pas seulement modifier sa forme. Cela signifie souvent lui donner une durée de vie plus longue, faciliter son transport, ou le rendre accessible à de nouveaux marchés. Dans certains cas, cela permet aussi de répondre à des attentes spécifiques des consommateurs.\n\nPrenons un exemple simple. Un produit vendu brut sur un marché local peut générer un revenu limité. Mais une fois transformé, conditionné et correctement positionné sur le marché, ce même produit peut atteindre une valeur beaucoup plus élevée.\n\nLa transformation devient alors un levier économique.\n\nElle permet de déplacer une partie de la valeur vers les producteurs et les territoires où la production a lieu. Elle ouvre aussi la porte à de nouvelles activités : transformation artisanale, petites unités de production, création de marques locales.\n\nMais cette transition ne se fait pas automatiquement.\n\nPour qu’une transformation réussisse, plusieurs conditions doivent être réunies : accès aux équipements, compétences techniques, organisation collective et accès aux marchés. Sans ces éléments, les initiatives restent fragiles.\n\nC’est pourquoi les projets de développement qui s’intéressent aux filières agricoles doivent regarder l’ensemble de la chaîne de valeur. Produire davantage ne suffit pas toujours. Structurer les étapes qui suivent la production devient souvent la véritable clé.\n\nDans de nombreux contextes, la transformation représente ainsi un passage important : celui qui permet à une activité agricole de devenir un véritable moteur économique pour les producteurs et leurs communautés.",
        en: existing[index].content?.en || existing[index].details?.en || ""
      },
      details: {
        fr: "Quand la transformation change l’économie d’une filière\n\nDans beaucoup de filières agricoles, tout commence par la production. On cultive, on récolte, on vend. Le cycle paraît simple.\n\nMais derrière cette simplicité apparente se cache une réalité économique plus complexe. La production, à elle seule, ne suffit presque jamais à capter la valeur d’un produit.\n\nLe plus souvent, la valeur se construit plus loin dans la chaîne.\n\nEntre la récolte et le consommateur final, plusieurs étapes interviennent : transformation, conditionnement, transport, distribution. À chacune de ces étapes, le produit change. Et avec lui, sa valeur économique.\n\nC’est pour cette raison que la transformation occupe une place stratégique dans l’organisation des filières.\n\nTransformer un produit agricole ne signifie pas seulement modifier sa forme. Cela signifie souvent lui donner une durée de vie plus longue, faciliter son transport, ou le rendre accessible à de nouveaux marchés. Dans certains cas, cela permet aussi de répondre à des attentes spécifiques des consommateurs.\n\nPrenons un exemple simple. Un produit vendu brut sur un marché local peut générer un revenu limité. Mais une fois transformé, conditionné et correctement positionné sur le marché, ce même produit peut atteindre une valeur beaucoup plus élevée.\n\nLa transformation devient alors un levier économique.\n\nElle permet de déplacer une partie de la valeur vers les producteurs et les territoires où la production a lieu. Elle ouvre aussi la porte à de nouvelles activités : transformation artisanale, petites unités de production, création de marques locales.\n\nMais cette transition ne se fait pas automatiquement.\n\nPour qu’une transformation réussisse, plusieurs conditions doivent être réunies : accès aux équipements, compétences techniques, organisation collective et accès aux marchés. Sans ces éléments, les initiatives restent fragiles.\n\nC’est pourquoi les projets de développement qui s’intéressent aux filières agricoles doivent regarder l’ensemble de la chaîne de valeur. Produire davantage ne suffit pas toujours. Structurer les étapes qui suivent la production devient souvent la véritable clé.\n\nDans de nombreux contextes, la transformation représente ainsi un passage important : celui qui permet à une activité agricole de devenir un véritable moteur économique pour les producteurs et leurs communautés.",
        en: existing[index].details?.en || ""
      }
    };

    await saveData("expertise", existing);
    console.log("Database updated successfully.");
  } else {
    console.log("Could not find the pomicole project.");
  }
  
  process.exit(0);
}

run();
