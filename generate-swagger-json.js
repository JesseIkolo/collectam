const fs = require('fs');
const path = require('path');
const { specs } = require('./server/config/swagger');

// Créer le dossier docs s'il n'existe pas
const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// Générer le fichier swagger.json
const swaggerJson = JSON.stringify(specs, null, 2);
fs.writeFileSync(path.join(docsDir, 'swagger.json'), swaggerJson);

console.log('✅ swagger.json généré dans le dossier docs/');
console.log('📁 Fichiers prêts pour le déploiement statique');
