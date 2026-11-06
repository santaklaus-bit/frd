import type { Pole } from "./services";

/**
 * Équipe OPUS CORP — Google Sheet « Contenus Site Web », onglet Preuves (EQU.01 à EQU.06, relevé du 15 oct. 2026).
 * Portraits EQU.02 à EQU.06 extraits du classeur (nommés selon LIV.REG.03, sources dans assets-source/opus-team/) ;
 * EQU.01 (Olufèmi) via WhatsApp du 28 sept. ; tous recadrés sur le visage (4:5). EQU.07 non renseigné → emplacement retiré.
 * Accords de diffusion (EQU.xx.04) : non documentés, à confirmer avant publication.
 */
export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  department: string;
  pole: Pole;
  image?: string;
  excerpt: string;
  quote: string;
  bio: string[];
  missions: string[];
  expertise: string[];
  projectSlugs: string[];
};

export const team: TeamMember[] = [
  {
    slug: "olufemi-bankole",
    name: "Olufèmi Bankole",
    role: "Président Directeur Général",
    department: "Direction & Stratégie",
    pole: "event",
    image: "/images/team/opus_equ_01_portrait_v01.jpg",
    excerpt:
      "À la tête d'OPUS CORP, Olufèmi Bankole définit la vision stratégique de l'agence et pilote l'accompagnement des grandes marques dans la création d'expériences BTL mémorables.",
    quote:
      "Chaque projet est une œuvre : notre exigence consiste à transformer l'intention d'une marque en une expérience concrète, vécue et retenue par son public.",
    bio: [
      "Fondateur et Président Directeur Général d'OPUS CORP à Cotonou, Olufèmi Bankole impulse une approche de la communication BTL où l'événementiel, le design d'espace et le branding fonctionnent comme un tout cohérent.",
      "Interlocuteur privilégié des directions générales et des directions marketing, il supervise le cadrage stratégique de chaque dispositif — du premier brief client jusqu'au bilan post-événement — en veillant à l'alignement entre objectifs d'image, maîtrise budgétaire et impact terrain.",
      "Sous sa direction, OPUS CORP accompagne des acteurs majeurs et des rendez-vous culturels d'envergure au Bénin, en réunissant une équipe pluridisciplinaire capable de concevoir et de délivrer des productions à haute valeur ajoutée.",
    ],
    missions: [
      "Direction générale, vision stratégique et développement d'OPUS CORP",
      "Conseil et accompagnement des marques et partenaires institutionnels",
      "Validation des concepts créatifs, des budgets et des engagements de livraison",
      "Supervision transversale des pôles Design, Branding et Event",
    ],
    expertise: [
      "Stratégie BTL",
      "Direction d'agence",
      "Conseil de marque",
      "Production exécutive",
      "Relations partenaires",
    ],
    projectSlugs: [
      "meet-and-greet-singuila",
      "lancement-canalbox-sofitel",
      "lancement-tout-canal-netflix",
      "effuzion-2026",
    ],
  },
  {
    slug: "rene-ahouissou",
    name: "René Ahouissou",
    role: "Chef de projet",
    department: "Opérations & Pilotage",
    pole: "event",
    image: "/images/team/opus_equ_02_portrait_v01.jpg",
    excerpt:
      "Point d'ancrage entre le client et les équipes d'exécution, René Ahouissou orchestre chaque étape des projets OPUS CORP avec méthode, réactivité et souci du détail.",
    quote:
      "Une expérience fluide pour le public repose toujours sur une préparation rigoureuse et une coordination sans faille en coulisses.",
    bio: [
      "En tant que Chef de projet chez OPUS CORP, René Ahouissou assure la traduction opérationnelle des briefs clients en plans d'action structurés. Il coordonne les plannings, les ressources et les livrables entre la création graphique, la scénographie et la production terrain.",
      "Garant du respect des délais et de la qualité d'exécution, il accompagne les clients tout au long du cycle de vie du projet : cadrage des besoins, suivi des jalons de validation, pilotage des prestataires et conduite des opérations le jour J.",
      "Sa maîtrise des réalités du terrain événementiel à Cotonou lui permet d'anticiper les contraintes techniques et d'assurer une livraison conforme aux attentes des marques accompagnées par l'agence.",
    ],
    missions: [
      "Analyse des briefs, élaboration des rétroplannings et suivi budgétaire",
      "Coordination quotidienne entre les pôles internes et les interlocuteurs clients",
      "Supervision des phases de préparation, de montage et d'exploitation événementielle",
      "Contrôle qualité des livrables avant ouverture au public et rédaction des bilans",
    ],
    expertise: [
      "Gestion de projet 360°",
      "Coordination événementielle",
      "Relation client",
      "Planification & RACI",
      "Suivi budgétaire",
    ],
    projectSlugs: [
      "meet-and-greet-singuila",
      "lancement-tout-canal-netflix",
      "lancement-canalbox-sofitel",
      "concert-jonathan-gambela",
    ],
  },
  {
    slug: "arsene-dohou",
    name: "Arsène Dohou",
    role: "Chargé des opérations et de la logistique",
    department: "Opérations & Terrain",
    pole: "event",
    image: "/images/team/opus_equ_03_portrait_v01.jpg",
    excerpt:
      "Spécialiste du déploiement terrain, Arsène Dohou veille à la faisabilité technique, à la logistique et à la fiabilité des installations sur chaque site d'événement.",
    quote:
      "Sur le terrain, chaque minute et chaque détail technique comptent : la logistique est le socle invisible qui permet à la scénographie de briller.",
    bio: [
      "Chargé des opérations et de la logistique au sein d'OPUS CORP, Arsène Dohou prend en main la concrétisation matérielle des événements, des activations BTL et des aménagements d'espaces de marque.",
      "Depuis le repérage technique des lieux jusqu'au démontage, il organise les flux d'approvisionnement, l'implantation des structures, la gestion des fournisseurs techniques (son, lumière, structures, impression) et la sécurité des dispositifs.",
      "Son intervention garantit que les concepts imaginés en studio prennent forme sur le terrain dans les temps impartis et avec un niveau de finition irréprochable.",
    ],
    missions: [
      "Repérages techniques des sites et préparation des plans d'implantation",
      "Gestion de la logistique, du transport et du matériel événementiel",
      "Encadrement des équipes de montage, d'installation et de démontage",
      "Vérification technique des structures, de la signalétique et des dispositifs de sécurité",
    ],
    expertise: [
      "Logistique événementielle",
      "Régie technique & terrain",
      "Montage & installation",
      "Gestion des prestataires",
      "Contrôle d'exécution",
    ],
    projectSlugs: [
      "lancement-canalbox-sofitel",
      "next-fintech-forum-2026",
      "effuzion-2026",
      "eat-drink-festival-cotonou",
    ],
  },
  {
    slug: "fidele-houenoukpo",
    name: "Fidèle Houenoukpo",
    role: "Designer graphique",
    department: "Design & Scénographie",
    pole: "design",
    image: "/images/team/opus_equ_04_portrait_v01.jpg",
    excerpt:
      "Créatif au regard aiguisé, Fidèle Houenoukpo conçoit les identités visuelles, les supports d'activation et l'habillage graphique des expériences signées OPUS CORP.",
    quote:
      "Le design donne son premier visage à l'expérience : il attire le regard, guide le public dans l'espace et ancre durablement la marque dans les esprits.",
    bio: [
      "Designer graphique chez OPUS CORP, Fidèle Houenoukpo façonne l'univers visuel des projets de l'agence, de la conception d'identités événementielles à la déclinaison des supports grand format sur site.",
      "Il intervient aussi bien sur le branding global (key visuals, chartes d'événements, déclinaisons digitales) que sur le design d'espace et la signalétique (photocalls, arches, kakemonos, habillage de stands et décors immersifs).",
      "En travaillant étroitement avec les équipes opérations et communication, il s'assure que chaque création graphique conserve toute sa force visuelle une fois imprimée, éclairée et installée sur le terrain.",
    ],
    missions: [
      "Création des concepts visuels, key visuals et identités graphiques d'événements",
      "Conception des supports de scénographie, stands, photocalls et signalétique BTL",
      "Déclinaison des visuels pour la communication digitale et les campagnes médias",
      "Préparation des fichiers d'exécution print et suivi de conformité chromatique",
    ],
    expertise: [
      "Direction artistique",
      "Identité visuelle & Branding",
      "Scénographie & Signalétique",
      "Design print grand format",
      "Visuels réseaux sociaux",
    ],
    projectSlugs: [
      "lancement-tout-canal-netflix",
      "meet-and-greet-singuila",
      "lancement-canalbox-sofitel",
      "eat-drink-festival-cotonou",
    ],
  },
  {
    slug: "olahimika-soumaila",
    name: "Olahimika Soumaila",
    role: "Chargé de communication",
    department: "Communication & Marketing",
    pole: "branding",
    image: "/images/team/opus_equ_05_portrait_v01.jpg",
    excerpt:
      "Stratège des contenus et de la prise de parole, Olahimika Soumaila fait rayonner les projets d'OPUS CORP et de ses clients avant, pendant et après chaque événement.",
    quote:
      "Un événement réussi commence bien avant l'ouverture des portes et se prolonge bien après : la communication transforme l'instant vécu en récit partagé.",
    bio: [
      "Chargé de communication au sein du pôle Communication & Marketing d'OPUS CORP, Olahimika Soumaila conçoit et déploie les stratégies éditoriales qui accompagnent les temps forts des marques.",
      "Il structure la prise de parole autour de chaque projet : teasing en amont, couverture live sur le terrain, valorisation des temps forts et bilan d'image post-événement.",
      "Attentif aux codes des audiences locales et digitales, il veille à ce que chaque activation et chaque réalisation d'OPUS CORP bénéficie d'une visibilité cohérente, engageante et fidèle à l'ADN du client.",
    ],
    missions: [
      "Élaboration des plans de communication avant, pendant et après l'événement",
      "Rédaction éditoriale, storytelling de marque et création de contenus",
      "Animation des plateformes digitales et couverture en temps réel des activations",
      "Coordination des captations photo/vidéo et valorisation des réalisations",
    ],
    expertise: [
      "Stratégie de contenu",
      "Communication événementielle",
      "Social Media & Live coverage",
      "Storytelling de marque",
      "Relations publics & médias",
    ],
    projectSlugs: [
      "meet-and-greet-singuila",
      "lancement-tout-canal-netflix",
      "effuzion-2026",
      "concert-jonathan-gambela",
    ],
  },
  {
    slug: "monreyike-saizonou",
    name: "Monreyikè Saïzonou",
    role: "Chargé de communication",
    department: "Communication & Marketing",
    pole: "branding",
    image: "/images/team/opus_equ_06_portrait_v01.jpg",
    excerpt:
      "Au cœur de la relation avec les publics et les communautés, Monreyikè Saïzonou amplifie l'impact des campagnes BTL et des expériences de marque signées OPUS CORP.",
    quote:
      "Rapprocher une marque de son public demande de l'écoute, du rythme et une vraie justesse dans chaque interaction.",
    bio: [
      "Chargée de communication chez OPUS CORP, Monreyikè Saïzonou accompagne la mise en visibilité des événements, des lancements de produits et des activations de terrain portés par l'agence.",
      "Elle participe à la conception des campagnes digitales, à l'animation des communautés en ligne et à l'accueil des publics et partenaires lors des temps forts événementiels.",
      "Son sens du collectif et son attention à l'expérience visiteur contribuent à créer un lien authentique et durable entre les marques clientes d'OPUS CORP et leurs audiences.",
    ],
    missions: [
      "Animation des communautés digitales et engagement des publics cibles",
      "Création et planification des publications sur les réseaux sociaux",
      "Accompagnement terrain sur les activations BTL, l'accueil VIP et les relations invités",
      "Suivi des retombées digitales et analyse de la réception par le public",
    ],
    expertise: [
      "Community Management",
      "Activation digitale & BTL",
      "Création de contenu",
      "Expérience & accueil public",
      "Veille & e-réputation",
    ],
    projectSlugs: [
      "meet-and-greet-singuila",
      "lancement-canalbox-sofitel",
      "eat-drink-festival-cotonou",
      "effuzion-2026",
    ],
  },
];

export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const getTeamMember = (slug: string) => team.find((m) => m.slug === slug);
