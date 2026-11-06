# Administration OPUS CORP

## Architecture

Le site et son panel utilisent désormais une seule application Next dans `src/`. Le code copié de Farid est conservé dans `reference/frd/` et exclu de la compilation. Les anciens workflows de déploiement Farid et les fichiers PHP/Apache de l’ancien hébergement sont également dans ce dossier ; ils ne se déclenchent plus dans ce projet.

Cette version s’exécute sur **Node 22.13 minimum, idéalement Node 24 LTS**. Elle utilise SQLite via `node:sqlite`, avec journal WAL, et un dossier de médias persistant. Elle ne s’installe pas en déposant un export statique dans `public_html`. Le site Hostinger actuellement en production n’a pas été modifié.

## Démarrage

```sh
npm ci
cp .env.example .env.local
npm run admin:create
npm run dev
```

Ouvrir `http://localhost:3000/admin`. La commande demande l’e-mail, le nom et un mot de passe de 12 caractères minimum ; la saisie du mot de passe est masquée. Aucun compte et aucun mot de passe par défaut ne sont fournis. Les mots de passe sont dérivés avec scrypt et sel aléatoire ; les jetons de session sont aléatoires et seul leur condensat est stocké.

Le premier accès initialise les tables et importe les données de `src/data/` dans la base, une seule fois. Après cette importation, les changements passent par le panel. Modifier les fichiers TypeScript ne remplace pas les contenus enregistrés.

## Fonctions

- **Articles** : recherche, filtre de statut, auteur, catégorie, dates, couverture, texte alternatif, introduction, éditeur par blocs (paragraphes, titres, listes, citations et images), SEO, aperçu privé, brouillon, publication et archivage.
- **Événements** : lieu, intervention, public, horaires, description, galeries avec ordre des photos, ordre des fiches et projet à la une.
- **Équipe** : portraits, biographies, rôles, pôles, missions, expertises, projets associés et ordre d’affichage.
- **Médiathèque** : fichiers existants et nouveaux uploads, recherche, aperçu, choix depuis les formulaires, description et suppression contrôlée des fichiers ajoutés. Les images sont décodées, orientées et optimisées en WebP, avec un maximum de 2560 px. Les GIF sont importés comme image fixe. Les médias d’origine dans `public/` restent conservés.
- **Site** : coordonnées, présentation, liens sociaux, navigation, CTA, informations légales, services, FAQ, vidéos et photos des sections d’accueil et À propos.
- **Messages** : réception des demandes du formulaire, recherche, statuts nouveau/lu/traité et réponse via le logiciel e-mail. La nouvelle route enregistre la demande dans le panel ; elle n’envoie pas de notification e-mail automatique.
- **Comptes** : administrateurs et éditeurs, désactivation, changement de mot de passe et révocation des sessions.
- **Historique** : journal des opérations et versions précédentes des fiches, restaurables en brouillon en conservant l’adresse actuelle de la fiche. Une suppression de fiche reste une action définitive dans l’interface ; privilégier l’archivage.

Les éditeurs gèrent les articles, événements, équipe, médias et messages. Les administrateurs ont aussi accès aux paramètres, comptes et suppressions définitives. Chaque API vérifie les permissions côté serveur. Les mutations exigent une origine de requête identique à l’application.

Les pages publiques et le sitemap ne reçoivent que les contenus publiés. Les nouveaux articles sont disponibles sans rebuild. Un changement de slug crée une redirection permanente ; une ancienne adresse ne peut pas être recyclée pour une autre fiche.

Les modifications concurrentes sont détectées grâce aux numéros de version. Un éditeur doit recharger une fiche modifiée par un autre avant d’enregistrer. Un média utilisé dans un document ou dans l’historique ne peut pas être supprimé.

## Déploiement Node

```sh
npm ci
npm run build
npm run admin:create
npm start
```

Variables :

| Variable | Usage |
| --- | --- |
| `OPUS_DATA_DIR` | Dossier persistant absolu ou relatif ; défaut `./var/opus` |
| `NEXT_PUBLIC_SITE_URL` | Domaine public canonique |
| `OPUS_APP_ORIGIN` | Origine exacte autorisée pour les écritures, sans slash final ; définir `https://opuscrp.com` en production |

`next start` ne charge pas automatiquement un fichier `.env` pour les scripts Node externes ; la commande `admin:create` charge `.env.local`. Utiliser le même `OPUS_DATA_DIR` pour créer le compte et pour lancer le serveur. Ne pas conserver le mot de passe de création dans un fichier d’environnement après usage.

Avec Docker : `docker compose -f deploy/compose.yml up --build -d`, puis `docker compose -f deploy/compose.yml exec opus npm run admin:create`. Le volume `opus-data` contient la base et les médias. Placer le service derrière un reverse proxy HTTPS et conserver l’hébergement et les DNS e-mail existants. Adapter l’origine si le domaine de destination change.

Cette implémentation vise un serveur unique et un disque persistant ; pour plusieurs réplicas ou une plateforme sans disque durable, migrer vers une base et un stockage partagés. L’accès aux médias est public par URL, y compris ceux sélectionnés dans un brouillon ; l’aperçu de fiche demeure privé.

## Sauvegarde

Sauvegarder la base **avec une méthode cohérente avec SQLite/WAL** et le dossier `media/`. Pour une sauvegarde simple hors ligne : arrêter le service, copier tout `OPUS_DATA_DIR`, puis redémarrer. Pour une sauvegarde en ligne, utiliser l’API de sauvegarde SQLite ou un outil adapté au WAL, puis copier les médias. Copier seulement `opus.sqlite` pendant que le serveur écrit peut produire une sauvegarde incomplète.

Une restauration doit remettre la base et les médias de la même sauvegarde dans un dossier appartenant à l’utilisateur du serveur. Les anciennes sessions peuvent être invalidées en vidant la table `sessions`.

## Vérification

```sh
npm run typecheck
npm run lint
npm run build
npm run test:cms
```

Le test d’intégration démarre un serveur de production sur `127.0.0.1:3197`, crée une base temporaire et vérifie les accès, la publication, les redirections, les conflits, les uploads, les droits et le redémarrage. La base de développement n’est pas modifiée. `OPUS_TEST_PORT` permet de changer le port.

À confirmer avant déploiement : disponibilité de Node et d’un disque persistant sur l’offre Hostinger, compte initial et éventuelles notifications e-mail. Aucun accès au serveur distant n’a été effectué.

## Résultats de validation locale

- Build de production, TypeScript et ESLint réussis.
- 42 vérifications d’intégration réussies dans une base temporaire : publication, droits, sessions, médias, historique, redirections, associations équipe/projets et redémarrage.
- Parcours navigateur vérifié avec Chrome : connexion, création et publication d’article, médiathèque, navigation mobile et pages publiques ; aucun débordement horizontal détecté à 390 px.
- Captures : [tableau de bord](captures/admin-opus-desktop.png), [éditeur](captures/admin-opus-article.png), [médiathèque](captures/admin-opus-media.png), [mobile](captures/admin-opus-mobile.png).

Les captures utilisent un compte et des données temporaires. Aucun compte de test n’est installé dans la base de développement.
