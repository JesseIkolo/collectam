# 🚀 Déploiement Rapide sur Netlify

## Étapes Rapides

### 1. Préparer le Repository
```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin main
```

### 2. Créer le Site Netlify
1. Aller sur [netlify.com](https://netlify.com)
2. "New site from Git" → Choisir GitHub
3. Sélectionner le repo `collectam`
4. Configuration :
   - **Base directory**: `Collectam-Pro`
   - **Build command**: `npm run build`
   - **Publish directory**: `out`

### 3. Variables d'Environnement
Dans Netlify Dashboard → Site Settings → Environment Variables :

```
NEXT_PUBLIC_API_URL = https://votre-backend.herokuapp.com
NEXT_PUBLIC_APP_URL = https://votre-site.netlify.app
NODE_ENV = production
```

### 4. Déployer
Cliquez "Deploy site" - Le build prendra ~3-5 minutes

## ✅ Test Post-Déploiement

Vérifiez ces URLs :
- `/` - Page d'accueil
- `/auth/v2/login` - Connexion
- `/dashboard/business` - Dashboard Business
- `/business-pricing` - Pricing

## 🔧 Si ça ne marche pas

### Build Failed
- Vérifiez les logs Netlify
- Variables d'environnement manquantes ?
- Erreurs TypeScript ?

### 404 Errors
- Vérifiez `netlify.toml`
- Routes Next.js correctes ?

### API Errors
- Backend en ligne ?
- CORS configuré ?
- `NEXT_PUBLIC_API_URL` correct ?

## 📋 Checklist Final

- [ ] Repository pushé
- [ ] Site Netlify créé
- [ ] Variables d'env configurées
- [ ] Build réussi
- [ ] Site accessible
- [ ] Login fonctionne
- [ ] Dashboard Business accessible

**Temps estimé : 10-15 minutes** ⏱️
