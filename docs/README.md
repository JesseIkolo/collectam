# Collectam API Documentation

Documentation Swagger pour l'API Collectam - Plateforme de gestion des déchets.

## Déploiement

### Option 1: Netlify (Recommandé - Gratuit)
1. Connectez votre repo GitHub à Netlify
2. Définir le dossier de build: `docs`
3. URL automatique fournie

### Option 2: Vercel
1. `npm install -g vercel`
2. `cd docs && vercel`
3. Suivre les instructions

### Option 3: GitHub Pages
1. Push le dossier `docs` sur GitHub
2. Activer GitHub Pages dans Settings
3. Sélectionner le dossier `docs` comme source

### Option 4: Surge.sh
1. `npm install -g surge`
2. `cd docs && surge`
3. Choisir un domaine

## Mise à jour
Pour mettre à jour la documentation:
```bash
node generate-swagger-json.js
```

## Accès local
```bash
cd docs
python -m http.server 8000
# ou
npx serve .
```
