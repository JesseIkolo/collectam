# 🚀 Collectam-Pro - Guide de Déploiement

Application de gestion de collecte de déchets avec dashboard Business complet.

## 📋 Aperçu de l'Application

### Fonctionnalités Principales
- **Dashboard Business** : Gestion de flotte, analytics, facturation
- **Dashboard Collecteur** : Gestion des véhicules, scanner QR, carte temps réel
- **Dashboard Utilisateur** : Gestion des déchets, récompenses, historique
- **Système d'abonnement** : Plans Business avec paiements
- **Authentification** : JWT avec durée de 24h
- **Responsive Design** : Optimisé mobile/tablet/desktop

### Architecture Technique
- **Frontend** : Next.js 15 + React 19 + TypeScript
- **UI** : Tailwind CSS + shadcn/ui + Lucide Icons
- **State Management** : Zustand + React Query
- **Backend** : Node.js + Express + MongoDB Atlas
- **Déploiement** : Netlify (Frontend) + Heroku (Backend)

## 🔧 Configuration pour Production

### 1. Variables d'Environnement Requises

```bash
# Frontend (Netlify)
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
NODE_ENV=production

# Backend (Heroku)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=https://your-app.netlify.app
```

### 2. Commandes de Déploiement

```bash
# Vérification pré-déploiement
npm run pre-deploy

# Build local (test)
npm run build

# Build optimisé Netlify
npm run netlify-build
```

## 🌐 URLs de Production

Après déploiement, l'application sera accessible via :

### Dashboards
- **Business** : `/dashboard/business`
  - Vue d'ensemble : `/dashboard/business`
  - Gestion de Flotte : `/dashboard/business/fleet`
  - Carte Temps Réel : `/dashboard/business/map`
  - Analytics : `/dashboard/business/analytics`
  - Facturation : `/dashboard/business/billing`
  - Paramètres : `/dashboard/business/settings`

- **Collecteur** : `/dashboard/collector`
  - Tableau de bord : `/dashboard/collector`
  - Mes Véhicules : `/dashboard/collector/vehicles`
  - Carte Temps Réel : `/dashboard/collector/map`
  - Scanner QR : `/dashboard/collector/scanner`
  - Mon Profil : `/dashboard/collector/profile`
  - Historique : `/dashboard/collector/history`

- **Utilisateur** : `/dashboard/user`
  - Accueil : `/dashboard/user`
  - Gestion des Déchets : `/dashboard/user/waste-management`
  - Carte Temps Réel : `/dashboard/user/map`
  - Mon Profil : `/dashboard/user/profile`
  - Récompenses : `/dashboard/user/rewards`
  - Historique : `/dashboard/user/history`

### Authentification
- **Connexion** : `/auth/v2/login`
- **Inscription** : `/auth/v2/register`
- **Mot de passe oublié** : `/auth/v2/forgot-password`

### Business
- **Pricing** : `/business-pricing`
- **Plans d'abonnement** : 10k XOF/mois, 25k XOF/3mois, 72k XOF/an

## 🔄 Flux d'Utilisateur Business

1. **Utilisateur Standard** → Limite de 2 véhicules atteinte
2. **Bouton "Passer à Collectam Business"** → Déconnexion automatique
3. **Redirection** → `/auth/v2/register`
4. **Sélection** → Type "Collectam Business"
5. **Redirection** → `/business-pricing`
6. **Choix du plan** → Activation abonnement
7. **Redirection** → `/dashboard/business`
8. **Accès complet** → Flotte illimitée + outils professionnels

## 🛠️ Dépannage Post-Déploiement

### Erreurs Communes

**404 sur les routes**
```bash
# Vérifiez netlify.toml redirections
# Assurez-vous que output: 'export' est dans next.config.mjs
```

**Erreurs API**
```bash
# Vérifiez NEXT_PUBLIC_API_URL
# Vérifiez que le backend est en ligne
# Vérifiez CORS sur le backend
```

**Token expiré**
```bash
# Redémarrez le serveur backend
# JWT_SECRET configuré ?
# Durée de token = 24h ?
```

**Dashboard vide**
```bash
# Variables d'environnement correctes ?
# Base de données accessible ?
# Utilisateur avec bon userType ?
```

### Logs Utiles

```bash
# Netlify build logs
https://app.netlify.com/sites/[site-name]/deploys

# Backend logs (Heroku)
heroku logs --tail -a your-backend-app

# Browser console
F12 → Console → Erreurs réseau/JavaScript
```

## 📊 Monitoring Post-Déploiement

### Métriques à Surveiller
- **Performance** : Temps de chargement < 3s
- **Erreurs** : Taux d'erreur < 1%
- **Uptime** : Disponibilité > 99%
- **API** : Temps de réponse < 500ms

### Outils Recommandés
- **Netlify Analytics** : Trafic et performance
- **Heroku Metrics** : Performance backend
- **MongoDB Atlas** : Performance base de données
- **Google Analytics** : Comportement utilisateur

## 🔐 Sécurité

### Configurations Appliquées
- **Headers de sécurité** : CSP, HSTS, X-Frame-Options
- **CORS** : Domaines autorisés uniquement
- **JWT** : Tokens sécurisés avec expiration
- **Variables d'env** : Secrets non exposés côté client
- **HTTPS** : Certificats SSL automatiques (Netlify)

## 📈 Optimisations

### Performance
- **Static Export** : Génération statique pour vitesse maximale
- **Image Optimization** : Images optimisées automatiquement
- **Code Splitting** : Chargement par chunks
- **Caching** : Cache agressif des assets statiques
- **CDN** : Distribution globale via Netlify Edge

### SEO
- **Meta Tags** : Configurés pour chaque page
- **Sitemap** : Généré automatiquement
- **Robots.txt** : Optimisé pour indexation
- **Structured Data** : Schema.org pour business

## 🚀 Mise en Production

### Checklist Final
- [ ] Backend déployé et accessible
- [ ] Variables d'environnement configurées
- [ ] Build local réussi
- [ ] Tests fonctionnels passés
- [ ] CORS backend configuré
- [ ] Certificats SSL actifs
- [ ] Monitoring configuré
- [ ] Backup base de données
- [ ] Documentation équipe
- [ ] Formation utilisateurs

### Post-Déploiement
- [ ] Tests de charge
- [ ] Monitoring 24h
- [ ] Feedback utilisateurs
- [ ] Optimisations performance
- [ ] Plan de maintenance

---

**🎉 Félicitations ! Collectam-Pro est maintenant en production !**

Pour toute question : consultez `DEPLOYMENT.md` ou `QUICK_DEPLOY.md`
