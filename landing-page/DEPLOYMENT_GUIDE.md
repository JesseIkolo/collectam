# Guide de Déploiement Netlify - Collectam Landing Page

## Configuration Actuelle

### Fichiers de Configuration
- `next.config.mjs` : Configuration Next.js pour export statique
- `netlify.toml` : Configuration Netlify avec headers et redirections
- `package.json` : Scripts de build mis à jour

### Images Optimisées
Tous les fichiers d'images ont été renommés pour la compatibilité web :
- `logo-hysacam.jpg`
- `logo-mairie-douala-3.png`
- `logo-mairie-douala-5.png`
- `logo-mairie-douala-4.jpg`
- `logo-communaute-urbaine-de-douala-1.png`

## Déploiement sur Netlify

### Méthode 1 : Déploiement automatique via Git
1. Connectez votre repository GitHub à Netlify
2. Configurez les paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `out`
   - **Node version** : `18`

### Méthode 2 : Déploiement manuel
1. Exécutez localement :
   ```bash
   npm install
   npm run build
   ```
2. Glissez-déposez le dossier `out` sur Netlify

### Vérifications Post-Déploiement
- [ ] Toutes les images s'affichent correctement
- [ ] Navigation entre sections fonctionne
- [ ] Formulaires de contact opérationnels
- [ ] Design responsive sur mobile/desktop
- [ ] Performance optimale (images compressées)

## Optimisations Appliquées

### Performance
- Images optimisées (quality: 85, dimensions ajustées)
- Export statique pour temps de chargement rapide
- Headers de cache configurés pour les assets

### SEO & Accessibilité
- Alt text sur toutes les images
- Structure HTML sémantique
- Meta tags configurés

### Compatibilité
- Noms de fichiers sans espaces ni caractères spéciaux
- Configuration Next.js pour export statique
- Headers de sécurité configurés

## Dépannage

### Images ne s'affichent pas
- Vérifiez que les noms de fichiers correspondent exactement
- Assurez-vous que les images sont dans le dossier `public`
- Vérifiez la casse des noms de fichiers

### Erreurs de build
- Vérifiez la version Node.js (18 recommandée)
- Supprimez `node_modules` et `out`, puis réinstallez
- Vérifiez les imports dans les composants

## Structure des Composants
- `Header` : Navigation principale
- `HeroSection` : Section d'accueil
- `Partners` : Logos des partenaires
- `UserTypes` : Types d'utilisateurs avec images
- `BeforeAfter` : Comparaison avant/après
- `Features` : Fonctionnalités
- `DemoTrial` : Appel à l'action
- `Footer` : Pied de page

Votre landing page est maintenant optimisée pour Netlify avec toutes les corrections nécessaires.
