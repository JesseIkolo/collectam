# 🚀 Commandes Collectam-Pro

## 🔧 Développement

```bash
# Démarrer en mode développement
npm run dev

# Linter et formatage
npm run lint
npm run format

# Générer les presets de thème
npm run generate:presets
```

## 📦 Build et Déploiement

```bash
# Vérification pré-déploiement
npm run pre-deploy

# Build standard
npm run build

# Build optimisé pour Netlify
npm run netlify-build

# Validation du build
npm run validate-build

# Export statique
npm run export
```

## 🌐 Déploiement Netlify

### Préparation
```bash
# 1. Vérifier la configuration
npm run pre-deploy

# 2. Tester le build local
npm run build
npm run validate-build

# 3. Commit et push
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### Configuration Netlify
```bash
# Base directory: Collectam-Pro
# Build command: npm run build
# Publish directory: out
```

### Variables d'environnement
```bash
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
NODE_ENV=production
```

## 🔍 Debug et Tests

```bash
# Vérifier la structure des fichiers
npm run validate-build

# Analyser les erreurs de build
npm run build 2>&1 | tee build.log

# Tester en local après build
npm run build && npm run start
```

## 📊 Monitoring

```bash
# Logs Netlify
# Via dashboard: https://app.netlify.com/sites/[site]/deploys

# Logs backend (si Heroku)
heroku logs --tail -a your-backend-app

# Test des endpoints
curl https://your-app.netlify.app/api/health
```

## 🚨 Dépannage Rapide

### Build Failed
```bash
# Nettoyer et rebuilder
rm -rf .next out node_modules
npm install
npm run build
```

### 404 Errors
```bash
# Vérifier les redirections
cat netlify.toml | grep -A 5 "redirects"

# Vérifier la configuration Next.js
cat next.config.mjs | grep -A 5 "output"
```

### API Errors
```bash
# Vérifier les variables d'env
echo $NEXT_PUBLIC_API_URL

# Tester l'API backend
curl https://your-backend.herokuapp.com/api/health
```

## 📋 Checklist Déploiement

```bash
# Avant déploiement
[ ] npm run pre-deploy ✅
[ ] npm run build ✅
[ ] npm run validate-build ✅
[ ] git push ✅

# Après déploiement
[ ] Site accessible ✅
[ ] Login fonctionne ✅
[ ] Dashboard Business ✅
[ ] API calls working ✅
```

## 🔗 URLs Importantes

### Développement
- Local: http://localhost:3000
- API: http://localhost:5000

### Production
- Frontend: https://your-app.netlify.app
- Backend: https://your-backend.herokuapp.com
- Dashboard: https://your-app.netlify.app/dashboard/business

---

**💡 Tip**: Utilisez `npm run pre-deploy` avant chaque déploiement pour éviter les erreurs !
