const express = require('express');
const router = express.Router();
const {
  createBusinessVehicle,
  getBusinessVehicles,
  getBusinessVehicleById,
  updateBusinessVehicle,
  deleteBusinessVehicle,
  assignCollectorToVehicle
} = require('../controllers/businessVehicleController');
const { authenticateToken } = require('../middlewares/auth');
const { validateBusinessUser } = require('../middlewares/businessValidation');

// Middleware pour vérifier que l'utilisateur est authentifié et est un Business
router.use(authenticateToken);
router.use(validateBusinessUser);

// Routes CRUD pour les véhicules Business
router.post('/', createBusinessVehicle);
router.get('/', getBusinessVehicles);
router.get('/:id', getBusinessVehicleById);
router.put('/:id', updateBusinessVehicle);
router.delete('/:id', deleteBusinessVehicle);

// Route pour assigner un collecteur à un véhicule
router.post('/assign-collector', assignCollectorToVehicle);

module.exports = router;
