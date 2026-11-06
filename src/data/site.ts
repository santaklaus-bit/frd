/**
 * Informations OPUS CORP.
 * Sources : classeur « Contenus Site Web.xlsx » (relevé du 14 sept. 2026, identifiants GLO.* / LIV.*),
 * bio TikTok @opuscorp_ (« Chaque projet, une œuvre — Événementiel • Design • Branding — Cotonou, Bénin »),
 * résumé de posts Instagram (@opuscorp__ via Bénin Bouge) pour le téléphone.
 * Coordonnées, adresse et identifiants légaux : Google Sheet « Contenus Site Web » mis à jour par OPUS (relevé du 25 sept. 2026).
 * Les champs `null` sont « À compléter » dans le classeur : l'UI affiche « à confirmer » à la place.
 */
export const site = {
  name: "OPUS CORP", // GLO.NAV.01
  shortName: "OPUS",
  tagline: "OPUS, la marque se vit.", // GLO.ID.03 — signature proposée, à valider
  motto: "Chaque projet, une œuvre.", // bio TikTok (réel)
  description:
    "OPUS CORP est une agence de communication BTL à Cotonou. Nous concevons et réalisons des expériences événementielles qui rapprochent les marques de leurs publics.", // ACC.HER.02
  seoDescription:
    "OPUS CORP à Cotonou : communication BTL, événements, activations, espaces de marque et contenus pour rapprocher les marques de leurs publics.", // LIV.SEO.02
  mission:
    "OPUS CORP est une entreprise de communication BTL qui place l'expérience événementielle au cœur de son approche. Nous accompagnons les marques et les organisations dans la conception et la réalisation d'événements, d'activations, d'espaces de marque et de contenus associés.", // ACC.INT.01
  promise:
    "Concevoir et réaliser des expériences de marque qui rapprochent les organisations de leurs publics, avec une exécution maîtrisée et des résultats observables.", // APR.INT.01
  city: "Cotonou, Bénin", // GLO.ID.01
  address: { line1: "Missité Sikè", line2: "Cotonou, Littoral, Bénin" } as { line1: string; line2: string } | null, // GLO.CON.04
  // GLO.CON.02 : le classeur indique « +299 » (indicatif du Groenland) — coquille corrigée en +229, cohérent avec LEG.COR.06.
  phone: "+229 01 99 89 18 18" as string | null,
  phoneHref: "tel:+2290199891818",
  // GLO.CON.03 : le lien fourni (wa.me/22999891818) omet le « 01 » de la numérotation béninoise à 10 chiffres → aligné sur le téléphone. À tester.
  whatsapp: "https://wa.me/2290199891818" as string | null,
  email: "contact@opuscrp.com" as string | null, // GLO.CON.01 — domaine opuscrp.com (existant)
  since: 2026, // GLO.ID.02 — démarrage opérationnel janvier 2026 (immatriculation sept. 2025)
  legal: { form: "SARL", capital: "1 000 000 FCFA", rccm: "RB/COT/25 B 41042", ifu: "3202522640514" }, // LEG.COR.03/04/07
  departments: ["Administratif", "Communication & Marketing", "Opérations"], // GLO.EQU.02
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/opuscorp__/" }, // GLO.CON.05 (fourni)
    { label: "Facebook", href: "https://www.facebook.com/share/1T2ksSKNGZ/" }, // GLO.CON.07 (fourni)
    // GLO.CON.08 — TikTok https://www.tiktok.com/@opuscorp_ : réserve de contenu, non affiché sans décision de la direction.
    // GLO.CON.06 LinkedIn : À compléter.
  ],
  stats: {
    since: "2026",
    departments: "3",
    services: "3",
    projectTypes: "6",
  },
  nav: [
    { label: "Accueil", href: "/" },
    { label: "À propos", href: "/a-propos" },
    { label: "L'équipe", href: "/equipe" },
    { label: "Événements", href: "/evenements" },
    { label: "Blog", href: "/blog" },
  ],
  cta: { label: "Contactez-nous", href: "/reserver" },
};

/** Libellé affiché quand une coordonnée n'est pas encore fournie (LIV.REG.07 : ne pas laisser une case vide). */
export const TO_CONFIRM = "À confirmer";
