/**
 * Script pour identifier et corriger les demandes de collecte en double
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function fixDuplicateRequests() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const db = mongoose.connection.db;
    
    // 1. Vérifier les collections existantes
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections trouvées:');
    collections.forEach(col => {
      if (col.name.includes('waste') || col.name.includes('request')) {
        console.log(`- ${col.name}`);
      }
    });

    // 2. Vérifier les demandes en double pour un collecteur spécifique
    const wasteRequests = db.collection('wasterequests');
    const wasteCollectionRequests = db.collection('wastecollectionrequests');

    // Compter les documents dans chaque collection
    const wasteRequestsCount = await wasteRequests.countDocuments();
    const wasteCollectionRequestsCount = await wasteCollectionRequests.countDocuments();

    console.log(`\n📊 Statistiques:`);
    console.log(`- wasterequests: ${wasteRequestsCount} documents`);
    console.log(`- wastecollectionrequests: ${wasteCollectionRequestsCount} documents`);

    // 3. Chercher les doublons par assignedCollector
    console.log('\n🔍 Recherche de doublons...');
    
    const duplicates = await wasteRequests.aggregate([
      {
        $match: {
          assignedCollector: { $exists: true },
          status: { $in: ['scheduled', 'in_progress'] }
        }
      },
      {
        $group: {
          _id: {
            assignedCollector: '$assignedCollector',
            userId: '$userId',
            wasteType: '$wasteType',
            address: '$address'
          },
          count: { $sum: 1 },
          docs: { $push: '$$ROOT' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();

    console.log(`🔍 ${duplicates.length} groupes de doublons trouvés`);

    if (duplicates.length > 0) {
      console.log('\n📋 Détails des doublons:');
      duplicates.forEach((group, index) => {
        console.log(`\nGroupe ${index + 1}:`);
        console.log(`- Collecteur: ${group._id.assignedCollector}`);
        console.log(`- Utilisateur: ${group._id.userId}`);
        console.log(`- Type: ${group._id.wasteType}`);
        console.log(`- Adresse: ${group._id.address}`);
        console.log(`- Nombre de doublons: ${group.count}`);
        
        group.docs.forEach((doc, i) => {
          console.log(`  ${i + 1}. ID: ${doc._id}, Status: ${doc.status}, Créé: ${doc.createdAt}`);
        });
      });

      // 4. Proposer la suppression des doublons (garder le plus récent)
      console.log('\n🧹 Nettoyage des doublons...');
      let deletedCount = 0;

      for (const group of duplicates) {
        // Trier par date de création (plus récent en premier)
        const sortedDocs = group.docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Garder le premier (plus récent), supprimer les autres
        for (let i = 1; i < sortedDocs.length; i++) {
          const docToDelete = sortedDocs[i];
          console.log(`🗑️  Suppression du doublon: ${docToDelete._id}`);
          
          await wasteRequests.deleteOne({ _id: docToDelete._id });
          deletedCount++;
        }
      }

      console.log(`\n✅ ${deletedCount} doublons supprimés`);
    } else {
      console.log('✅ Aucun doublon trouvé');
    }

    // 5. Vérification finale
    const finalCount = await wasteRequests.countDocuments({
      assignedCollector: { $exists: true },
      status: { $in: ['scheduled', 'in_progress'] }
    });

    console.log(`\n📊 Demandes assignées restantes: ${finalCount}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  console.log('🚀 NETTOYAGE DES DEMANDES EN DOUBLE');
  console.log('='.repeat(40));
  fixDuplicateRequests()
    .then(() => {
      console.log('\n✅ Script terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { fixDuplicateRequests };
