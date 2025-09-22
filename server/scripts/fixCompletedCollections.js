const mongoose = require('mongoose');
const WasteRequest = require('../models/WasteRequest');
require('dotenv').config();

async function fixCompletedCollections() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver toutes les demandes terminées
    const completedRequests = await WasteRequest.find({ 
      status: 'completed' 
    });

    console.log(`📋 ${completedRequests.length} demande(s) terminée(s) trouvée(s)`);

    let fixedCount = 0;

    for (const request of completedRequests) {
      console.log(`\n🔍 Demande ${request._id}:`);
      console.log(`  - Type: ${request.wasteType}`);
      console.log(`  - Poids estimé: ${request.estimatedWeight}kg`);
      console.log(`  - Détails collecte:`, request.collectionDetails);

      // Si pas de collectionDetails ou pas de actualWeight
      if (!request.collectionDetails || !request.collectionDetails.actualWeight) {
        console.log('  ⚠️ Pas de poids réel enregistré, correction...');
        
        // Utiliser le poids estimé comme poids réel
        request.collectionDetails = {
          actualWeight: request.estimatedWeight,
          collectedBy: request.assignedCollector,
          photos: request.collectionDetails?.photos || []
        };

        await request.save();
        console.log(`  ✅ Poids corrigé: ${request.estimatedWeight}kg`);
        fixedCount++;
      } else {
        console.log(`  ✅ Poids déjà enregistré: ${request.collectionDetails.actualWeight}kg`);
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`  - Total demandes terminées: ${completedRequests.length}`);
    console.log(`  - Demandes corrigées: ${fixedCount}`);
    console.log(`  - Demandes déjà correctes: ${completedRequests.length - fixedCount}`);

    // Calculer le poids total
    const totalWeight = completedRequests.reduce((sum, req) => {
      const weight = req.collectionDetails?.actualWeight || req.estimatedWeight;
      return sum + weight;
    }, 0);

    console.log(`  - Poids total collecté: ${totalWeight.toFixed(2)}kg`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
fixCompletedCollections();
