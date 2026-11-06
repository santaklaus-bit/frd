# SUIVI-PROGRESSION — Site OPUS CORP (ex-Wall Africa)

> **Statut au 25 oct. 2026 : site EN LIGNE sur https://opuscrp.com (Hostinger, export statique). Session 12 en ligne (photos réelles des événements).**
> Fichier de suivi continu. Permet de reprendre le travail à tout moment dans une nouvelle session.
> **Depuis le 15 sept. 2026, le site est celui d'OPUS CORP** (voir §12). Les sections 0–11 documentent la phase Wall Africa (structure, animations, décisions) et restent valables pour la mécanique du site.
> Référence design : https://eventry.framer.website/ (template Framer "Eventry")
> Dossier d'inspiration : `/home/challa-sylvio/Templates-sites/Wall-africa-inspi`

---

## 0. Contexte

- **Client** : Wall Africa — entreprise béninoise d'organisation d'événements
- **Objectif** : copie fidèle (structure, layout, typo, espacements, animations, responsive) du template Eventry, adaptée à Wall Africa
- **Contenu** : textes/identité Wall Africa ; visuels & infos événements = Weloveya / Afronation (simulation)
- **Assets fournis** (à la racine du projet, 4 images, PAS de vidéo) :
  - `Afronation.jpg` (102 Ko)
  - `Tidal rave in Ghana.jpg` (113 Ko)
  - `Wizkid at WeLoveYa Festival '25 🇧🇯🖤🦅.jpg` (62 Ko)
  - `téléchargement.jpg` (120 Ko)
- **Environnement** : localhost pour dev/tests, structure compatible Vercel/Netlify

---

## 1. Journal des étapes

### 2026-09-12 — Session 1

- **19:0x** — Initialisation : création de `SUIVI-PROGRESSION.md`.
- **19:0x** — Inventaire dossier inspi : `mirror/` (HTTrack, 8 pages + 10 events + 7 blog) et `capture/` (desktop-full.png, mobile.png, rendered.html, requests.json, site-session.webm). Les dossiers `runtime/`, `snapshot/`, `analysis/` cités dans le README sont ABSENTS.
- **19:0x** — Skills/MCP disponibles listés (voir §2).
- **19:2x** — Analyse complète du template (screenshots découpés, DOM `rendered.html` : tokens couleurs, presets typo, animations Framer appear, vidéo de session). Documenté en §3.
- **19:2x** — Technos de référence reçues de l'utilisateur (capture Wappalyzer).
- **19:5x** — Plan validé par l'utilisateur (voir §5.0). Début du BUILD.
- **20:0x** — Scaffold Next.js 16.3 + TS + Tailwind v4 + motion 13 + lenis 1.3 (install OK). Images sources déplacées dans `assets-source/`, copies propres dans `public/images/events/`.
- **20:1x** — Assets : vidéo hero libre de droits Mixkit #14088 (12 s, 1280p, 2,5 Mo, poster) + fond section aide Mixkit #14087 ; portraits placeholders pravatar (7 équipe + 8 avatars) ; 2 images événements + 2 blog extraites de vidéos Mixkit. Crédits dans `public/images/CREDITS.md`.
- **20:2x** — Socle : `globals.css` (tokens, breakpoints 810/1200, presets typo), `layout.tsx` (fonts Google via next/font, Lenis), `lib/motion.ts` (presets Framer extraits), data (site, events, testimonials, team, faq, pricing, articles).
- **20:3x** — Page d'accueil complète : 12 sections + Navbar + Footer. Type-check OK, dev server OK (0 erreur console).
- **20:4x** — Vérification Playwright (chromium headless local) : captures 1440 / 1024 / 768 / 375 full-page. Rendu conforme au template. Corrections : marqueurs [SIMULÉ] retirés de l'UI (conservés en commentaires), prix hero nowrap, fond section aide, cadrage portraits, grille support mobile.
- **20:5x** — Pages secondaires : `/evenements` (filtres animés), `/evenements/[slug]` (SSG ×6), `/a-propos` (stats compteurs, bloc sombre, équipe, newsletter, FAQ), `/reserver`, `/blog` + `/blog/[slug]` (SSG ×2), `/mentions-legales`, `not-found`. `PageHero` avec H1 lettre-par-lettre (mots insécables). `npm run build` OK (16 pages statiques).
- **21:0x** — Comparaison pixel côte à côte original/copie → ajustements : titres de section 64→80px (mesure sur capture ref), couleurs des sections FAQ/Aide alignées sur échantillonnage pixel de la ref (FAQ : fond page + carte menthe ; Aide : fond menthe + carte page), utilitaire `h-section-sm` (64px) pour Aide/Newsletter/Footer.
- **21:1x** — Tests d'interaction Playwright : compteur hero 0→50 %, accordéon équipe (largeurs 124/571 px vs 126/580 ref), FAQ, carrousel, Lenis actif, menu mobile. 0 erreur console. Captures finales + comparatifs dans `docs/captures/`. README rédigé. Build final OK. Serveur dev arrêté.
- **19:4x** — Recherche Wall Africa : site officiel hors ligne, données récupérées via Wayback (2025-03-15). Documenté §4. Plan rédigé §5, soumis à validation.

---

### 2026-09-12 — Session 2 (retours utilisateur)

- **21:0x** — Retour : Wall Africa n'a pas de tarifs type billetterie → section **"Simple pricing" supprimée**, remplacée par **"Nos services"** (`src/components/sections/Services.tsx`, `src/data/services.ts`) : 3 cartes (Communication & branding / Événementiel (sombre) / Design d'espace), numéro 01-03 à la place du prix, listes des prestations réelles (site Wall Africa). `Pricing.tsx` et `pricing.ts` supprimés.
- **21:0x** — Retour : vrais logos partenaires → `src/data/partners.ts` + `public/images/partners/` : MTN, Canal+, ENGIE, SUNU Assurances, GBfoods, BCG (SVG/PNG Wikimedia Commons). Affichés en gris (comme le template), couleur au survol. **Le Black Cotonou et Soaga** : logos introuvables en ligne → retirés de la grille. **GBfoods / BCG** : correspondance déduite des noms de fichiers du site Wall Africa ("GB FOOD", "BCG LOGO") → à confirmer.
- **21:1x** — Build prod OK. Serveur `next start` + tunnel Cloudflare (`cloudflared tunnel --url`, binaire installé dans `~/.local/bin`). URL publique : voir §11.

### 2026-09-12 — Session 3 (retours utilisateur)

