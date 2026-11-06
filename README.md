# OPUS CORP — site et administration

Application Next.js / React / TypeScript, identité OPUS et contenus administrables dans `/admin`.

## Lancer en local

Node 22.13 minimum, Node 24 LTS recommandé.

```sh
npm ci
cp .env.example .env.local
npm run admin:create
npm run dev
```

Le compte initial est créé avec la commande interactive ; aucun identifiant par défaut.

Le panel gère les articles (brouillons, publications, éditeur par blocs, historique), les événements et galeries, l’équipe, les photos et vidéos, les services, la FAQ, les coordonnées, les demandes de contact et les comptes administrateur/éditeur.

## Structure

- `src/app/(site)/` : pages publiques OPUS
- `src/app/admin/` : administration
- `src/app/api/` : API protégée du panel et formulaire de contact
- `src/lib/cms/` : modèles, base, sessions, publication et médias
- `src/data/` : données initiales importées une fois
- `var/opus/` : base SQLite et fichiers téléversés, à conserver et sauvegarder
- `reference/frd/` : copie de référence de Farid, exclue de l’application

## Production et vérification

```sh
npm run typecheck
npm run lint
npm run build
npm run test:cms
npm start
```

Cette version nécessite un serveur Node et un stockage persistant. L’ancien export statique Hostinger reste documenté dans `docs/deploiement-statique-reference.md` ; il ne contient pas ce panel. Aucun déploiement automatique n’est activé et le site distant n’a pas été modifié.

Voir [la documentation du panel](docs/panel-admin.md) pour les fonctionnalités, les droits, Docker, les variables d’environnement et les sauvegardes.
