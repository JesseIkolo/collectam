const WasteCollectionRequest = require('../models/WasteCollectionRequest');

// Obtenir les statistiques utilisateur
const getUserStats = async (req, res) => {
  try {
    console.log('🏠 Récupération des statistiques utilisateur pour:', req.user.id);
    
    const userId = req.user.id;
    
    // Récupérer les demandes de l'utilisateur
    const wasteRequests = await WasteCollectionRequest.find({ userId });
    
    // Calculer les statistiques
    const totalRequests = wasteRequests.length;
    const completedRequests = wasteRequests.filter(r => r.status === 'completed').length;
    const totalWeight = wasteRequests.reduce((sum, r) => sum + (r.estimatedWeight || 0), 0);
    
    // Calculer les points (10 points par collecte terminée)
    const pointsEarned = completedRequests * 10;
    
    // Calculer les badges (1 badge tous les 3 collectes terminées)
    const badgesUnlocked = Math.floor(completedRequests / 3);
    
    // Définir les achievements basés sur les collectes
    const achievements = [];
    if (completedRequests >= 1) {
      achievements.push({ icon: "🌱", name: "Éco-débutant" });
    }
    if (completedRequests >= 5) {
      achievements.push({ icon: "♻️", name: "Recycleur" });
    }
    if (completedRequests >= 10) {
      achievements.push({ icon: "🌍", name: "Protecteur de l'environnement" });
    }
    if (completedRequests >= 25) {
      achievements.push({ icon: "🏆", name: "Champion du recyclage" });
    }
    
    const stats = {
      totalRequests,
      completedRequests,
      pendingRequests: wasteRequests.filter(r => r.status === 'pending').length,
      totalWeight,
      pointsEarned,
      badgesUnlocked,
      achievements,
      carbonFootprintReduced: Math.round(totalWeight * 0.8), // Estimation
      recyclingRate: totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0
    };
    
    console.log('✅ Statistiques utilisateur calculées:', stats);
    
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
