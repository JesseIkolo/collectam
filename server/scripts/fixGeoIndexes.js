const mongoose = require('mongoose');
require('dotenv').config();

async function fixGeoIndexes() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // 1. Lister tous les index existants
    console.log('\n📋 Index existants sur la collection users:');
    const indexes = await collection.indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
    });

    // 2. Supprimer tous les index géospatiaux (2dsphere)
    console.log('\n🧹 Suppression des index géospatiaux...');
    for (const index of indexes) {
      // Vérifier si c'est un index 2dsphere
      const hasGeoIndex = Object.values(index.key).some(value => value === '2dsphere');
      
      if (hasGeoIndex && index.name !== '_id_') {
        try {
          await collection.dropIndex(index.name);
          console.log(`✅ Index supprimé: ${index.name}`);
        } catch (error) {
          console.log(`⚠️ Impossible de supprimer ${index.name}:`, error.message);
        }
      }
    }

    // 3. Créer un seul index géospatial sur lastLocation.coordinates
    console.log('\n🔧 Création du nouvel index géospatial...');
    try {
      await collection.createIndex(
        { "lastLocation.coordinates": "2dsphere" },
        { name: "lastLocation_2dsphere" }
      );
      console.log('✅ Nouvel index créé: lastLocation_2dsphere');
    } catch (error) {
      console.log('⚠️ Erreur création index:', error.message);
    }

    // 4. Vérifier les nouveaux index
    console.log('\n📋 Index finaux:');
    const finalIndexes = await collection.indexes();
    finalIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
    });

    console.log('\n✅ Correction des index terminée !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
fixGeoIndexes();
