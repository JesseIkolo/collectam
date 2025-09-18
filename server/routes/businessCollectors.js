const express = require('express');
const router = express.Router();
const {
  createBusinessCollector,
  getBusinessCollectors,
  getBusinessCollectorById,
  updateBusinessCollector,
  deleteBusinessCollector,
  assignVehicleToCollector
} = require('../controllers/businessCollectorController');
const auth = require('../middlewares/auth');
const { validateBusinessUser } = require('../middlewares/businessValidation');

// Middleware pour vérifier que l'utilisateur est authentifié et est un Business
router.use(auth);
router.use(validateBusinessUser);

// Routes CRUD pour les collecteurs Business
router.post('/', createBusinessCollector);
router.get('/', getBusinessCollectors);
router.get('/:id', getBusinessCollectorById);
router.put('/:id', updateBusinessCollector);
router.delete('/:id', deleteBusinessCollector);

// Route pour assigner un véhicule à un collecteur
router.post('/assign-vehicle', assignVehicleToCollector);

module.exports = router;
