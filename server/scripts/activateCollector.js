const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function activateCollector() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver tous les collecteurs
    const collectors = await User.find({ userType: 'collecteur' });
    console.log(`👥 ${collectors.length} collecteur(s) trouvé(s)`);

    if (collectors.length === 0) {
      console.log('❌ Aucun collecteur trouvé. Inscrivez-vous d\'abord en tant que collecteur.');
      return;
    }

    // Activer le premier collecteur avec géolocalisation (Douala, Cameroun)
    const collector = collectors[0];
    
    const updateData = {
      onDuty: true,
      lastLocation: {
        type: 'Point',
        coordinates: [9.7043, 4.0511] // Douala, Cameroun [longitude, latitude]
      },
      lastSeenAt: new Date()
    };

    await User.findByIdAndUpdate(collector._id, updateData);
    
    console.log(`✅ Collecteur activé: ${collector.firstName} ${collector.lastName}`);
    console.log(`📍 Position définie: Douala (${updateData.lastLocation.coordinates})`);
    console.log(`🟢 Status: onDuty = true`);
    
    // Vérification
    const updatedCollector = await User.findById(collector._id);
    console.log('\n📋 Vérification:');
    console.log(`- onDuty: ${updatedCollector.onDuty}`);
    console.log(`- lastLocation: ${JSON.stringify(updatedCollector.lastLocation)}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
activateCollector();
