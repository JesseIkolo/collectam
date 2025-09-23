const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { validateBusinessUser } = require('../middlewares/businessValidation');
const { getBusinessStats } = require('../controllers/businessStatsController');

// GET /api/business-subscription/stats - Obtenir les statistiques business
router.get('/stats', 
  authenticateToken,
  validateBusinessUser,
  getBusinessStats
);

module.exports = router;
