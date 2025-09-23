/**
 * Script pour corriger les index géospatiaux en double dans MongoDB
 * 
 * PROBLÈME: Multiple 2dsphere indexes sur la collection users
 * SOLUTION: Supprimer les index en double et garder seulement celui nécessaire
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function fixGeospatialIndexes() {
  try {
    // Connexion à MongoDB
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // 1. Lister tous les index existants
    console.log('\n📋 Index existants sur la collection users:');
    const indexes = await usersCollection.indexes();
    
    let geospatialIndexes = [];
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key, null, 2));
      
      // Identifier les index 2dsphere
      if (JSON.stringify(index.key).includes('"2dsphere"')) {
        geospatialIndexes.push(index);
        console.log('   ⚠️  INDEX GÉOSPATIAL DÉTECTÉ');
      }
    });

    console.log(`\n🔍 Nombre d'index géospatiaux trouvés: ${geospatialIndexes.length}`);

    if (geospatialIndexes.length <= 1) {
      console.log('✅ Pas de problème d\'index détecté');
      return;
    }

    // 2. Supprimer les index géospatiaux en double
    console.log('\n🧹 Suppression des index géospatiaux en double...');
    
    for (let i = 1; i < geospatialIndexes.length; i++) {
      const indexToDelete = geospatialIndexes[i];
      console.log(`🗑️  Suppression de l'index: ${indexToDelete.name}`);
      
      try {
        await usersCollection.dropIndex(indexToDelete.name);
        console.log(`✅ Index ${indexToDelete.name} supprimé avec succès`);
      } catch (error) {
        console.log(`❌ Erreur lors de la suppression de ${indexToDelete.name}:`, error.message);
      }
    }

    // 3. Vérifier qu'il reste un seul index géospatial
    console.log('\n🔍 Vérification finale des index...');
    const finalIndexes = await usersCollection.indexes();
    let finalGeospatialCount = 0;
    
    finalIndexes.forEach(index => {
      if (JSON.stringify(index.key).includes('"2dsphere"')) {
        finalGeospatialCount++;
        console.log(`✅ Index géospatial restant: ${index.name}`, JSON.stringify(index.key, null, 2));
      }
    });

    if (finalGeospatialCount === 1) {
      console.log('\n🎉 PROBLÈME RÉSOLU! Il reste exactement 1 index géospatial');
      console.log('✅ Le système de matching automatique devrait maintenant fonctionner');
    } else {
      console.log(`\n⚠️  ATTENTION: Il reste ${finalGeospatialCount} index géospatiaux`);
    }

    // 4. Créer l'index correct si nécessaire
    if (finalGeospatialCount === 0) {
      console.log('\n🔧 Création de l\'index géospatial correct...');
      await usersCollection.createIndex(
        { "address.coordinates": "2dsphere" },
        { name: "address_coordinates_2dsphere" }
      );
      console.log('✅ Index géospatial créé: address.coordinates');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la correction des index:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  console.log('🚀 SCRIPT DE CORRECTION DES INDEX GÉOSPATIAUX');
  console.log('='.repeat(50));
  fixGeospatialIndexes()
    .then(() => {
      console.log('\n✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { fixGeospatialIndexes };