- **21:3x** — Tunnel Cloudflare et serveur `next start` arrêtés (l'URL trycloudflare n'est plus valide).
- **21:3x** — **Suppression de toute notion d'achat de billets** (site = portfolio) : hero (plus de prix ni de bouton ticket → colonne "Production : Wall Africa" + bouton "Voir l'événement · 50 000+ festivaliers"), détail événement (`price` → `audience`, bouton "Un projet similaire ?"), formulaire ("Confiez-nous votre projet", select "Type de projet"), textes FAQ/footer/services, `TicketIcon` supprimé.
- **21:4x** — **Nouvelle identité visuelle** validée par l'utilisateur : **noir + doré** (charte wallafrica.com, `#ecbc3a`). Tokens remappés dans `globals.css` (bg `#0b0b0b`, cartes `#151515`/`#1f1f1f`, blocs dorés = ex-blocs vert foncé, texte blanc). Blocs dorés en **texte noir** (FeaturedEvent, carte centrale Services, bloc À propos) ; navbar sombre translucide ; logos partenaires passés en blanc (Canal+ brut, SUNU détouré) ; footer noir avec cellule dorée et wordmark doré 15 %.
- **21:4x** — **Nouvelles polices** (choix libre demandé, "stylé, event, fun") : **Unbounded** 700 (H1, titres de section, gros titres, logo), **Bricolage Grotesque** (titres de cartes, citations, leads), **Space Grotesk** (texte courant, nav, boutons, méta). Tailles display réduites (Unbounded est large) : H1 108/76/40, sections 64/46/30.
- **20:5x** — Fix : bouton CTA du hero coupé à droite entre 1200 et 1300 px (colonnes d'infos en largeur fixe 345 px) → colonnes `flex-1`, CTA `shrink-0`, gap réduit. Vérifié à 1024/1200/1280/1440.
- **20:5x** — Tunnel Cloudflare relancé (sur le serveur dev) : https://womens-sleeps-borders-signals.trycloudflare.com
- **21:5x** — Incident : l'ancien `next start` (pid orphelin) tenait encore le port 3000 et servait l'ancienne version → tué, `.next` nettoyé, `next dev` relancé sur 3000. Vérification captures 1440 + 375 + page détail : contrastes OK.

### 2026-09-12 — Session 4 (mobile)

- **21:0x** — Retour utilisateur : mobile trop « cases qui défilent ». Passe mobile dédiée (desktop inchangé), inspirée des composants **React Bits** (le MCP React Bits n'est pas connecté dans cette session — vérifié `claude mcp list`) :
  - `EventsTicker` : bandeau doré défilant sous le hero, vitesse/sens réagissant au scroll (React Bits *Scroll Velocity*) — tous écrans.
  - `CardStack` (*Stack*) : « Nos événements » en pile de cartes à swiper + compteur 01/05 + bouton.
  - `RollingGallery` (*Rolling Gallery*) : « Événements récents » en galerie 3D cylindrique, rotation auto + glisser.
  - `Marquee` : logos partenaires en défilement infini.
  - Événement phare : image plein écran + carte dorée chevauchante.
  - Services : accordéon numéroté 01-03 (tap pour ouvrir, carte dorée).
  - Témoignages : glissables au doigt (drag), flèches masquées sur mobile.
  - Articles : `SnapRow` (glisser + barre de progression 01/02).
  - Numérotation éditoriale `(03)…(09)` au-dessus des titres (mobile) ; `MobileCta` : pill dorée flottante « Réserver un événement » après le hero.
- **21:1x** — `npx shadcn@latest mcp init --client claude` exécuté à la demande de l'utilisateur → `.mcp.json` (serveur shadcn) + dépendance `shadcn` ajoutée au package.json. Disponible à la prochaine session.
- **21:1x** — Logo SUNU détouré correctement (alpha OK). Galerie 3D recalibrée (perspective 1600, faces 56 % de la largeur).
- Tunnel actif : https://womens-sleeps-borders-signals.trycloudflare.com

### 2026-09-12 — Session 5 (desktop créatif, patterns React Bits)

- **21:2x** — MCP React Bits toujours absent de la session (ToolSearch) → patterns réimplémentés en composants maison (`src/components/ui/`) :
  - `CustomCursor` (*Blob Cursor*) : point doré + anneau à ressort, s'agrandit sur liens/boutons ; activé seulement si `pointer: fine` (classe `has-cursor` masque le curseur natif).
  - `Magnet` : boutons magnétiques (CTA navbar, CTA hero).
  - `SplitText` : tous les titres de section (`SectionHeading`) se révèlent lettre par lettre au scroll (rotation X + montée).
  - `SpotlightCard` : halo doré + bordure lumineuse suivant la souris (cartes Services, Témoignages, carte Réserver).
  - `TiltCard` : inclinaison 3D (image de l'événement phare, cartes événements) ; overlay « Voir l'événement » glisse vers le haut ; badge catégorie sur les cartes.
  - `GoldParticles` : poussière dorée en canvas dans le hero (desktop), repoussée par la souris ; désactivée si `prefers-reduced-motion`.
  - Logo Loop : partenaires desktop en 2 rangées défilant en sens opposés (cartes avec bordure dorée au survol) — remplace la grille statique.
  - Navbar : pill de survol glissante (`layoutId`, *Pill Nav*).
  - `FooterWordmark` : wordmark géant en parallaxe à l'arrivée + balayage brillant (*Shiny Text*, classe `.shiny-text`).
  - `ScrollProgress` : barre de lecture dorée en haut ; grain subtil (`.grain`) sur les blocs dorés ; halo doré sur la carte équipe active.
- **21:3x** — Logo SUNU renommé `sunu-assurances.png` (le cache de l'optimiseur d'images Next servait l'ancienne version non détourée).
- Vérifications Playwright : survols (curseur, tilt, spotlight, pill nav) sans erreur console ; capture desktop complète OK.

### 2026-09-12 — Session 6 (GitHub)

- **21:4x** — Tunnel Cloudflare + serveur local fermés (port 3000 libre).
- **21:4x** — Dossier transformé en dépôt git indépendant (branche `main`, 121 fichiers, `node_modules`/`.next` ignorés) et poussé sur GitHub : **https://github.com/sx1vio/wall-africa** (privé). Le dossier parent `Projets-perso` reste un autre dépôt (Bailo-saas) : `Wall-africa/` y apparaît comme dépôt imbriqué non suivi.

### 2026-09-15 — Session 7 (migration OPUS CORP)

- Demande : le site n'est plus pour Wall Africa mais pour **OPUS CORP** ; classeur `Contenus Site Web.xlsx` fourni (6 onglets, 478 champs : 278 « À compléter », 200 « À valider »). Consigne LIV.REG.01 : conserver architecture, sections, animations, couleurs ; remplacer les informations.
- Recherche en ligne : nom très générique (Opus Group immobilier, Opus Agency US…). Sources exploitables : bio TikTok `@opuscorp_` (« Chaque projet, une œuvre — Événementiel • Design • Branding — Cotonou, Bénin », 94 abonnés), Instagram `@opuscorp__` (inaccessible sans connexion), résumé IA fourni par l'utilisateur (posts relayés par Bénin Bouge) : téléphone/WhatsApp +229 01 61 18 67 58, prestations d'impression (photocalls, kakemonos, billets/tickets, habillage de stands), partenariat « Sang Donné, Vies Sauvées » (juil. 2026), stand Rose Garden.
- Intégration de toutes les propositions « À valider » du classeur (hero, manifeste, services, FAQ, CTA, formulaire, À propos, newsletter, footer, SEO, 2 articles complets avec corps). Champs « À compléter » traités comme emplacements provisoires explicites (voir §12).
- Retraits : photos WeLoveYa/Wizkid/Afro Nation/Tidal Rave (gardées dans `assets-source/`), logos MTN/Canal+/ENGIE/SUNU/GBfoods/BCG, témoignages Wall Africa, noms d'équipe fictifs, tous chiffres non justifiés (50 000+, 200+, 100+, 5+ ans, 30+).
- Code : `site.ts` avec champs de contact `null` + `TO_CONFIRM` rendu conditionnellement (Footer, HelpForm, BookFaq, Réserver, Mentions) ; `events.ts` enrichi (`role`, `hours`, `lineupLabel` « Dispositif », `status`) ; `articles.ts` avec `intro`/`body` rendus par `/blog/[slug]` ; visuels renommés `opus_<rubrique>_<id>_<usage>_v01` (LIV.REG.03) ; package renommé `opus-corp`.
- Vérifications : `tsc` OK, `next build` OK (16 pages), Playwright 7 pages × 1440/375 : 0 erreur console, 0 occurrence Wall Africa/WeLoveYa/Wizkid. Fix : CTA hero qui débordait sur mobile (texte public plus long → retour à la ligne autorisé < 810 px). Captures dans `docs/captures/opus-corp-*.jpg`.
- **Commit `77935d5` poussé sur `main`** (72 fichiers). Le classeur `Contenus Site Web.xlsx` est versionné à la racine. Session close, validée par l'utilisateur.
- Points en attente de décision OPUS : (1) affichage TikTok (GLO.CON.08) ; (2) validation des fiches Sang Donné / Rose Garden (source indirecte) ; (3) livraison des fichiers du Mac — logo PNG/AI, vidéos « Opus event » (LIV.MED.01–05) ; (4) renommage éventuel du dépôt GitHub `wall-africa` → `opus-corp`.

### 2026-09-22 — Session 8 (logo officiel, note de structuration, équipe)

- Reçu : `Opus Logo.pdf` (LIV.MED.01, vectoriel), un export aplati du même logo (`WhatsApp Image … 14.48.04.jpeg`) et deux animations de révélation du logo, portrait et paysage, fond blanc/encre marine, 10,5 s avec son (`WhatsApp Video … 14.46.29.mp4` / `…14.46.38.mp4`) ; note « Organisation et métiers OPUS CORP » (organigramme, fiches de poste, RACI) et note « Projet de structuration OPUS CORP » (identité, mission/vision, plaquette, plan T4 2026–2027).
- Logo : extraction vectorielle (PyMuPDF, pas de LibreOffice/`pdftoppm` disponibles dans l'environnement) → `public/images/brand/opus_glo_nav_01_logo_v01.png` (encre marine d'origine), `…_logo_blanc_v01.png` (recoloré blanc, alpha préservé) intégré dans `Logo.tsx` à la place du wordmark texte ; `…_icone_v01.png` (motif « O » isolé sur fond doré `#ecbc3a`) décliné en `src/app/icon.png` (512) et `apple-icon.png` (180) — aucun favicon n'existait avant (vérifié via la doc `01-metadata/app-icons.md`, convention inchangée en Next 16).
- Vidéos logo : **non utilisées** en fond de hero — fond blanc et encre quasi noire contrastent mal avec l'identité noir & or (`ACC.HER.03` attend toujours un vrai plan tourné, LIV.MED.04). Fichiers sources archivés dans `assets-source/opus-brand/` avec le PDF et le JPEG, décision documentée dans `public/images/CREDITS.md`.
- Équipe (`src/data/team.ts`, GLO.EQU) : les 7 emplacements passent de fonctions génériques (« Direction générale », « Communication »…) aux intitulés réels des fiches de poste de la note de structuration (Manager général, Manager Communication et Marketing, Chef de projet et responsable Opérations…), 10 fiches condensées sur 7 emplacements faute de place. Toujours aucune personne nommée (consigne GLO.EQU.02 réitérée dans la note).
- Relu intégralement `Contenus Site Web.xlsx` (openpyxl, `markitdown` absent du PATH) pour la liste exacte des champs « À compléter » : la quasi-totalité (contact, adresse, RCCM/IFU, hébergeur, texte données personnelles, chiffres À propos) reste sans source fiable → non complétée, conformément à la consigne LIV.REG.07 de ne rien inventer. Le texte institutionnel, la mission/promesse et le fil « Notre méthode » de la note de structuration étaient déjà repris quasi mot pour mot dans `site.ts`/FAQ depuis la session 7 : pas de changement nécessaire là-dessus.
- Vérifications : `tsc --noEmit` OK, `next build` OK (19 pages, `/icon.png` + `/apple-icon.png` générés), Playwright (page d'accueil, À propos desktop/mobile) 0 erreur console, favicon confirmé dans le `<head>` servi.
- Points en attente inchangés (voir session 7) + nouveau : logo PNG/AI final et vidéos événement réel (LIV.MED.02–05) toujours à livrer ; décision à prendre sur un usage futur des deux vidéos de révélation (réseaux sociaux, écran de lancement dédié) si souhaité.
- Serveur dev lancé pour relecture (`localhost:3000`), puis arrêté en fin de session.
- Demande utilisateur : remplacer la vidéo du hero par une vidéo OPUS CORP qu'il a enregistrée lui-même — **fichier pas encore déposé dans le repo**, à faire dès réception (racine du projet, comme les précédents assets).
- Checklist complète envoyée à l'utilisateur pour lever les « à compléter » restants : partenaires (nom + logo + autorisation, 6 emplacements), équipe (nom + poste + photo, 7 emplacements — nombre à confirmer), événements (combien de projets réels à montrer, texte + photos + autorisation par projet, 6 emplacements actuels dont 2 réels/4 exemples), témoignages clients (6 emplacements), coordonnées/légal (e-mail, adresse, RCCM/IFU, responsable de publication, hébergeur), vidéo hero réelle, chiffres justifiés éventuels, décision sur les 2 articles de blog génériques. Réponse en attente.

## 2. Skills / MCP disponibles et utilisés

| Skill / MCP | Utilisation prévue |
|---|---|
| `motionsites` (MCP) | Recherche de prompts de design/motion pour sections (hero, marquee, cards) |
| `animate` | Décisions de motion (durées, courbes, interruptions) pour chaque animation reproduite |
| `emil-design-eng` | Polish UI, détails d'interaction |
| `ui-ux-pro-max` | Presets GSAP, typographie, responsive |
| `ui-styling` | Tailwind + shadcn patterns |
| `improve-animations` / `review-animations` | Audit final des animations |
| `watch` | Analyse de `capture/site-session.webm` (animations au scroll) |
| `run` | Lancement serveur local + captures |

### 2026-09-25 — Session 9 (charte graphique « Opus Logo To-dos.ai »)

- **Source** : `Opus Logo To-dos.ai` (Illustrator 28.1, 8 plans 1000×1000 pt) lu avec PyMuPDF — rendus, couleurs et polices relevés sur les objets vectoriels.
- **Palette réelle** (aplats) : marine `#192137`, jaune `#F8B133` (DESIGN), orange `#ED6A3D` (BRANDING), rouge `#E5332A` (EVENT), gris `#D8D8D8`. ⚠️ Les libellés de la planche Colors (`#280259`, `#9845F5`, `#029837`) ne correspondent pas aux pastilles → **ignorés**, à corriger dans le fichier source. Plan 5 vide.
- **Polices** : Poppins (titres SemiBold, libellés Light très espacés façon « C O R P ») + DM Sans (texte). Harabara (titre « Colors ») non diffusable en webfont → remplacée par Poppins.
- **Identité appliquée** : tokens `globals.css` (fond marine, accent orange, `--color-black` = marine, blocs signature en dégradé jaune → orange, utilitaires `t-eyebrow`, `bg-opus-gradient`, `text-opus-gradient`) ; titres en casse phrase.
- **Logo vectoriel** : `src/components/ui/OpusLogo.tsx` (tracés extraits du plan 2, `currentColor`, variantes `full` / `mark`) + `OpusMountain` (silhouette du plan 4). Navbar, hero (logo géant + DESIGN / BRANDING / EVENT), cartes Services coiffées de la déclinaison de leur pôle (plans 6–8), pied de page = planche « Colors » (dégradé + montagne + logo blanc), pastilles de la charte près du copyright.
- Particules du hero aux 3 couleurs des pôles (`BrandParticles`, remplace `GoldParticles`) ; halo, curseur, barre de progression recolorés ; favicon + apple-icon régénérés (« O » blanc + point orange sur marine).
- Vérifications : `tsc` OK, `next build` OK (18 pages), captures Playwright 1440 / 390, 0 erreur console.
- Retour « trop chargé » : hero allégé — logo réduit (430 px), texte d'intro en poids normal, les 3 colonnes en capitales remplacées par une ligne « Projet à la une » (titre + lieu · date · intervention), bouton pilule « Voir le projet », particules supprimées (`BrandParticles` retiré).
- Tunnel Cloudflare **fermé** le 25 sept. (demande utilisateur : on passe au déploiement Hostinger). Serveurs locaux arrêtés.
- **.ai décodé en profondeur** (données natives Illustrator, zstd + ASCII85) : aucun contenu de page ; seul texte caché = « LOGISTIQUE » (orphelin). Décision utilisateur : **3 pôles seulement**. Les pages sont décrites par le classeur (déjà en place).
- **Google Sheet « Contenus Site Web »** (https://docs.google.com/spreadsheets/d/1lRCxOI9-QbGi5oPORJdeR3Xy3I9tuDjf-Ke7J0tFH0M, version à jour du xlsx local) : 72 champs remplis intégrés —
  coordonnées (contact@opuscrp.com, +229 01 99 89 18 18, Missité Sikè, Facebook), RCCM `RB/COT/25 B 41042` / IFU `3202522640514`, **6 vrais projets** (EFFUZION 2026 en vedette, Concert Jonathan Gambela, Canal+ After work, Eat & Drink Festival, ADJ'K Fashion After Work, Open App Day Canal+), **6 membres d'équipe** dont 4 portraits (extraits du classeur → `public/images/team/opus_equ_0X_portrait_v01.jpg`), partenaire Canal+ (client).
  Corrections : téléphone « +299 » → +229 ; lien WhatsApp aligné sur le numéro à 10 chiffres.
- **Retiré** (contenu non OPUS / factice) : section Confiance (logos « Partenaire 01… »), section Avis (citations Wall Africa), Newsletter (aucun service), avatars pravatar, colonne « Pages internes » du footer (→ colonne Contact), PNG du logo (→ vecteur), Marquee.
- **Ajouté** : `POST /api/contact` (Resend via fetch, pot de miel, états LIV.TEC.02–04 ; sans clé → e-mail pré-rempli), lien WhatsApp ; compteurs réels (6 projets, 26 500+ personnes = somme des publics EVT) ; mentions légales complètes (RCCM/IFU, Vercel, texte données perso) ; `opengraph-image.png` + `twitter-image.png` 1200×630 (planche Colors) ; `sitemap.xml`, `robots.txt` ; `src/lib/site-url.ts`.
- **Hébergement : Hostinger** (décision utilisateur, « oublie Vercel »). Domaine opuscrp.com payé chez Hostinger ; DNS = e-mail Hostinger en place (MX, SPF, DKIM, DMARC) ; A @ → 2.57.91.91 ne répond pas en HTTP le 25 sept. → **aucun hébergement web encore rattaché**.
  Passage en **export statique** (`output: "export"`, `trailingSlash`, images non optimisées) ; `/api/contact` supprimé → `public/contact.php` (mail() PHP, expéditeur contact@opuscrp.com) ; `public/.htaccess` (HTTPS, www → apex, 404, cache) ; mentions légales → Hostinger International Ltd. ; `siteUrl` par défaut https://opuscrp.com.
  Archive prête : `opus-site-hostinger.zip` (contenu de `out/`, 6 Mo, ignorée par git). Aperçu tunnel = `python3 -m http.server 3000 -d out`. `contact.php` non testé localement (pas de PHP) → à tester en ligne.
- **🚀 EN LIGNE — https://opuscrp.com (25 sept. 2026)** : hébergement web Hostinger rattaché ; export `out/` (159 fichiers) téléversé en FTPS dans `domains/opuscrp.com/public_html` (page d'attente `default.php` supprimée), tailles vérifiées.
  Vérifié en ligne : HTTPS actif, http → https et www → apex (301), `/a-propos` → `/a-propos/`, 404 personnalisée, sitemap, image OG, `contact.php` exécuté (400 invalide / 405 GET / pot de miel OK). **Reste : un vrai envoi de test du formulaire** (réception sur contact@opuscrp.com).
  Redéployer : `npm run build` puis téléverser le contenu de `out/` dans `domains/opuscrp.com/public_html` (FTP 92.113.28.227:21, utilisateur u836329975 — mot de passe à changer après la mise en ligne, jamais stocké dans le dépôt).
- **Retour client (25 sept.)** : titre de l'onglet d'accueil = « OPUS CORP » seul (pages internes : « Page — OPUS CORP ») ; description SEO conservée pour Google/partages. Redéployé et vérifié en ligne.
- **Formulaire — fonctionnement** : `contact.php` envoie un e-mail texte brut, **de** contact@opuscrp.com **à** contact@opuscrp.com, objet « Nouvelle demande de projet — {Nom} », corps = Nom / E-mail / Téléphone / Type de projet ; **Répondre-à = e-mail du visiteur** (un clic sur « Répondre » lui écrit). Destinataire modifiable en tête de `public/contact.php` (`CONTACT_TO`).
- **Contenus restant à fournir** : photos des 6 projets, dates EVT.04/06, portrait EQU.02 (René Ahouissou ; EQU.01 reçu le 28 sept.), accords de diffusion, LinkedIn, validation juridique (responsable de publication), vidéo hero OPUS.
- **Clôture session 9** : commit `42ed0ec` poussé sur `main` ; tunnel Cloudflare et serveurs locaux arrêtés ; identifiants FTP effacés de la machine. À faire côté client : envoi de test du formulaire (réception sur contact@opuscrp.com), changement du mot de passe FTP, contenus restants ci-dessus.
- **Session 10 (3 oct. 2026) — portraits d'équipe** :
  - **EQU.01 Olufèmi Bankole (CEO)** : portrait reçu par WhatsApp (28 sept.), source archivée dans `assets-source/opus-team/EQU01-olufemi-bankole-whatsapp-2026-09-28.jpeg` (864×1080, couleur) → `public/images/team/opus_equ_01_portrait_v01.jpg`, branché dans `src/data/team.ts` (le monogramme « OB » disparaît). Passage en niveaux de gris par la classe `grayscale` du composant `Team`, comme les autres.
  - **Recadrage « zoom visage » sur tous les portraits** (demande : même effet que le modèle de Monreyikè, qu'on voie bien la personne, en bande fine comme en carte ouverte). Les photos EQU.01, 03, 04, 05 sont **recadrées en dur au format 4:5**, visage centré horizontalement, sommet de la tête à ~8–10 % du haut, visage ≈ 30 % de la largeur ; le composant garde `object-cover object-top`. Recadrages (px, image d'origine) : EQU.01 `(192,38)–(692,663)`, EQU.03 `(42,15)–(412,478)`, EQU.04 `(257,93)–(727,681)`, EQU.05 `(166,40)–(866,915)`. **EQU.06 (Monreyikè) non modifiée** (référence). Points de vigilance : le visage d'Olufèmi (tête inclinée) s'est avéré décentré → centre du visage ≈ x 440 sur l'original ; le visage d'Olahimika déborde légèrement de la bande (normal, comme le modèle) ; EQU.03 (490×528) est peu définie et devient floue si on zoome davantage.
  - **Mise en ligne** : `npm run build`, puis FTPS (curl) de tout `out/` (160 fichiers, 0 échec) puis des 4 portraits retouchés ; vérifié en ligne (HTTP 200, page d'accueil référence `opus_equ_01…`). Commits `94449d5` et `b08d649` poussés sur `main`. `opus-site-hostinger.zip` régénéré.
  - ⚠️ **Mot de passe FTP** : contrairement à la note précédente, il n'a **pas** été changé ; il a été donné dans la conversation (jamais écrit dans un fichier ni un commit). À changer dans hPanel → Fichiers → Comptes FTP si on veut le garder confidentiel.
  - Reste côté contenus : portrait **EQU.02 (René Ahouissou)** toujours en monogramme « RA ».
- **Session 11 (15 oct. 2026) — mise à jour depuis le Google Sheet** :
  - Comparaison du Sheet (export xlsx) avec le classeur local et le code : tous les textes déjà intégrés, **seules les fonctions d'équipe ont changé** → EQU.01 « Président Directeur Général » (ex-CEO, aussi dans les mentions légales), EQU.02 « Chef de projet » (Sheet : « Chef projet »), EQU.05/06 « Chargé de communication » (ex-Community manager).
  - **Portraits** (onglet Preuves, 5 images) : nouveaux EQU.02 René (le monogramme disparaît), EQU.03 Arsène (nouvelle photo studio), EQU.04 Fidèle (version HD) ; EQU.05/06 inchangés. Sources dans `assets-source/opus-team/*-sheet-2026-10-15.*`, recadrés 4:5 (cadrage aligné sur EQU.05) : EQU.02 `(55,0)–(1005,1188)`, EQU.03 `(165,56)–(865,931)`, EQU.04 `(160,72)–(1020,1147)`.
  - `tsc` + `next build` OK, captures Playwright 1440/390 de la section Équipe, 0 erreur console ; `out/` téléversé en FTPS.

- **Session 12 (25 oct. 2026) — photos réelles des événements OPUS CORP** :
  - Intégration des visuels réels pour les 3 projets phares demandés :
    1. **Meet & Greet Singuila (20 ans de carrière)** : 5 photos réelles haute qualité (artiste, équipe OPUS Le Black, tapis rouge, branding, VIP lounge), événement placé en vedette (`featured: true`).
    2. **Lancement Produit « Tout Canal & Netflix »** : 3 photos réelles (scénographie néon immersive, after-work presse, table présentation).
    3. **Lancement CANALBOX Sofitel** : 3 photos réelles (allée d'oriflammes roses esplanade Sofitel Cotonou, photocalls VIP, scène conférence colonnes 3D).
  - Ajout du support de galerie photo (`gallery?: string[]`) dans [`EventItem`](file:///Users/aureldsk/wall-africa/src/data/events.ts) et affichage d'une grille interactive "Galerie photos du projet" sur la page de détail [`/evenements/[slug]`](file:///Users/aureldsk/wall-africa/src/app/evenements/[slug]/page.tsx).
  - Mise à jour de [`public/images/CREDITS.md`](file:///Users/aureldsk/wall-africa/public/images/CREDITS.md) (statut des 11 visuels passé en DÉFINITIF).
  - Build de production statique (`out/`, 22 pages générées) validé sans aucune erreur.
  - **Mise en ligne (25 oct.)** : `git pull` du commit `637cd20`, `npm run build`, puis FTPS (curl) de tout `out/` (172 fichiers, 0 échec). Vérifié en ligne : HTTP 200 sur `/`, `/evenements/` et les 3 pages détail (`meet-and-greet-singuila`, `lancement-tout-canal-netflix`, `lancement-canalbox-sofitel`) ainsi que sur les nouvelles photos `/images/events/*`.
  - Note FTPS : le certificat du serveur est émis pour `*.hstgr.io` (pas pour l'IP ni `ftp.opuscrp.com`) → `curl` sans `-k` échoue (erreur 60). Le mot de passe FTP n'est toujours pas changé.

- **Session 13 (5 nov. 2026) — CTA « Contactez-nous », pages Équipe et enrichissement événements** :
  - **Bouton d'action principal** : passage de « Réserver un événement » à « Contactez-nous » (`site.ts`, `Navbar`, `MobileCta`, `BookFaq`, `Footer`, `reserver/page.tsx`).
  - **Pages de présentation des membres de l'équipe** :
    - Fiches détaillées dans `src/app/equipe/[slug]/page.tsx` et page d'ensemble `src/app/equipe/page.tsx`.
    - Données enrichies dans `src/data/team.ts` (bios, citations, missions, expertises, projets associés pour les 6 membres).
    - Liens d'accès depuis l'accordéon d'accueil `Team.tsx`, la navbar, le footer et le sitemap.
  - **Événements enrichis** :
    - Ajout de fiches projets : Next Fintech Forum 2026 et Canal+ After work.
    - Galeries photos enrichies sur chaque fiche d'événement avec de nouveaux visuels dans `public/images/events/`.
  - Build statique testé et validé (`npm run build`).

---

## 3. Analyse du site de référence (Eventry — Framer template)

### 3.1 Technos détectées (confirmées par l'utilisateur, Wappalyzer)
React · Framer Sites · **Framer Motion** · **Lenis 1.1.9** (smooth scroll) · Google Fonts · Open Graph · HTTP/3 · Priority Hints

### 3.2 Palette (tokens Framer → valeurs)
| Rôle | Hex |
|---|---|
| Fond page (off-white) | `#f2f3f3` |
| Fond section teinté (menthe très claire) | `#e6f2f1` |
| Fond cartes/menthe | `#d8e4e3` |
| Vert foncé (sections sombres, footer, pricing VIP) | `#30403e` |
| Vert brand (boutons) | `#038262` |
| Vert vif (ticket CTA, chiffre footer) | `#42c96f` |
| Vert clair (boutons pricing, nom speaker) | `#9acf8b` |
| Texte principal | `#000` / blanc `#fff` |
| Texte secondaire | `#484e4e` |
| Texte tertiaire | `#52615f` · gris `#7b7b7b` |
| Bordures | `#ced1ce` · `#e2e8f0` |

### 3.3 Typographie (Google Fonts)
- **Hanken Grotesk** (600/700, letter-spacing -0.04em) → H1 hero, titres de sections, cartes événements, corps hero
- **Inter** (700, ls -0.05em, uppercase) → H2 "Future Leaders Global Event", gros titres
- **Geist Mono** (400/600, ls -0.04em) → nav, boutons, dates/lieux, paragraphes descriptifs, citations, footer
- **Bricolage Grotesque** (500) → "View Event" overlay (64px)

Échelle (desktop / tablette 810-1199 / mobile ≤809) :
| Élément | Desktop | Tablette | Mobile |
|---|---|---|---|
| H1 hero "EVENTRY" | 140px / 600 / lh 100% / uppercase | 96px | 50px |
| H2 dark section (Inter 700 uppercase) | 80px | 56px | 34px |
| H2 sections ("OUR MAIN EVENT") | ~64px Hanken 700 uppercase (2 tons : vert foncé + noir) | 48 | 34 |
| H3 carte événement | 40px / 700 / lh 110% / uppercase | 32 / 26 | 26 |
| H4 texte dark section | 30px / 600 / lh 120% / uppercase | 26 | 18 |
| Hero sous-texte | 20px / 600 Hanken | 18 | 16 |
| Hero infos (lieu/date) | 20px / 400 / lh 130% | 17 | 16 |
| Nav links (Geist Mono) | 16px | 16 | 15 |
| Bouton "Book an event" | 18px Geist Mono | 17 | 16 |
| Meta date/lieu | 16px Geist Mono | 16 | 15 |
| Paragraphe | 16px Inter lh 150% | 16 | 15 |
| Nom témoin | 16px Geist Mono 600 | 16 | 15 |
| Rôle témoin | 14px Geist Mono | 13 | 13 |
| FAQ question | 20px Hanken 500 | 18 | 18 |

### 3.4 Breakpoints Framer
- Desktop : ≥1200px (design à 1440, contenu max ~1376px avec padding 32px)
- Tablette : 810–1199px
- Mobile : 0–809px
- Un breakpoint intermédiaire 810–1439 sur certains textes.

### 3.5 Inventaire des sections (page d'accueil, haut → bas)
1. **Navbar** flottante (fixed, marge 16px, fond blanc, radius ~8px, hauteur 64px) : logo gauche, liens centrés HOME•/ABOUT/BLOG/EVENTS (Geist Mono uppercase, point vert sur l'actif), bouton pill vert "Book an event". Mobile : logo + burger. Apparition : slide depuis y:-50, spring 1.5s delay 0.5.
2. **Hero** plein écran (100vh) : vidéo de fond (object-fit cover) + overlay ; en bas-gauche H1 géant 140px menthe pâle `#e6f2f1` ; à droite paragraphe blanc ; ligne d'infos 3 colonnes (LIEU / DATE + SALLE / TICKET PRIX) ; à droite bouton ticket 2 parties (icône ticket sur fond menthe + bloc vert vif `#42c96f` "Get your ticket now for **XX%** off" avec compteur animé 0→50%). Anim : H1 + sous-titre scale 0.7→1 (tween 1.4s delay 1.1, ease [0.95,-0.02,0.38,1]) ; infos fade y:120→0 spring 0.8 delays 0.2/0.3/0.6.
3. **Mission** : avatars empilés (4 photos rondes + badge vert "80+") centré, puis paragraphe géant centré uppercase Hanken 600 (~30px) avec **reveal mot par mot au scroll** (opacité gris → noir).
4. **Logos partenaires** : grille 3×2 de cartes blanches (radius 8, logos gris "Logoipsum") ; sur mobile 1 colonne.
5. **Featured event (dark)** : bloc pleine largeur fond `#30403e`, 2 colonnes : gauche titre Inter 80px blanc "FUTURE LEADERS GLOBAL EVENT" + icône étoile verte + H4 uppercase + nom speaker vert clair ; droite image full-height. Mobile : empilé (texte puis image).
6. **Our Main Event** : titre 2 tons + description + bouton outline "View All Event" ; grille 2 colonnes de cartes (image 16:10 radius 8, ligne séparatrice, H3 uppercase 40px, meta "Lieu • Date" Geist Mono). Au hover : overlay "View Event" (Bricolage 64px) + zoom image. 5 cartes (la 5ᵉ seule à gauche… en fait grid 2 col auto-fill).
7. **Recent Events** : titre + description ; grande image 16:9 (radius 8) avec **carte glassmorphism** (backdrop-blur 48px, fond menthe, radius 8) en bas-gauche (H4, date, texte) + **bande de 4 vignettes** en bas (galerie/slider avec effet noir & blanc → couleur au hover). Apparition carte : y:80→0 spring 0.6.
8. **Attendee Feedback** : titre + flèches ← → à droite ; **carrousel** horizontal de cartes témoignages (3 visibles, la centrale sur fond `#d8e4e3`) : 5 étoiles vertes, citation Geist Mono, avatar + nom + rôle, ligne, puis stat H4 ("5,000+ Attendees") + description. Boucle infinie (contenu dupliqué ×4).
9. **Simple Pricing** : titre 2 tons + description ; 3 cartes (General / VIP dark / Student) : mini logo, prix $199/MO, nom, description, séparateur, liste 5 items avec check vert, bouton pill vert clair.
10. **Team Event** (fond `#e6f2f1`) : titre + texte ; **accordéon horizontal d'images** (7 membres, la carte active s'élargit ~2.5×, les autres restent en fines bandes ; nom + rôle en overlay bas). Hover → change la carte active.
11. **Book + FAQ** : 2 colonnes — gauche carte menthe (avatar, "BOOK AN EVENT", texte, bouton vert, en bas icône mail + email) ; droite H2 "FREQUENTLY ASKED QUESTIONS" (Inter 80px) + accordéon 7 questions (+ / − icône).
12. **We're Here to Help + Formulaire** : 2 colonnes — gauche bloc avec vidéo de fond (radius 16) + overlay gris, H2 blanc "WE'RE HERE TO HELP", texte, en bas "OFFICE LOCATION" / "SUPPORT" ; droite carte menthe formulaire "BOOK AN EVENT" (Name, Email, Phone, Event select, bouton, mention terms, 5 étoiles + "Hosting Top Events Since 2016").
13. **Articles** : titre 2 tons + description + bouton "View All Blog" ; 2 cartes blog (image 16:10, catégorie, H3, date).
14. **Footer** (fond `#30403e`) : H2 blanc "SET THE STAGE FOR YOUR NEXT EVENT." + 2 colonnes de liens (MAIN PAGES / INNER PAGES) ; grille 3 colonnes bordurées (email / "Book an event" onglet clair / "Discover Events") avec textes, gros chiffre vert animé (compteur) ; ligne copyright + Terms/Privacy ; **wordmark géant** "Eventry" en vert transparent débordant en bas.

### 3.6 Animations et interactions à reproduire
- Smooth scroll Lenis (lerp ~0.1)
- Navbar : entrée slide-down spring (delay 0.5s, 1.5s, bounce 0.2)
- Hero : scale-in 0.7→1 du titre (1.4s, delay 1.1s, cubic-bezier(.95,-.02,.38,1)) ; infos slide-up spring staggered
- Compteur % du ticket (0→50 en ~2s), bloc vert révélé de gauche à droite
- Reveal mot par mot au scroll (mission)
- Cartes événements : hover image scale 1.05 + overlay "View Event"
- Recent Events : carte glass slide-up + vignettes grayscale→color au hover
- Carrousel témoignages : flèches, défilement infini
- Team : accordéon horizontal (flex-grow animé, spring)
- FAQ : accordéon (height auto animé, icône + ↔ −)
- Footer : compteur chiffre, wordmark géant
- Apparition générique des sections : fade + y:120→0 spring 0.8 (stagger 0.2/0.3/0.6)

### 3.7 Pages secondaires du template (miroir)
About · Events (liste) · Event detail · Book an event · Blog · Blog detail · Privacy · Terms · 404.


---

## 4. Recherche Wall Africa (2026-09-12)

**Sources** : site officiel `wallafrica.com` (hors ligne aujourd'hui — DNS introuvable ; récupéré via Wayback Machine, snapshot 2025-03-15), page Facebook "Wall Africa | Cotonou", Instagram `@wallafrica.bj`, LinkedIn `company/wallafrica`.

### Infos RÉELLES trouvées
- **Nom** : Wall Africa (aussi écrit "Wallafrica")
- **Positionnement** : « Wall Africa est une marque jeune, dynamique et engagée dans la communication numérique. Nous sommes spécialisés dans le conseil et le développement de contenus informatifs, interactifs et publicitaires. Notre équipe peut vous aider à mettre en place vos projets, de leur conception à leur réalisation. »
- **Meta description** : « Wallafrica est une agence dynamique de communication numérique, spécialisée dans le branding digital, la création de contenu interactif et publicitaire. Nous aidons les entreprises à accroître leur visibilité en ligne grâce à des solutions de communication sur mesure. »
- **Services listés** : Solutions numériques · Expérience utilisateur / Conception d'interface · Design d'espace · Image de marque · **Événements** · Publicité
- **Slogans** : « L'Essence du Digital » · « Donnez Vie à Votre Marque » · « Singularisez Votre Espace » · « À Wall, devenez l'Alpha des Wolf » (témoignage)
- **Chiffres clés (compteurs du site)** : 5+ ans d'expérience · 200+ projets réalisés · 100+ clients satisfaits
- **Projets / Galerie** : Eat & Drink Festival Cotonou × Le Black (identité + design d'espace) · Les jus Magnolia · Soaga
- **Clients / partenaires (logos affichés)** : MTN, Canal+, ENGIE, SUNU, Soaga, Le Black Cotonou, BYOB, Fabrimetal, GB Food, Eureka Store, WE Foundation, Impact & Partners, BCG, Agence Jus d'Orange, AML
- **Témoignages réels** : Victoire Ogoutchoro · Cynthia Migan · Sènami Quenum · Véra-Martiane Bankole (textes récupérés)
- **Adresse** : Missité Sikè, Cotonou, Littoral, Bénin
- **Téléphone** : +229 01 99 89 18 18 · **WhatsApp** : wa.me/22999891818
- **Email** : contact@wallafrica.com
- **Réseaux** : Facebook `facebook.com/profile.php?id=100094187633889` · Instagram `instagram.com/wallafrica.bj` · LinkedIn `linkedin.com/company/wallafrica`
- **Logo** : fichier « LOGO BLANC WALL AFRICA.png » existait sur le site mais **non archivé** → logo non récupérable → wordmark typographique en attendant le fichier officiel.
- **Ancienne charte** : fond noir + accent jaune doré `#ecbc3a` (site 2024). Non reprise (on suit la charte Eventry), mais notée.

### Infos INTROUVABLES → [SIMULÉ]
- Événements organisés par Wall Africa elle-même (aucune liste publique) → on simule avec WeLoveYa / Afro Nation
- Équipe (noms/photos) → [SIMULÉ]
- Tarifs billetterie → [SIMULÉ] en FCFA
- Articles de blog → [SIMULÉ]

### Données WeLoveYa / Afro Nation (pour la simulation d'événements)
- **WeLovEya Festival 2025** — 3ᵉ édition — 27–28 déc. 2025 — Place de l'Amazone, Cotonou — headliners Davido, Wizkid, Burna Boy + Fanicko, Vano Baby — 50 000+ festivaliers attendus (72 000 présents selon une source) — billets Général / VIP Gold / Platinum
- **Afro Nation Ghana** — Accra (Marine Drive / Black Star Square), décembre
- **Afro Nation Portugal** — Portimão, Praia da Rocha, juillet
- **Tidal Rave** — beach rave à Accra, Ghana


---

## 5. Décisions

### 5.0 Décisions validées par l'utilisateur (2026-09-12)
- Périmètre : **Accueil + Événements (liste) + Détail événement + À propos + Réserver** ; blog = page simple
- Hero : **vidéo libre de droits** (Pexels/Coverr) téléchargée en local, marquée [À REMPLACER], avec poster + lazy-load
- Langue : **français**
- Portraits équipe/témoins : **placeholders libres de droits** en local, listés [À REMPLACER]

### 5.0b Identité visuelle (session 3 — remplace la charte Eventry)
- Couleurs : noir `#0b0b0b` / cartes `#151515` `#1f1f1f` / doré `#ecbc3a` (+ clair `#f6d97c`, profond `#c9a227`) / texte blanc, gris `#a8a8a8` `#8c8c8c`, lignes `#2b2b2b`.
- Règle de contraste : sur bloc doré → texte noir ; sur noir → texte blanc, accents dorés. Jamais de blanc sur doré.
- Polices : Unbounded (display) · Bricolage Grotesque (titres secondaires) · Space Grotesk (texte). Les noms de variables CSS `--font-hanken`/`--font-inter`/`--font-mono` sont conservés mais pointent vers les nouvelles polices (évite de toucher tous les composants).

### 5.1 Stack (VALIDÉE)
**Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Motion (Framer Motion) + Lenis**
- Le site de référence est React + Framer Motion + Lenis : on reprend exactement les mêmes primitives d'animation (spring/tween avec les valeurs extraites).
- Next.js apporte le routing multi-pages (Accueil, Événements, Détail, À propos, Réservation), `next/image` (compression/lazy/poster), fonts Google auto-hébergées (`next/font`), et un déploiement natif Vercel / Netlify.
- Tailwind v4 pour reproduire la grille et les 3 breakpoints Framer (`sm` ≤809 / `md` 810–1199 / `lg` ≥1200) via des tokens custom.

### 5.2 Arborescence prévue
```
Wall-africa/
├─ SUIVI-PROGRESSION.md · README.md
├─ package.json · next.config.ts · tsconfig.json · postcss.config.mjs
├─ public/
│  ├─ images/events/  (assets Weloveya/Afronation optimisés en .webp)
│  ├─ images/team/    (portraits placeholders)
│  ├─ images/partners/ (logos)
│  └─ videos/hero.mp4 + hero-poster.jpg (emplacement prêt)
├─ src/
│  ├─ app/  layout.tsx · page.tsx · globals.css · evenements/ · evenements/[slug]/ · a-propos/ · reserver/
│  ├─ components/
│  │  ├─ layout/  Navbar · Footer · SmoothScroll (Lenis)
│  │  ├─ sections/ Hero · Mission · Partners · FeaturedEvent · MainEvents · RecentEvents · Testimonials · Pricing · Team · BookFaq · HelpForm · Articles
│  │  └─ ui/  Button · SectionTitle · Reveal (fade/slide) · WordReveal · Counter · Accordion · Marquee
│  ├─ data/  site.ts (infos Wall Africa) · events.ts · testimonials.ts · team.ts · faq.ts · pricing.ts
│  └─ lib/  motion.ts (presets extraits de Framer) · utils.ts
```

### 5.3 Mapping section → contenu
| Section Eventry | Contenu Wall Africa | Asset |
|---|---|---|
| Navbar | Wordmark "Wall Africa" · ACCUEIL / À PROPOS / BLOG / ÉVÉNEMENTS · "Réserver un événement" | — |
| Hero | H1 "WALL AFRICA" · texte mission · COTONOU, BÉNIN / 27–28 DÉC. 2025 · PLACE DE L'AMAZONE / PASS GÉNÉRAL : 15 000 FCFA [SIMULÉ] · CTA "-50 %" | Wizkid@WeLoveYa (Ken Burns) ou vidéo si fournie |
| Mission | Paragraphe reveal mot-à-mot (texte réel adapté) · badge "100+" clients | avatars placeholders |
| Partenaires | MTN, Canal+, ENGIE, SUNU, Le Black, Soaga (logos typographiques) | [PLACEHOLDER logos] |
| Featured dark | "WELOVEYA FESTIVAL 2025" · citation · "Wizkid — Headliner" | Wizkid |
| Nos événements (5) | WeLoveYa 2025 · Afro Nation Ghana · Tidal Rave Accra · Afro Nation Portugal · Eat & Drink Festival Cotonou | 4 images fournies + 1 à trouver |
| Événements récents | Grande image + carte glass "Afro Nation Ghana 2025" + 4 vignettes | téléchargement.jpg + 4 images |
| Témoignages | 4 témoignages réels + stats 5+ ans / 200+ projets / 100+ clients / 50 000+ festivaliers | avatars placeholders |
| Tarifs | Pass Général / VIP Gold / Étudiant en FCFA [SIMULÉ] | — |
| Équipe | 7 membres [SIMULÉ] | portraits placeholders |
| Réserver + FAQ | contact@wallafrica.com · 7 questions adaptées | — |
| Aide + formulaire | Missité Sikè, Cotonou · +229 01 99 89 18 18 · formulaire | fond image/vidéo |
| Articles | 2 articles [SIMULÉ] | images placeholders |
| Footer | "PRÉPAREZ LA SCÈNE DE VOTRE PROCHAIN ÉVÉNEMENT." · liens · réseaux réels · wordmark géant | — |


---

## 6. Fichiers créés / modifiés

- `SUIVI-PROGRESSION.md`, `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`
- `src/app/` : `globals.css`, `layout.tsx`, `page.tsx`
- `src/lib/` : `motion.ts` (presets Framer), `utils.ts`
- `src/data/` : `site.ts`, `events.ts`, `testimonials.ts`, `team.ts`, `faq.ts`, `pricing.ts`, `articles.ts`
- `src/components/layout/` : `SmoothScroll.tsx` (Lenis), `Navbar.tsx`, `Footer.tsx`
- `src/components/ui/` : `Logo`, `Button`, `Reveal`, `SectionHeading`, `WordReveal`, `Counter`, `Accordion`, `Icons`, `EventCard`, `PageHero`, `Marquee`, `SnapRow`, `CardStack`, `RollingGallery`, `CustomCursor`, `Magnet`, `SplitText`, `SpotlightCard`, `TiltCard`, `GoldParticles` · `layout/ScrollProgress`, `layout/FooterWordmark`
- `src/components/layout/MobileCta.tsx` · `src/components/sections/EventsTicker.tsx`, `Services.tsx`, `EventsGrid.tsx`, `Newsletter.tsx` · `src/data/partners.ts`, `services.ts` · `.mcp.json` (shadcn)
- `src/components/sections/` : `Hero`, `Mission`, `Partners`, `FeaturedEvent`, `MainEvents`, `RecentEvents`, `Testimonials`, `Pricing`, `Team`, `BookFaq`, `HelpForm`, `Articles`
- `public/videos/` : `hero.mp4`, `hero-poster.jpg`, `help-bg.mp4`, `help-bg-poster.jpg`
- `public/images/` : `events/` (6), `team/` (7), `avatars/` (8), `blog/` (2), `CREDITS.md`
- `assets-source/` : les 4 images originales fournies (non modifiées)

---

## 7. Checklist — reste à faire

- [x] 1. Initialisation
- [x] 2. Analyse du site de référence
- [x] 3. Recherche Wall Africa (présentée à l'utilisateur)
- [x] 4. Plan validé (stack, arborescence, mapping)
- [x] 5a. Build page d'accueil (12 sections + nav + footer)
- [x] 5b. Pages secondaires : /evenements, /evenements/[slug], /a-propos, /reserver, /blog, /blog/[slug], mentions, 404
- [x] 6. Vérification responsive 375/768/1024/1440 + captures comparatives (`docs/captures/`)
- [x] README + liste des placeholders (§9)

- [x] 7. Migration OPUS CORP (session 7, commit `77935d5`) — état détaillé §12

### Reste à faire (avant mise en production OPUS CORP)
- [ ] Compléter les champs « À compléter » du classeur (§12) : coordonnées, 6 projets réels, partenaires, avis, équipe, chiffres, mentions légales
- [ ] Intégrer le logo officiel (SVG) dans `Logo.tsx` et les vidéos OPUS (`public/videos/`)
- [ ] Brancher les formulaires (réservation, newsletter) sur un service + destinataire OPUS (LIV.TEC.01–06)
- [ ] Favicon, image de partage 1200×630, domaine canonique + `NEXT_PUBLIC_SITE_URL` (LIV.MED.06–07, LIV.SEO.05/10)
- [ ] Vérifier sur navigateurs réels (Safari iOS : autoplay vidéo, backdrop-filter)
- [ ] Validation finale : colonne H (décision) et I (validateur/date) du classeur — « À valider » ≠ autorisé à publier (LIV.REC.04)

---

## 8. Problèmes rencontrés

- Playwright : le paquet npm installé ne correspondait pas aux navigateurs en cache (`chromium_headless_shell-1234`) → lancement avec `executablePath` explicite. Script : scratchpad `pw/shot.mjs`.
- Pexels/Unsplash bloquent le scraping (403/401) → portraits via pravatar.cc, vidéos/images via Mixkit (licence libre).
- Pillow absent (PEP 668) → découpage des captures avec ffmpeg.

- Le dossier inspi ne contient pas `runtime/`, `snapshot/`, `analysis/` (README obsolète) → on s'appuie sur `mirror/` + `capture/rendered.html` + screenshots + webm.
- Aucune vidéo fournie pour le hero → à remplacer par une image (ou vidéo libre de droits) — décision à valider.

---

## 9. Placeholders / assets à remplacer avant prod

| Élément | Fichier(s) | Statut |
|---|---|---|
| Vidéo hero + poster | `public/videos/hero.mp4`, `hero-poster.jpg` | Mixkit #14088 libre de droits → vidéo Wall Africa |
| Vidéo fond "Aide" + poster | `public/videos/help-bg.mp4`, `help-bg-poster.jpg` | Mixkit #14087 |
| Logo | `src/components/ui/Logo.tsx` | Wordmark typographique → SVG officiel |
| Portraits équipe + noms | `public/images/team/member-1..7.jpg`, `src/data/team.ts` | pravatar + noms fictifs |
| Avatars témoins / mission | `public/images/avatars/avatar-1..8.jpg` | pravatar |
| Rôles des témoins | `src/data/testimonials.ts` | Témoignages réels, rôles [SIMULÉ] ; 2 témoignages fictifs (Kossi Adjovi, Aïcha Zinsou) |
| Événements & dates & prix | `src/data/events.ts` | WeLoveYa/Afro Nation = simulation ; Eat & Drink = projet réel (dates simulées) ; Cotonou Pyro Night fictif |
| Images événements 5 & 6 | `public/images/events/afronation-portugal-dj.jpg`, `eat-drink-festival-crowd.jpg` | Extraites de vidéos Mixkit |
| Logos partenaires GBfoods & BCG | `src/data/partners.ts` | Correspondance à confirmer ; Le Black & Soaga à fournir |
| Articles | `src/data/articles.ts`, `public/images/blog/*`, `src/app/blog/[slug]/page.tsx` | Fictifs |
| Stat "50 000+ festivaliers", "since 2019", fréquentations par événement (`audience`) | `src/data/site.ts`, `src/data/events.ts` | Déduits / simulés |
| Mentions légales | `src/app/mentions-legales/page.tsx` | À valider juridiquement |
| Formulaires | `HelpForm.tsx`, `Newsletter.tsx` | Front-only (état local) |
| Images fournies (4) | `public/images/events/weloveya-wizkid.jpg`, `afronation-ghana.jpg`, `tidal-rave-accra.jpg`, `festival-crowd-pyro.jpg` | 736px de large — prévoir des versions HD |

## 11. Partage public (tunnel Cloudflare — temporaire)

- URL active (session 3, sur `next dev`) : **https://womens-sleeps-borders-signals.trycloudflare.com** — valide tant que `cloudflared` et le serveur tournent ; l'URL change à chaque relance. (Précédente `therapy-evaluate-…` coupée.)
- Relancer :
  ```bash
  cd ~/Projets-perso/Wall-africa && npm run build && (npx next start -p 3000 &) && ~/.local/bin/cloudflared tunnel --url http://localhost:3000
  ```
- Pour un lien permanent : déployer sur Vercel/Netlify (README).

## 10. Pour reprendre le travail

- **Production** : https://opuscrp.com — Hostinger, export statique (`out/`) dans `domains/opuscrp.com/public_html` (FTP 92.113.28.227:21, compte u836329975 ; le mot de passe est à demander au client — il n'est jamais stocké dans le dépôt).
- **Mettre à jour le site** : modifier → `npm run build` → téléverser le contenu de `out/` (FTPS, p. ex. `curl --ssl-reqd -k --ftp-create-dirs --user u836329975:$FTP_PASS -T fichier ftp://92.113.28.227/domains/opuscrp.com/public_html/fichier` ; le serveur coupe le TLS sans close_notify → ignorer l'erreur `unwrap`) → vérifier en ligne → commit + push.
- **Contenus** : Google Sheet https://docs.google.com/spreadsheets/d/1lRCxOI9-QbGi5oPORJdeR3Xy3I9tuDjf-Ke7J0tFH0M (version de référence, export `/export?format=xlsx`).
- Dépôt GitHub : https://github.com/sx1vio/wall-africa (privé) — `git clone` puis `npm install && npm run dev`.

```bash
cd ~/Projets-perso/Wall-africa && npm install && npm run dev   # http://localhost:3000
```
- Contenu : `src/data/*.ts` (identifiants du classeur en commentaire) · Styles/tokens : `src/app/globals.css` · Animations : `src/lib/motion.ts`
- Brief de contenu : `Contenus Site Web.xlsx` (racine) — lisible avec `openpyxl` ; état d'intégration bloc par bloc en §12
- Référence : `~/Templates-sites/Wall-africa-inspi/capture/` (desktop-full.png, mobile.png, rendered.html)
- Captures comparatives : `docs/captures/`
- Script de capture Playwright (scratchpad de session, à recréer si besoin) : lancer chromium headless en cache `~/.cache/ms-playwright/chromium_headless_shell-1234/…` avec `executablePath`, scroller progressivement pour déclencher les `whileInView`, puis `fullPage` screenshot.

## 12. OPUS CORP — état des contenus (classeur `Contenus Site Web.xlsx`)

| Bloc | Intégré | Statut / reste à faire |
|---|---|---|
| GLO.NAV / GLO.ID | Nom, menus, CTA, ville, 2026, signature « OPUS, la marque se vit. » | Signature à confirmer (GLO.ID.03) |
| GLO.CON | Instagram `@opuscorp__` ; tél./WhatsApp +229 01 61 18 67 58 (source indirecte) | **À compléter** : e-mail, adresse, LinkedIn, Facebook. TikTok stocké en commentaire (GLO.CON.08, décision direction) |
| ACC.HER | Titre, présentation, colonnes lieu/date/intervention, bouton vers fiche vedette | Vidéo OPUS (LIV.MED.04) ; compteur remplacé par le public descriptif (ACC.HER.07) |
| ACC.INT | Manifeste ; badge « 2026 » | Métrique 100+ non définie (ACC.INT.02) |
| ACC.PAR / PAR.01–06 | 6 emplacements SVG « Partenaire 01… » | Logos, relation, autorisations à fournir |
| ACC.FOC / EVT.01 | Vedette = « Sang Donné, Vies Sauvées » (juil. 2026) | Rôle, lieu, photo à valider par OPUS |
| ACC.EVT / EVL / EVT.01–06 | 6 fiches : 2 repérées (Sang Donné, Rose Garden) + 4 exemples de dispositifs ; 4 filtres Activation/Scénographie/Lancement/Corporate ; bloc « Dispositif » au lieu de « Line-up » | Remplacer par 6 projets réels (titres, dates, lieux, photos, preuves) |
| ACC.AVI / AVIS.01–06 | 6 emplacements « témoignage en attente » ; blocs stat = faits du dossier | Citations, auteurs, portraits, accords |
| CHI.01–06 | Aucun chiffre de résultat affiché ; compteurs À propos = 2026 / 3 / 3 / 6 | Valeurs réelles justifiées |
| ACC.SER / SER.01–03 | 3 cartes × 5 prestations, textes du classeur | — |
| GLO.EQU / EQU.01–07 | 7 fonctions par département (pas de personnes nommées) | Identités, fonctions, portraits, accords |
| GLO.CTA / GLO.FAQ / GLO.FOR | Textes du classeur ; formulaire 4 champs / 7 options ; « depuis 2026 » | Destinataire + états d'envoi (LIV.TEC.01–04) |
| APR.* | Intro, présentation + promesse, culture (attribution OPUS CORP), newsletter | Image principale OPUS (APR.HER.03), ligne partenaires (APR.PAR.02) |
| BLG / ART.01–02 | 2 articles complets (Méthode, Culture OPUS) | Dates réelles de publication, visuels |
| RES / GLO.PIE | Réserver, footer (accroches, liens, wordmark OPUS CORP) | — |
| LEG.* | SARL, 1 000 000 FCFA, structure | RCCM/IFU, responsable, adresse, hébergeur, texte données perso ; validation juridique |
| LIV.MED / LIV.SEO | Titres/descriptions/OG du classeur ; visuels nommés v01 | Logo SVG, vidéos, favicon, image de partage 1200×630, domaine canonique |
