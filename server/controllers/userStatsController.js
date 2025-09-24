const WasteCollectionRequest = require('../models/WasteCollectionRequest');
const WasteRequest = require('../models/WasteRequest');

// Obtenir les statistiques utilisateur (fusionne ancien et nouveau modèles)
const getUserStats = async (req, res) => {
  try {
    console.log('🏠 Récupération des statistiques utilisateur pour:', req.user._id?.toString?.() || req.user.id);

    const userId = req.user._id || req.user.id;

    // Récupérer les demandes utilisateur dans les deux modèles
    const [newModel, legacyModel] = await Promise.all([
      WasteRequest.find({ userId }),
      WasteCollectionRequest.find({ userId })
    ]);

    // Fusionner et unifier les champs nécessaires
    const allRequests = [
      ...newModel.map(r => ({
        status: r.status,
        // Poids: réel si terminé, sinon estimé
        weight: r.status === 'completed' ? (r.collectionDetails?.actualWeight ?? r.estimatedWeight ?? 0) : (r.estimatedWeight ?? 0)
      })),
      ...legacyModel.map(r => ({
        // Harmoniser les statuts legacy → modèle commun
        status: r.status, // 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
        // Poids: quantité collectée si terminée, sinon quantité estimée
        weight: r.status === 'completed' ? (r.collectedQuantity ?? r.quantity ?? 0) : (r.quantity ?? 0)
      }))
    ];

    const totalRequests = allRequests.length;
    const completedRequests = allRequests.filter(r => r.status === 'completed').length;
    const pendingRequests = allRequests.filter(r => r.status === 'pending').length;
    const totalWeight = allRequests.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);

    // Points (10 points par collecte terminée)
    const pointsEarned = completedRequests * 10;

    // Badges (1 badge tous les 3 collectes terminées)
    const badgesUnlocked = Math.floor(completedRequests / 3);

    // Achievements
    const achievements = [];
    if (completedRequests >= 1) achievements.push({ icon: "🌱", name: "Éco-débutant" });
    if (completedRequests >= 5) achievements.push({ icon: "♻️", name: "Recycleur" });
    if (completedRequests >= 10) achievements.push({ icon: "🌍", name: "Protecteur de l'environnement" });
    if (completedRequests >= 25) achievements.push({ icon: "🏆", name: "Champion du recyclage" });

    const stats = {
      totalRequests,
      completedRequests,
      pendingRequests,
      totalWeight,
      pointsEarned,
      badgesUnlocked,
      achievements,
      carbonFootprintReduced: Math.round(totalWeight * 0.8), // Estimation
      recyclingRate: totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0
    };

    console.log('✅ Statistiques utilisateur calculées (fusion):', stats);
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération statistiques utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

module.exports = {
  getUserStats
};
