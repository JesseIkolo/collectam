const User = require('../models/User');

// Middleware pour vérifier que l'utilisateur est un Business
const validateBusinessUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (user.userType !== 'collectam-business') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux utilisateurs Business'
      });
    }

    // Ajouter l'utilisateur complet à la requête
    req.user = user;
    next();

  } catch (error) {
    console.error('❌ Erreur validation Business:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation'
    });
  }
};

// Middleware pour vérifier que l'utilisateur a un abonnement actif
const validateActiveSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Vérifier si l'utilisateur a un abonnement
    if (!user.subscription || !user.subscription.planId) {
      return res.status(403).json({
        success: false,
        message: 'Abonnement Business requis pour accéder à cette fonctionnalité'
      });
    }

    // Vérifier si l'abonnement est actif (vous pouvez ajouter plus de logique ici)
    const now = new Date();
    if (user.subscription.endDate && new Date(user.subscription.endDate) < now) {
      return res.status(403).json({
        success: false,
        message: 'Votre abonnement Business a expiré'
      });
    }

    next();

  } catch (error) {
    console.error('❌ Erreur validation abonnement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation de l\'abonnement'
    });
  }
};

module.exports = {
  validateBusinessUser,
  validateActiveSubscription
};
