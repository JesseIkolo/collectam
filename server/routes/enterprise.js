const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { getEnterpriseStats, getEnterpriseCompliance } = require('../controllers/enterpriseController');

// GET /api/enterprise/stats - Obtenir les statistiques enterprise
router.get('/stats', 
  authenticateToken,
  getEnterpriseStats
);

// GET /api/enterprise/compliance - Obtenir les données de conformité
router.get('/compliance', 
  authenticateToken,
  getEnterpriseCompliance
);

module.exports = router;
