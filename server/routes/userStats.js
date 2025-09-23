const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { getUserStats } = require('../controllers/userStatsController');

// GET /api/user/stats - Obtenir les statistiques utilisateur
router.get('/stats', 
  authenticateToken,
  getUserStats
);

module.exports = router;
