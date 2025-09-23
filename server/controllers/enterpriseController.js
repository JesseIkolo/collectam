const User = require('../models/User');
const WasteCollectionRequest = require('../models/WasteCollectionRequest');

// Obtenir les statistiques enterprise
const getEnterpriseStats = async (req, res) => {
  try {
    console.log('🏢 Récupération des statistiques enterprise pour:', req.user.id);
    
    const userId = req.user.id;
    
    // Récupérer les demandes de l'entreprise
    const wasteRequests = await WasteCollectionRequest.find({ userId });
    
    // Calculer les statistiques de base
    const totalVolume = wasteRequests.reduce((sum, r) => sum + (r.estimatedWeight || 0), 0);
    const monthlyVolume = wasteRequests
      .filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, r) => sum + (r.estimatedWeight || 0), 0);
    
    // Estimation des économies (2.5 XOF par kg)
    const costSavings = Math.round(totalVolume * 2.5);
    
    const stats = {
      employees: 1, // À étendre avec les vraies données
      sites: 1, // À étendre avec les vraies données
      totalVolume,
      monthlyVolume,
      costSavings,
      totalRequests: wasteRequests.length,
      completedRequests: wasteRequests.filter(r => r.status === 'completed').length
    };
    
    console.log('✅ Statistiques enterprise calculées:', stats);
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération statistiques enterprise:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// Obtenir les données de conformité
const getEnterpriseCompliance = async (req, res) => {
  try {
    console.log('📋 Récupération des données de conformité pour:', req.user.id);
    
    const userId = req.user.id;
    
    // Récupérer les demandes de l'entreprise
    const wasteRequests = await WasteCollectionRequest.find({ userId });
    
    // Calculer le taux de recyclage basé sur les types de déchets
    const wasteTypeCounts = wasteRequests.reduce((acc, req) => {
      const type = req.wasteType || 'general';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const totalRequests = wasteRequests.length;
    const recyclableTypes = ['plastic', 'paper', 'glass', 'metal'];
    const recyclableCount = recyclableTypes.reduce((sum, type) => sum + (wasteTypeCounts[type] || 0), 0);
    const recyclingRate = totalRequests > 0 ? Math.round((recyclableCount / totalRequests) * 100) : 0;
    
    // Score de conformité basé sur les collectes terminées et le taux de recyclage
    const completedRate = totalRequests > 0 ? 
      (wasteRequests.filter(r => r.status === 'completed').length / totalRequests) * 100 : 0;
    const complianceScore = Math.round((completedRate * 0.6) + (recyclingRate * 0.4));
    
    const compliance = {
      recyclingRate,
      complianceScore: Math.min(100, complianceScore),
      certifications: [] // À étendre avec les vraies certifications
    };
    
    console.log('✅ Données de conformité calculées:', compliance);
    
    res.json({
      success: true,
      data: compliance
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération conformité enterprise:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données de conformité',
      error: error.message
    });
  }
};

module.exports = {
  getEnterpriseStats,
  getEnterpriseCompliance
};
