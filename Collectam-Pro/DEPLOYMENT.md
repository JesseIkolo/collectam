# Déploiement Collectam-Pro sur Netlify

Ce guide vous explique comment déployer l'application Collectam-Pro sur Netlify.

## 📋 Prérequis

- Compte Netlify (gratuit)
- Repository Git (GitHub, GitLab, ou Bitbucket)
- Backend API déployé (Heroku, Railway, etc.)

## 🚀 Configuration pour Netlify

### 1. Fichiers de Configuration

Les fichiers suivants ont été configurés pour Netlify :

- `netlify.toml` - Configuration de build et redirections
- `next.config.mjs` - Configuration Next.js avec export statique
- `.env.example` - Variables d'environnement

### 2. Variables d'Environnement

Dans le dashboard Netlify, configurez ces variables :

```bash
# Variables requises
NEXT_PUBLIC_API_URL=https://votre-backend-api.herokuapp.com
NEXT_PUBLIC_APP_URL=https://votre-app.netlify.app

# Variables optionnelles
NODE_ENV=production
```

## 📦 Déploiement Automatique

### Étape 1 : Connecter le Repository

1. Allez sur [Netlify](https://app.netlify.com)
2. Cliquez sur "New site from Git"
3. Choisissez votre provider Git (GitHub recommandé)
4. Sélectionnez le repository `collectam`
5. Configurez le build :
   - **Base directory** : `Collectam-Pro`
   - **Build command** : `npm run build`
   - **Publish directory** : `out`

### Étape 2 : Configuration Build

Netlify détectera automatiquement le `netlify.toml` avec ces paramètres :

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

### Étape 3 : Variables d'Environnement

Dans Netlify Dashboard → Site Settings → Environment Variables :

```
NEXT_PUBLIC_API_URL = https://votre-backend-api.herokuapp.com
NEXT_PUBLIC_APP_URL = https://votre-app.netlify.app
```

## 🔧 Configuration Backend

Assurez-vous que votre backend (serveur Node.js) est configuré pour :

### CORS
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://votre-app.netlify.app'
  ],
  credentials: true
}));
```

### Variables d'environnement backend
```bash
FRONTEND_URL=https://votre-app.netlify.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
```

## 🌐 Domaine Personnalisé (Optionnel)

1. Dans Netlify Dashboard → Domain Settings
2. Cliquez "Add custom domain"
3. Entrez votre domaine (ex: `collectam.com`)
4. Configurez les DNS selon les instructions Netlify

## 🔄 Déploiement Continu

Une fois configuré, chaque push sur la branche principale déclenchera automatiquement :

1. **Build** : `npm run build`
2. **Test** : Vérification des erreurs
3. **Deploy** : Mise en ligne automatique
4. **Notification** : Email de confirmation

## 📱 URLs de l'Application

Après déploiement, votre app sera accessible via :

- **Dashboard Business** : `https://votre-app.netlify.app/dashboard/business`
- **Dashboard Collector** : `https://votre-app.netlify.app/dashboard/collector`
- **Dashboard User** : `https://votre-app.netlify.app/dashboard/user`
- **Pricing Business** : `https://votre-app.netlify.app/business-pricing`
- **Authentication** : `https://votre-app.netlify.app/auth/v2/login`

## 🐛 Dépannage

### Erreur de Build
```bash
# Vérifiez les logs dans Netlify Dashboard
# Erreurs communes :
- Variables d'environnement manquantes
- Dépendances manquantes
- Erreurs TypeScript
```

### Erreur 404
```bash
# Vérifiez netlify.toml redirections
# Assurez-vous que les routes Next.js sont correctes
```

### Erreur API
```bash
# Vérifiez NEXT_PUBLIC_API_URL
# Vérifiez CORS backend
# Vérifiez que le backend est en ligne
```

## ✅ Checklist de Déploiement

- [ ] Repository Git configuré
- [ ] Backend API déployé et accessible
- [ ] Variables d'environnement configurées
- [ ] CORS backend configuré
- [ ] Build local réussi (`npm run build`)
- [ ] Tests locaux réussis
- [ ] Netlify site créé et connecté
- [ ] Premier déploiement réussi
- [ ] Tests sur l'URL de production

## 🔗 Liens Utiles

- [Documentation Netlify](https://docs.netlify.com/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

**Note** : Ce déploiement configure l'application frontend. Le backend Node.js doit être déployé séparément (Heroku, Railway, etc.).
