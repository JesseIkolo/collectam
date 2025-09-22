# Guide Multi-Port pour Collectam

Ce guide explique comment faire fonctionner votre application sur plusieurs ports simultanément avec des utilisateurs différents.

## 🚀 Démarrage Rapide

### Option 1: Scripts NPM (Recommandé)

```bash
# Terminal 1 - Pour utilisateur ménage sur port 3000
npm run dev:menage

# Terminal 2 - Pour utilisateur collecteur sur port 3001  
npm run dev:collecteur
```

### Option 2: Commandes manuelles

```bash
# Terminal 1 - Port 3000 pour ménage
NEXT_PUBLIC_USER_TYPE=menage npm run dev -- -p 3000

# Terminal 2 - Port 3001 pour collecteur
NEXT_PUBLIC_USER_TYPE=collecteur npm run dev -- -p 3001
```

## 🔧 Comment ça marche

### 1. Stockage Séparé par Port
- Chaque port utilise des clés localStorage différentes
- Format: `collectam_{userType}_{port}_{key}`
- Exemple: `collectam_menage_3000_accessToken`

### 2. Variables d'Environnement
- `NEXT_PUBLIC_USER_TYPE` force le type d'utilisateur
- Valeurs possibles: `menage`, `collecteur`, `entreprise`, `collectam-business`

### 3. Redirection Intelligente
- Le système vérifie d'abord la variable d'environnement
- Puis le userType de l'utilisateur connecté
- Redirige vers le bon dashboard

## 📱 Utilisation

### Étape 1: Démarrer les serveurs
```bash
# Terminal 1
npm run dev:menage
# Serveur sur http://localhost:3000

# Terminal 2  
npm run dev:collecteur
# Serveur sur http://localhost:3001
```

### Étape 2: Se connecter
- Port 3000: Connectez-vous avec un compte ménage
- Port 3001: Connectez-vous avec un compte collecteur

### Étape 3: Tester
- Les sessions sont complètement indépendantes
- Vous pouvez être connecté simultanément sur les deux ports
- Chaque port garde sa propre session

## 🛠️ Personnalisation

### Ajouter d'autres types d'utilisateurs

1. **Ajouter un script dans package.json:**
```json
"dev:entreprise": "NEXT_PUBLIC_USER_TYPE=entreprise next dev --turbopack -p 3002"
```

2. **Utiliser:**
```bash
npm run dev:entreprise
```

### Ports personnalisés
```bash
NEXT_PUBLIC_USER_TYPE=menage npm run dev -- -p 4000
```

## 🐛 Débogage

### Voir le stockage localStorage
Ouvrez la console du navigateur et tapez:
```javascript
// Voir tous les éléments stockés pour ce port
PortStorage.debugStorage();

// Nettoyer le stockage pour ce port
PortStorage.clear();
```

### Logs dans la console
Le système affiche des logs détaillés:
- `🔧 Storage SET/GET/REMOVE` - Opérations de stockage
- `🔍 getDashboardRoute` - Logique de redirection
- `✅ Login/Registration successful` - Authentification réussie

## 🔄 Migration depuis l'ancien système

Si vous avez des données dans l'ancien localStorage, elles ne seront pas perdues mais ne seront pas visibles dans le nouveau système. Pour migrer:

1. Sauvegardez vos données importantes
2. Utilisez le nouveau système
3. Les anciennes données resteront dans localStorage avec les anciennes clés

## ⚠️ Notes importantes

1. **Cookies**: Les cookies restent partagés entre les ports (même domaine)
2. **API**: Toutes les instances utilisent la même API backend
3. **Base de données**: Les données sont partagées, seules les sessions sont séparées
4. **Performance**: Chaque port est une instance Next.js complète

## 🎯 Cas d'usage

- **Développement**: Tester différents types d'utilisateurs simultanément
- **Démonstration**: Montrer l'application depuis plusieurs perspectives
- **Tests**: Valider les interactions entre différents rôles
- **Formation**: Former plusieurs types d'utilisateurs en parallèle
