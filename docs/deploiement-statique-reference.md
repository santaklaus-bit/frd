# OPUS CORP — site vitrine

Site vitrine / portfolio d'**OPUS CORP** (agence de communication BTL — événementiel, design, branding — Cotonou, Bénin) : structure et animations reprises du template Framer [Eventry](https://eventry.framer.website/), identité noir + doré. Pas de vente de billets.

Le contenu suit le classeur **`Contenus Site Web.xlsx`** (relevé du 14 sept. 2026, identifiants `PAGE.BLOC.NUMÉRO`) : les propositions « À valider » sont intégrées, les champs « À compléter » sont affichés comme emplacements provisoires (« à confirmer », « Partenaire 01 », témoignages en attente, exemples de dispositifs). Voir `SUIVI-PROGRESSION.md` §12 pour la liste exacte.

## Stack

- **Next.js 16** (App Router, TypeScript) · **Tailwind CSS v4**
- **motion** (Framer Motion) — presets extraits du template (`src/lib/motion.ts`)
- **Lenis** — smooth scroll
- Google Fonts auto-hébergées via `next/font` : Unbounded (display), Bricolage Grotesque, Space Grotesk
- Identité : noir + doré `#ecbc3a` — tokens dans `src/app/globals.css`

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # build de production
```

## Structure

```
src/app/            pages (/, /evenements, /evenements/[slug], /a-propos, /reserver, /blog, /blog/[slug], /mentions-legales)
src/components/     layout (Navbar, Footer, SmoothScroll) · sections · ui
src/data/           contenu éditable (site, events, testimonials, team, faq, services, partners, articles)
src/lib/            motion presets, utils
public/images/      visuels (voir public/images/CREDITS.md)
public/videos/      vidéo hero + poster, fond section aide
assets-source/      images originales du projet précédent (Wall Africa), non utilisées
```

Tout le contenu textuel se modifie dans `src/data/*.ts`.

## Aperçu public temporaire (tunnel Cloudflare)

```bash
npm run build && (python3 -m http.server 3000 -d out &) && ~/.local/bin/cloudflared tunnel --url http://localhost:3000
```
Sert l'export statique, identique à la production. Ne pas exposer `next dev` : Next 16 bloque ses ressources depuis un autre domaine.

## Déploiement — Hostinger (opuscrp.com)

Le site est un **export statique** (`output: "export"`) : `npm run build` produit `out/`, prêt pour un hébergement web Hostinger (Apache + PHP).

1. `npm run build` puis compresser **le contenu** de `out/` (y compris le fichier caché `.htaccess`), ou reprendre `opus-site-hostinger.zip`.
2. hPanel → Sites web → opuscrp.com → **Gestionnaire de fichiers** → `public_html/` : vider le dossier, téléverser l'archive, l'extraire à la racine de `public_html/`.
3. hPanel → **SSL** : activer le certificat gratuit (Let's Encrypt) pour opuscrp.com et www.
4. Tester le formulaire (`/reserver/`) : les demandes arrivent sur `contact@opuscrp.com` via `public/contact.php` (mail() PHP, expéditeur = boîte du domaine).

Fichiers propres à Hostinger : `public/.htaccess` (HTTPS, www → domaine nu, 404, cache) et `public/contact.php` (destinataire en tête de fichier).
Ne pas toucher aux enregistrements DNS e-mail (MX, SPF, DKIM, DMARC) : ils font fonctionner la boîte contact@opuscrp.com.

## À remplacer avant mise en production

Voir la liste complète dans `SUIVI-PROGRESSION.md` §12 et `public/images/CREDITS.md` :

- Coordonnées (`src/data/site.ts`) : LinkedIn à fournir ; lien WhatsApp à tester
- Vidéos hero / aide → `Opus event paysage.mp4` (LIV.MED.04/05) + posters
- Événements (`src/data/events.ts`) : photos des 6 projets, dates EVT.04 / EVT.06
- Partenaires (`src/data/partners.ts`, `public/images/partners/`) : 6 emplacements « Partenaire 01… »
- Témoignages (`src/data/testimonials.ts`) : 6 emplacements en attente ; chiffres (CHI.01–06) non affichés
- Équipe (`src/data/team.ts`) : 6 membres nommés ; portraits recadrés en 4:5 sur le visage (`public/images/team/`, sources dans `assets-source/opus-team/`). Pour un nouveau portrait : recadrer en 4:5, visage centré et ≈ 30 % de la largeur, sommet de la tête à ~8–10 % du haut
- Mentions légales : RCCM/IFU, responsable de publication, hébergeur, texte données personnelles
- Formulaires (réservation, newsletter) : front-only, à brancher sur un service et le destinataire OPUS
