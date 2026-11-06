# Analyse initiale du panel d’administration

> Ce document décrit l’état initial du dépôt. L’implémentation OPUS réalisée ensuite est documentée dans [panel-admin.md](panel-admin.md).

Analyse locale du 6 novembre 2026 ; comparaison avec `/Users/aureldsk/frd`. Aucun déploiement ni modification applicative effectué.

## État constaté

Le dépôt contient deux applications qui ne sont pas raccordées :

- À la racine, `app/`, `components/` et `lib/` contiennent le site Farid et son administration. `next.config.ts`, `package.json`, `tsconfig.json`, le middleware et le déploiement Docker correspondent à cette application.
- `src/app/`, `src/components/` et `src/data/` contiennent le site OPUS CORP décrit dans le README. Les articles, événements, membres, services, FAQ et coordonnées sont définis dans des fichiers TypeScript. Certaines images et vidéos sont référencées directement dans les composants.

La documentation Next installée (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/src-folder.md`) précise que `src/app` est ignoré quand `app` existe à la racine. L’alias `@/*` pointe actuellement vers la racine ; les imports OPUS attendent une résolution dans `src/`.

Le README et le suivi décrivent une production OPUS exportée dans `out/` et hébergée sur Hostinger avec PHP. La configuration actuelle ne contient pas `output: "export"` et le workflow vise encore le site Farid. L’état du serveur de production et les capacités de l’offre Hostinger n’ont pas été vérifiés.

## Ce qui existe déjà dans frd et ici

Les fichiers `app/admin/layout.tsx`, `components/admin/blog-form.tsx` et `lib/content-manager.ts` sont identiques dans les deux dépôts au moment de l’analyse.

Fonctions présentes : tableau de bord, articles, éditeur Editor.js, upload, recadrage d’images, projets, expertises, témoignages, messages, newsletter, contenus bilingues et page analytics. Leur présence ne garantit pas leur configuration ni leur fonctionnement en production.

La couche de données utilise Sequelize, MySQL ou SQLite. Le modèle d’article Farid est bilingue et comprend des pièces jointes PDF/audio ; il ne correspond pas directement au modèle OPUS et ne comporte pas de statut brouillon/publié ni de workflow de validation.

## Corrections nécessaires avant réutilisation

- `app/api/auth/login/route.ts` définit un mot de passe de secours et un jeton de session constant. Remplacer par des comptes et sessions vérifiables côté serveur, avec expiration et révocation.
- `middleware.ts` vérifie seulement la présence du cookie et exclut les API. Les écritures dans `app/api/blog/route.ts`, `app/api/blog/[slug]/route.ts`, `app/api/upload/route.ts` et `app/actions/blog.ts` ne vérifient pas les droits. Chaque mutation doit contrôler la session et les permissions.
- La déconnexion tente d’effacer depuis JavaScript un cookie HttpOnly. Prévoir une action serveur qui révoque la session et expire le cookie.
- L’upload accepte les fichiers sans liste restrictive effectivement imposée, sans contrôle du contenu réel ni limite métier explicite. Prévoir validation, noms générés, limites et stockage persistant. Les SVG nécessitent un traitement spécifique ou doivent être exclus.
- Les layouts racine et admin rendent tous deux `html` et `body`. Réorganiser les layouts pour éviter leur imbrication.
- Retirer l’initialisation de la base du build applicatif et organiser des migrations explicites au déploiement.

## Périmètre proposé pour OPUS

| Module | Fonctions attendues |
| --- | --- |
| Tableau de bord | Compteurs réels, brouillons, publications récentes, raccourcis |
| Articles | Éditeur riche, couverture, catégories, auteur, extrait, slug, brouillon, aperçu, publication et archivage |
| Médiathèque | Upload, recherche, aperçu, texte alternatif, recadrage, sélection dans les contenus et contrôle des usages avant suppression |
| Événements / réalisations | Fiches, dates, lieux, rôle OPUS, catégories, couverture, galeries ordonnées et mise en avant |
| Équipe | Portraits, fonctions, biographies, expertises, ordre d’affichage et projets associés |
| Pages et paramètres | Textes de présentation, services, FAQ, coordonnées, réseaux sociaux, images et vidéos des sections |
| Messages | Conservation des demandes, statut lu/traité, recherche et export ; le script PHP actuel envoie uniquement un e-mail |
| Utilisateurs | Comptes individuels, administrateur et éditeur, désactivation et journal des actions |
| Référencement | Titre SEO, description, image de partage, redirection lors d’un changement de slug |

Ajouter partenaires, témoignages et newsletter seulement si ces rubriques sont retenues : le README les mentionne, mais les fichiers de données correspondants ne sont pas présents dans `src/data/` lors de l’analyse. Les analytics demandent également une source configurée ; ne pas afficher de statistiques inventées.

## Architecture à choisir selon l’hébergement

Pour réutiliser le panel Next de frd, la cible cohérente est une application Next exécutée sur Node, avec base MySQL, stockage persistant des médias et sauvegardes. La publication doit mettre à jour les pages publiques et leurs caches ; les brouillons restent inaccessibles au public. Vérifier la disponibilité d’un runtime Node dans l’offre d’hébergement avant de retenir cette solution.

Si l’hébergement doit rester strictement Apache/PHP avec un export statique, le panel Next serveur ne peut pas être déposé tel quel dans `public_html`. Il faut un backend distinct, ou un backend PHP. La création d’un article exige alors soit une reconstruction et un déploiement automatisés du site statique, soit une adaptation du rendu public pour récupérer le contenu à l’exécution. Les fiches OPUS utilisent actuellement `generateStaticParams` et `dynamicParams = false` : un nouvel article en base ne crée pas à lui seul une nouvelle page.

## Ordre de réalisation

1. Identifier l’application cible et confirmer les contraintes d’hébergement.
2. Rendre cohérents les dossiers, alias, scripts, layouts et fichiers de déploiement, en conservant les sources existantes.
3. Mettre en place les migrations, comptes, sessions, permissions et stockage des médias.
4. Livrer une chaîne complète : création d’article, couverture, brouillon, aperçu privé, publication et affichage public.
5. Étendre aux événements et galeries, à l’équipe, puis aux paramètres de pages et aux messages.
6. Migrer les contenus existants en conservant les URLs, puis vérifier sauvegarde et restauration.

## Validation attendue

- Une requête anonyme ne peut ni créer, ni modifier, ni supprimer un contenu ou un média.
- Une session expirée ou révoquée est refusée ; les rôles sont contrôlés côté serveur.
- Un brouillon n’apparaît ni dans les pages publiques ni dans les API publiques ou le sitemap.
- Une publication crée une fiche accessible et met à jour listes, accueil et métadonnées.
- Les images et contenus survivent à un redéploiement.
- Les anciens slugs redirigent et les médias encore utilisés ne sont pas supprimés accidentellement.
- Le build cible le bon site et ne dépend pas d’une base de production disponible au moment de compiler.

L’analyse repose sur la lecture des sources et de la documentation locale. Aucun build, test fonctionnel ou audit du serveur distant n’a été exécuté.
