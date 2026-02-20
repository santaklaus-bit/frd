# Migration du Blog vers Django - Résumé

## ✅ Ce qui a été fait

1. **Pages blog mises à jour** :
   - `/app/blog/page.tsx` - Liste des articles (récupère depuis Django API)
   - `/app/blog/[slug]/page.tsx` - Page d'article (récupère depuis Django API)

2. **Anciennes pages sauvegardées** :
   - `/app/blog/page_old.tsx` - Ancienne liste (MDX)
   - `/app/blog/[slug]/page_old.tsx` - Ancienne page article (MDX)

3. **Fonctionnalités** :
   - ✅ Création d'articles via Django Admin
   - ✅ Support bilingue (FR/EN)
   - ✅ Upload d'images
   - ✅ Gestion brouillon/publié
   - ✅ Contenu en Markdown/MDX

## 🚀 Comment utiliser

### Créer un article

1. **Démarrer Django** :
```bash
cd /Users/aureldsk/Farid/backend
source venv/bin/activate
python manage.py runserver
```

2. **Aller sur l'admin** : http://localhost:8000/admin

3. **Créer un article** :
   - Articles de blog → Ajouter un article
   - Remplir titre, contenu (Markdown), slug
   - Uploader une image (optionnel)
   - Cocher "Publié"
   - Enregistrer

4. **Voir sur le site** :
```bash
cd /Users/aureldsk/Farid
npm run dev
```
   - Visiter : http://localhost:3000/blog

## 📝 Format du contenu

Le contenu doit être en **Markdown** :

```markdown
# Titre de section

Paragraphe avec du **gras** et de l'*italique*.

## Sous-titre

- Liste à puces
- Point 2

> Citation

[Lien](https://example.com)
```

## ⚠️ Important

- Le contenu est en **HTML brut** pour l'instant (pas de rendu MDX complet)
- Pour un meilleur rendu, vous pouvez :
  - Utiliser du HTML directement
  - Ou je peux ajouter un convertisseur Markdown → HTML

## 🔄 Prochaines étapes (optionnel)

1. **Améliorer le rendu Markdown** :
   - Installer un convertisseur Markdown côté Django
   - Renvoyer du HTML formaté depuis l'API

2. **Migrer les anciens articles** :
   - Script pour importer les articles MDX vers Django

3. **Ajouter un éditeur riche** :
   - Installer un éditeur WYSIWYG dans Django Admin

Dites-moi ce que vous préférez !
