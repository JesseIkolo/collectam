const BusinessCollector = require('../models/BusinessCollector');
const BusinessVehicle = require('../models/BusinessVehicle');
const WasteCollectionRequest = require('../models/WasteCollectionRequest');

// Obtenir les statistiques business
const getBusinessStats = async (req, res) => {
  try {
    console.log('📊 Récupération des statistiques business pour:', req.user.id);
    
    const businessOwnerId = req.user.id;
    
    // Récupérer les collecteurs business
    const collectors = await BusinessCollector.find({ businessOwnerId });
    const collectorIds = collectors.map(c => c._id);
    
    // Récupérer les véhicules business
    const vehicles = await BusinessVehicle.find({ businessOwnerId });
    
    // Récupérer les demandes assignées aux collecteurs business
    const wasteRequests = await WasteCollectionRequest.find({
      assignedCollector: { $in: collectorIds }
    });
    
    // Calculer les statistiques
    const totalCollections = wasteRequests.length;
    const completedCollections = wasteRequests.filter(r => r.status === 'completed').length;
    const totalWeight = wasteRequests.reduce((sum, r) => sum + (r.estimatedWeight || 0), 0);
    
    // Calculer le temps de réponse moyen (en heures)
    const completedRequests = wasteRequests.filter(r => r.status === 'completed' && r.completedAt);
    let averageResponseTime = 0;
    if (completedRequests.length > 0) {
      const totalResponseTime = completedRequests.reduce((sum, r) => {
        const created = new Date(r.createdAt);
        const completed = new Date(r.completedAt);
        return sum + (completed.getTime() - created.getTime());
      }, 0);
      averageResponseTime = Math.round(totalResponseTime / completedRequests.length / (1000 * 60 * 60)); // en heures
    }
    
    // Calculer la satisfaction client (simulation basée sur les collectes terminées)
    const customerSatisfaction = completedCollections > 0 ? 
      Math.min(5.0, 3.5 + (completedCollections / totalCollections) * 1.5) : 0;
    
    const stats = {
      totalCollections,
      totalWeight,
      averageResponseTime,
      customerSatisfaction: Math.round(customerSatisfaction * 10) / 10,
      completedCollections,
      activeCollectors: collectors.filter(c => c.status === 'actif').length,
      activeVehicles: vehicles.filter(v => v.status === 'actif').length
    };
    
    console.log('✅ Statistiques business calculées:', stats);
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération statistiques business:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

module.exports = {
  getBusinessStats
};
