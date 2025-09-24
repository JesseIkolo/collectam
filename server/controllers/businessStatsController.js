const BusinessCollector = require('../models/BusinessCollector');
const BusinessVehicle = require('../models/BusinessVehicle');
const WasteCollectionRequest = require('../models/WasteCollectionRequest');
const WasteRequest = require('../models/WasteRequest');

// Obtenir les statistiques business
const getBusinessStats = async (req, res) => {
  try {
    console.log('📊 Récupération des statistiques business pour:', req.user.id);
    
    const businessOwnerId = req.user.id;
    const { from, to } = req.query;
    let dateFilter = {};
    if (from || to) {
      const start = from ? new Date(from) : new Date('1970-01-01');
      const end = to ? new Date(to) : new Date();
      dateFilter = { createdAt: { $gte: start, $lte: end } };
    }
    
    // Récupérer les collecteurs business
    const collectors = await BusinessCollector.find({ businessOwnerId }).select('status linkedUserId');
    const linkedCollectorIds = collectors
      .map(c => c.linkedUserId)
      .filter(id => !!id);
    
    // Récupérer les véhicules business
    const vehicles = await BusinessVehicle.find({ businessOwnerId });
    
    // Récupérer les demandes assignées aux collecteurs business (nouveau + legacy)
    // Nouveau modèle
    const [
      totalNew,
      completedNew,
      totalWeightNewAgg
    ] = await Promise.all([
      WasteRequest.countDocuments({ assignedCollector: { $in: linkedCollectorIds }, ...dateFilter }),
      WasteRequest.countDocuments({ assignedCollector: { $in: linkedCollectorIds }, status: 'completed', ...dateFilter }),
      WasteRequest.aggregate([
        { $match: { assignedCollector: { $in: linkedCollectorIds }, status: 'completed', ...(dateFilter.createdAt ? dateFilter : {}) } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$collectionDetails.actualWeight', '$estimatedWeight'] } } } }
      ])
    ]);

    // Legacy modèle
    const [
      totalLegacy,
      completedLegacy,
      totalWeightLegacyAgg
    ] = await Promise.all([
      WasteCollectionRequest.countDocuments({ assignedCollector: { $in: linkedCollectorIds }, ...dateFilter }),
      WasteCollectionRequest.countDocuments({ assignedCollector: { $in: linkedCollectorIds }, status: 'completed', ...dateFilter }),
      WasteCollectionRequest.aggregate([
        { $match: { assignedCollector: { $in: linkedCollectorIds }, status: 'completed', ...(dateFilter.createdAt ? dateFilter : {}) } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$collectedQuantity', '$quantity'] } } } }
      ])
    ]);

    const totalCollections = totalNew + totalLegacy;
    const completedCollections = completedNew + completedLegacy;
    const totalWeight = (totalWeightNewAgg[0]?.total || 0) + (totalWeightLegacyAgg[0]?.total || 0);
    
    // Calculer le temps de réponse moyen (en heures)
    // Calculer le temps de réponse moyen (en heures) sur les 2 modèles
    let averageResponseTime = 0;
    const [completedNewDocs, completedLegacyDocs] = await Promise.all([
      WasteRequest.find({ assignedCollector: { $in: linkedCollectorIds }, status: 'completed', completedAt: { $ne: null } }).select('createdAt completedAt').lean(),
      WasteCollectionRequest.find({ assignedCollector: { $in: linkedCollectorIds }, status: 'completed', completedAt: { $ne: null } }).select('createdAt completedAt').lean()
    ]);
    const completedDocs = [...completedNewDocs, ...completedLegacyDocs];
    if (completedDocs.length > 0) {
      const totalResponseTime = completedDocs.reduce((sum, r) => {
        const created = new Date(r.createdAt).getTime();
        const completed = new Date(r.completedAt).getTime();
        return sum + Math.max(0, (completed - created));
      }, 0);
      averageResponseTime = Math.round(totalResponseTime / completedDocs.length / (1000 * 60 * 60));
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
