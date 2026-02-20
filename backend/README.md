# Django Backend - Instructions de démarrage

## Prérequis
- Python 3.14+
- pip

## Installation

1. **Activer l'environnement virtuel**
```bash
cd backend
source venv/bin/activate  # Sur macOS/Linux
# ou
venv\Scripts\activate  # Sur Windows
```

2. **Les dépendances sont déjà installées**, mais si nécessaire :
```bash
pip install -r requirements.txt
```

## Créer un superuser (admin)

Pour accéder à l'interface d'administration Django :

```bash
python manage.py createsuperuser
```

Suivez les instructions pour créer votre compte administrateur.

## Démarrer le serveur

```bash
python manage.py runserver
```

Le serveur Django sera accessible sur : **http://localhost:8000**

## Accéder à l'admin Django

1. Démarrez le serveur (voir ci-dessus)
2. Visitez : **http://localhost:8000/admin**
3. Connectez-vous avec les identifiants du superuser

## API Endpoints disponibles

- **POST** `/api/contact/` - Soumettre un formulaire de contact
- **POST** `/api/newsletter/subscribe/` - S'abonner à la newsletter
- **GET** `/api/blog/posts/` - Liste des articles de blog (paginée)
- **GET** `/api/blog/posts/{slug}/` - Détails d'un article de blog

## Tester les APIs avec curl

### Contact Form
```bash
curl -X POST http://localhost:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "request_type": "general",
    "message": "Ceci est un message de test"
  }'
```

### Newsletter
```bash
curl -X POST http://localhost:8000/api/newsletter/subscribe/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Blog Posts
```bash
curl http://localhost:8000/api/blog/posts/
```

## Démarrer les deux serveurs (Django + Next.js)

### Terminal 1 - Django Backend
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### Terminal 2 - Next.js Frontend
```bash
cd /Users/aureldsk/Farid
npm run dev
```

Ensuite visitez : **http://localhost:3000**

## Configuration Email

Par défaut, les emails sont affichés dans la console (backend de développement).

Pour utiliser un vrai service d'email, modifiez le fichier `backend/.env` :

```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-app
```

## Structure du projet

```
backend/
├── apps/
│   ├── contact/      # App formulaire de contact
│   ├── newsletter/   # App newsletter
│   └── blog/         # App blog
├── config/           # Configuration Django
├── media/            # Fichiers uploadés
├── db.sqlite3        # Base de données SQLite
├── manage.py         # Script de gestion Django
└── .env              # Variables d'environnement
```
