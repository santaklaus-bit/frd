/**
 * Événements / projets OPUS CORP — Réalisations réelles et portfolio.
 * Données réelles documentées avec visuels officiels OPUS CORP (Singuila, Tout Canal & Netflix, Canalbox Sofitel)
 * complétées par les projets partenaires et galeries photos enrichies.
 */
export type EventItem = {
  slug: string;
  title: string;
  city: string;
  country: string;
  venue: string;
  date: string; // ISO (tri)
  dateLabel: string;
  image: string;
  alt: string;
  gallery?: string[];
  category: string; // filtres EVL.FIL générés à partir des catégories
  excerpt: string;
  about: string[];
  role: string; // Intervention OPUS (EVT.xx.07)
  audience: string; // Public et unité (EVT.xx.08)
  hours: string; // EVT.xx.09
  lineupLabel: string; // EVT.GLO.04 — « Intervention OPUS »
  lineup: string[];
  featured?: boolean;
};

const FULL = ["Conception", "Scénographie", "Branding", "Production"];

export const events: EventItem[] = [
  {
    slug: "meet-and-greet-singuila",
    title: "Meet & Greet Singuila (20 ans de carrière)",
    city: "Cotonou",
    country: "Bénin",
    venue: "Le Black Cotonou",
    date: "2025-09-20",
    dateLabel: "Septembre 2025",
    image: "/images/events/singuila-01.jpg",
    alt: "Singuila lors du Meet & Greet pour ses 20 ans de carrière au Black Cotonou avec Canal+",
    gallery: [
      "/images/events/singuila-01.jpg",
      "/images/events/singuila-02.jpg",
      "/images/events/singuila-03.jpg",
      "/images/events/singuila-04.jpg",
      "/images/events/singuila-05.jpg",
    ],
    category: "Soirée privée",
    excerpt:
      "Célébration exclusive des 20 ans de carrière de Singuila au Black Cotonou en partenariat avec Canal+ : scénographie, branding et production intégrale par OPUS CORP.",
    about: [
      "À l'occasion de la célébration de ses 20 ans de carrière musicale, l'artiste Singuila a réuni ses fans, la presse et des invités prestigieux lors d'un Meet & Greet exclusif au club Le Black Cotonou, en partenariat avec Canal+.",
      "OPUS CORP a assuré la conception de l'expérience et l'ensemble du déploiement : arche monumentale lumineuse, tapis rouge d'accueil, photocalls personnalisés, scénographie intérieure de l'espace lounge et coordination générale de l'événement.",
    ],
    role: "Conception, scénographie, branding & production",
    audience: "250+ invités VIP",
    hours: "20h00 – 02h00",
    lineupLabel: "Intervention OPUS",
    lineup: FULL,
    featured: true, // Événement vedette à l'honneur
  },
  {
    slug: "lancement-tout-canal-netflix",
    title: "Lancement Produit « Tout Canal & Netflix »",
    city: "Cotonou",
    country: "Bénin",
    venue: "Canal+ Bénin, Cotonou",
    date: "2025-07-21",
    dateLabel: "21 juillet 2025",
    image: "/images/events/tout-canal-netflix-01.jpg",
    alt: "Scénographie immersive pour le lancement de l'offre Tout Canal+ et Netflix par OPUS CORP",
    gallery: [
      "/images/events/tout-canal-netflix-01.jpg",
      "/images/events/tout-canal-netflix-02.jpg",
      "/images/events/tout-canal-netflix-03.jpg",
      "/images/events/tout-canal-netflix-04.jpg",
      "/images/events/tout-canal-netflix-05.jpg",
    ],
    category: "Lancement de produit",
    excerpt:
      "Transformation d'un espace corporate en univers immersif néon pour la nouvelle formule Tout Canal+ & Netflix : scénographie et production par OPUS CORP.",
    about: [
      "Quand l'équipe Canal+ a confié à OPUS CORP le défi de transformer une salle en un univers immersif à l'image de leur nouvelle formule TOUT CANAL & NETFLIX, l'agence a créé une véritable expérience de marque pour l'after-work presse.",
      "Mise en lumière dynamique aux tons magenta et bleu, décors inspirés des séries cultes Netflix, cubes rétro-éclairés, signalétique au sol et mobilier lounge : un cadre à fort impact visuel salué par les médias et la direction.",
    ],
    role: "Scénographie, branding & aménagement immersif",
    audience: "150+ journalistes & partenaires",
    hours: "18h00 – 22h00",
    lineupLabel: "Intervention OPUS",
    lineup: ["Scénographie", "Mise en lumière", "Branding", "Production"],
  },
  {
    slug: "lancement-canalbox-sofitel",
    title: "Lancement CANALBOX Sofitel",
    city: "Cotonou",
    country: "Bénin",
    venue: "Sofitel Cotonou Marina",
    date: "2025-04-30",
    dateLabel: "30 avril 2025",
    image: "/images/events/canalbox-sofitel-01.jpg",
    alt: "Oriflammes et scénographie CANALBOX au Sofitel Cotonou Marina par OPUS CORP",
    gallery: [
      "/images/events/canalbox-sofitel-01.jpg",
      "/images/events/canalbox-sofitel-02.jpg",
      "/images/events/canalbox-sofitel-03.jpg",
      "/images/events/canalbox-sofitel-04.jpg",
      "/images/events/canalbox-sofitel-05.jpg",
    ],
    category: "Lancement de marque",
    excerpt:
      "Accompagnement de GVA pour le grand lancement de la fibre CANALBOX au Sofitel Cotonou : habillage extérieur monumental, photocalls et scène de conférence.",
    about: [
      "OPUS CORP a accompagné GVA (Groupe Vivendi Africa) pour le lancement officiel de CANALBOX le 30 avril 2025 au prestigieux Sofitel Cotonou Marina.",
      "Le savoir-faire de l'agence a donné vie à une expérience mémorable : impressionnante haie d'oriflammes roses habillant l'esplanade du Sofitel, photocalls VIP, scénographie de scène aux colonnes graphiques (« Accessible, Collectif, Illimité ») et gestion de la régie événementielle.",
    ],
    role: "Production d'événements, scénographie & branding",
    audience: "500+ participants & officiels",
    hours: "15h00 – 21h00",
    lineupLabel: "Intervention OPUS",
    lineup: ["Production", "Scénographie", "Branding extérieur", "Régie"],
  },
  {
    slug: "next-fintech-forum-2026",
    title: "Next Fintech Forum 2026 (8ᵉ édition)",
    city: "Cotonou",
    country: "Bénin",
    venue: "Sofitel Cotonou Marina Hotel & Spa",
    date: "2026-11-26",
    dateLabel: "26–27 novembre 2026",
    image: "/images/events/opus_evt_05_couverture_v01.jpg",
    alt: "Next Fintech Forum au Sofitel Cotonou Marina avec l'accompagnement logistique d'OPUS CORP",
    gallery: [
      "/images/events/opus_evt_05_couverture_v01.jpg",
      "/images/events/canalbox-sofitel-01.jpg",
      "/images/events/canalbox-sofitel-03.jpg",
      "/images/events/opus_evt_06_couverture_v01.jpg",
    ],
    category: "Forum & Sommet",
    excerpt:
      "Partenariat logistique et déploiement événementiel pour la 8ᵉ édition du Next Fintech Forum au Sofitel Cotonou Marina, réunissant plus de 500 décideurs africains.",
    about: [
      "Organisé par l'Alliance Fintech UEMOA autour du thème « De l'adoption à la valeur : industrialiser la Fintech pour accélérer la croissance », le Next Fintech Forum réunit à Cotonou plus de 500 décideurs, régulateurs et leaders financiers d'Afrique.",
      "En tant que partenaire logistique et opérationnel sur place, OPUS CORP accompagne la mise en place des espaces de conférence, la signalétique directionnelle, l'accueil protocolaire et la coordination terrain au Sofitel Cotonou Marina Hotel & Spa.",
    ],
    role: "Partenaire logistique, aménagement d'espaces & coordination",
    audience: "500+ décideurs & experts",
    hours: "08h30 – 19h00",
    lineupLabel: "Intervention OPUS",
    lineup: ["Logistique événementielle", "Aménagement d'espaces", "Signalétique", "Coordination terrain"],
  },
  {
    slug: "effuzion-2026",
    title: "EFFUZION 2026",
    city: "Cotonou",
    country: "Bénin",
    venue: "Majestic Cinéma, Wologuèdè",
    date: "2026-08-14",
    dateLabel: "14–16 août 2026",
    image: "/images/events/opus_evt_01_couverture_v01.jpg",
    alt: "Festival EFFUZION à Cotonou",
    gallery: [
      "/images/events/opus_evt_01_couverture_v01.jpg",
      "/images/events/opus_evt_galerie_08.jpg",
      "/images/events/opus_evt_galerie_09.jpg",
      "/images/events/opus_evt_06_couverture_v01.jpg",
    ],
    category: "Festival",
    excerpt:
      "Trois jours de festival au Majestic Cinéma de Wologuèdè : OPUS CORP en a porté la conception, la scénographie, le branding et la production.",
    about: [
      "EFFUZION a réuni plus de 10 000 festivaliers à Cotonou du 14 au 16 août 2026, de 9h00 à 2h30, au Majestic Cinéma de Wologuèdè.",
      "OPUS CORP est intervenue sur l'ensemble du projet : conception de l'expérience, scénographie des espaces, identité et supports de marque, puis production jusqu'à l'ouverture au public.",
    ],
    role: "Conception, scénographie, branding & production",
    audience: "10 000+ festivaliers",
    hours: "9h00 – 2h30",
    lineupLabel: "Intervention OPUS",
    lineup: FULL,
  },
  {
    slug: "concert-jonathan-gambela",
    title: "Concert Jonathan Gambela",
    city: "Cotonou",
    country: "Bénin",
    venue: "Majestic Cinéma, Wologuèdè",
    date: "2026-05-09",
    dateLabel: "9 mai 2026",
    image: "/images/events/opus_evt_02_couverture_v01.jpg",
    alt: "Concert Jonathan Gambela au Majestic Cinéma",
    gallery: [
      "/images/events/opus_evt_02_couverture_v01.jpg",
      "/images/events/opus_evt_galerie_01.jpg",
      "/images/events/opus_evt_galerie_02.jpg",
      "/images/events/opus_evt_galerie_07.jpg",
    ],
    category: "Concert",
    excerpt:
      "Le concert de Jonathan Gambela au Majestic Cinéma : 5 000 participants et un dispositif conçu et produit par OPUS CORP.",
    about: [
      "Le 9 mai 2026, le concert de Jonathan Gambela a rassemblé plus de 5 000 participants au Majestic Cinéma de Wologuèdè, de 16h00 à 2h00.",
      "OPUS CORP a assuré la conception, la scénographie, le branding et la production de l'événement.",
    ],
    role: "Conception, scénographie, branding & production",
    audience: "5 000+ participants",
    hours: "16h00 – 2h00",
    lineupLabel: "Intervention OPUS",
    lineup: FULL,
  },
  {
    slug: "canal-plus-after-work",
    title: "Canal+ After work",
    city: "Cotonou",
    country: "Bénin",
    venue: "Family Beach",
    date: "2026-05-08",
    dateLabel: "8 mai 2026",
    image: "/images/events/opus_evt_03_couverture_v01.jpg",
    alt: "Canal+ After work au Family Beach de Cotonou produit par OPUS CORP",
    gallery: [
      "/images/events/opus_evt_03_couverture_v01.jpg",
      "/images/events/tout-canal-netflix-02.jpg",
      "/images/events/singuila-05.jpg",
      "/images/events/opus_evt_galerie_03.jpg",
    ],
    category: "After-work & Activation",
    excerpt:
      "Un after-work exclusif en bord de mer pour Canal+ au Family Beach de Cotonou, conçu, scénographié et produit par OPUS CORP.",
    about: [
      "Le 8 mai 2026, Canal+ a réuni plus de 300 invités et partenaires au Family Beach de Cotonou pour un after-work convivial de 16h00 à 22h00.",
      "OPUS CORP a pris en charge la conception de l'ambiance, la scénographie de plage, l'habillage aux couleurs de la marque et la production complète de la soirée.",
    ],
    role: "Conception, scénographie, branding & production",
    audience: "300+ participants",
    hours: "16h00 – 22h00",
    lineupLabel: "Intervention OPUS",
    lineup: FULL,
  },
  {
    slug: "eat-drink-festival-cotonou",
    title: "Eat & Drink Festival Cotonou",
    city: "Cotonou",
    country: "Bénin",
    venue: "Majestic Cinéma, Wologuèdè",
    date: "2026-03-14",
    dateLabel: "14–15 mars 2026",
    image: "/images/events/opus_evt_04_couverture_v01.jpg",
    alt: "Eat & Drink Festival à Cotonou",
    gallery: [
      "/images/events/opus_evt_04_couverture_v01.jpg",
      "/images/events/opus_evt_galerie_10.jpg",
      "/images/events/opus_evt_galerie_04.jpg",
      "/images/events/opus_evt_galerie_06.jpg",
    ],
    category: "Food & lifestyle",
    excerpt:
      "Deux jours de food & lifestyle et plus de 10 000 visiteurs : OPUS CORP a conçu, scénographié et habillé le festival.",
    about: [
      "Les 14 et 15 mars 2026, l'Eat & Drink Festival a accueilli plus de 10 000 visiteurs au Majestic Cinéma de Wologuèdè, de 17h00 à 2h00.",
      "OPUS CORP est intervenue sur la conception, la scénographie et le branding du festival.",
    ],
    role: "Conception, scénographie & branding",
    audience: "10 000+ visiteurs",
    hours: "17h00 – 2h00",
    lineupLabel: "Intervention OPUS",
    lineup: ["Conception", "Scénographie", "Branding"],
  },
];

export const featuredEvent = events.find((e) => e.featured) ?? events[0];
export const homeEvents = events.slice(0, 5); // ACC.EVT.04 — 5 cartes
export const recentEvents = [events[0], events[1], events[2], events[3]]; // ACC.REC.03 — 4 fiches
export const getEvent = (slug: string) => events.find((e) => e.slug === slug);
