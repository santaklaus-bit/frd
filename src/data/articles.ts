/**
 * Articles OPUS CORP — classeur ART.01 et ART.02 (propositions éditoriales « À valider », à relire avant publication).
 * Dates : date réelle de mise en ligne à fournir (ART.xx.03) — la date d'intégration est utilisée en attendant.
 * Images : libres de droits (Mixkit) — à remplacer par des visuels OPUS autorisés.
 */
export type Article = {
  slug: string;
  category: string;
  title: string;
  date: string;
  dateLabel: string;
  image: string;
  alt: string;
  excerpt: string; // chapeau + description SEO
  intro: string; // introduction du corps (mise en avant)
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "comment-opus-prepare-une-experience-de-marque",
    category: "Méthode",
    title: "Comment OPUS prépare une expérience de marque",
    date: "2026-09-15",
    dateLabel: "15 sept. 2026",
    image: "/images/blog/opus_art_01_couverture_v01.jpg",
    alt: "Salle de spectacle avec le public et des lumières (visuel provisoire)",
    excerpt: "Du premier brief au bilan, une méthode pour relier l'objectif du client à l'expérience du public.",
    intro:
      "Tout commence par deux questions : que doit vivre le public, et que doit obtenir le client ? Chez OPUS CORP, elles orientent la conception d'un événement, d'une activation ou d'un espace de marque.",
    body: [
      "Le brief permet de préciser le besoin, les publics, le lieu, les dates et les contraintes. Le concept, le budget et le calendrier sont ensuite discutés et validés. Cette préparation donne un cadre commun au client et à l'équipe.",
      "Pendant la réalisation, un interlocuteur projet coordonne les informations et les décisions. Les supports, les espaces et les contenus doivent raconter la même intention. Lorsqu'un changement intervient, ses effets sur le budget, les délais et les livrables sont examinés avant exécution.",
      "Avant la livraison, les contrôles permettent de repérer les points à corriger. Le travail se poursuit avec la réception et le bilan : comprendre ce qui a fonctionné, écouter les retours et identifier ce qui peut être amélioré.",
      "Notre promesse est simple : une expérience pensée pour votre public, préparée avec méthode et suivie jusqu'à sa livraison.",
    ],
  },
  {
    slug: "culture-opus-attention-public-collectif",
    category: "Culture OPUS",
    title: "La culture OPUS : l'attention au public et le sens du collectif",
    date: "2026-09-15",
    dateLabel: "15 sept. 2026",
    image: "/images/blog/opus_art_02_couverture_v01.jpg",
    alt: "Scène de concert éclairée en violet (visuel provisoire)",
    excerpt: "Cinq valeurs pour guider la conception, les décisions et la réalisation de nos projets.",
    intro:
      "OPUS CORP se construit autour d'une conviction : la façon dont une marque accueille, fait participer et laisse un souvenir compte autant que ce qu'elle annonce. Depuis notre démarrage opérationnel en janvier 2026, nous construisons notre méthode autour de cette attention à l'expérience.",
    body: [
      "L'attention au public invite à regarder le parcours du point de vue du visiteur. La fiabilité demande des délais réalistes et des alertes suffisamment tôt pour pouvoir agir. L'exigence conduit à faire vérifier un livrable avant sa diffusion ou son installation.",
      "La responsabilité concerne les engagements, le budget et les moyens mobilisés. L'esprit collectif repose sur la transmission des informations utiles, l'entraide et la qualité des relais entre les personnes.",
      "Notre organisation réunit trois départements : Administratif, Communication et Marketing, Opérations. Leurs rôles se complètent pour relier le besoin du client, la conception et les contraintes du terrain.",
      "Cette culture se construit projet après projet, avec des faits et des apprentissages. Un besoin mieux compris, une installation contrôlée ou un retour partagé donnent un contenu concret à nos valeurs.",
    ],
  },
];
