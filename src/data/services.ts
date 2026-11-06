/**
 * Services OPUS CORP — classeur SER.01 à SER.03 (propositions « À valider »). Trois cartes, pas les trois départements internes.
 * `pole` : déclinaison de la charte (plans 6 à 8 de « Opus Logo To-dos.ai ») — DESIGN jaune, BRANDING orange, EVENT rouge.
 */
export type Pole = "design" | "branding" | "event";
export const services: { id: string; num: string; name: string; desc: string; items: string[]; cta: string; dark: boolean; pole: Pole }[] = [
  {
    id: "communication",
    num: "01",
    name: "COMMUNICATION & BRANDING",
    desc: "Nous préparons et prolongeons vos temps forts avec une communication cohérente, des supports de marque et des contenus adaptés à vos publics.",
    items: [
      "Identité visuelle et supports de marque",
      "Création graphique, photo et vidéo",
      "Communication digitale et réseaux sociaux",
      "Contenus avant, pendant et après l'événement",
      "Communication de lancement et d'activation",
    ],
    cta: "Discuter de votre projet",
    dark: false,
    pole: "branding",
  },
  {
    id: "evenementiel",
    num: "02",
    name: "ÉVÉNEMENTIEL",
    desc: "Nous concevons des événements et des activations de marque en reliant l'idée créative aux exigences de préparation et de terrain.",
    items: [
      "Conception du concept et du parcours public",
      "Préparation et coordination de production",
      "Déploiement et animation des activations BTL",
      "Contrôle des installations avant livraison",
      "Captation et communication selon le périmètre convenu",
    ],
    cta: "Organiser un événement",
    dark: true,
    pole: "event",
  },
  {
    id: "design-espace",
    num: "03",
    name: "DESIGN D'ESPACE",
    desc: "Nous donnons une forme concrète à votre marque avec des espaces, des stands et des supports pensés pour l'usage et l'expérience du public.",
    items: [
      "Scénographie événementielle",
      "Conception de stands et d'espaces de marque",
      "Supports et dispositifs d'activation",
      "Signalétique et habillage de marque",
      "Coordination et contrôle de réalisation",
    ],
    cta: "Imaginer votre espace",
    dark: false,
    pole: "design",
  },
];

/** Couleurs des pôles (tokens `--color-design|branding|event` de globals.css). */
export const poleStyles: Record<Pole, { label: string; bg: string; text: string }> = {
  design: { label: "Design", bg: "bg-design", text: "text-design" },
  branding: { label: "Branding", bg: "bg-branding", text: "text-branding" },
  event: { label: "Event", bg: "bg-event", text: "text-event" },
};
