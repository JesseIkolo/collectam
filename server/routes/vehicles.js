const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/VehicleController');
const { authenticateToken } = require('../middlewares/auth');
const { body } = require('express-validator');

// Vehicle validation
const vehicleValidation = [
  body('licensePlate').notEmpty().withMessage('Plaque d\'immatriculation requise'),
  body('brand').notEmpty().withMessage('Marque requise'),
  body('model').notEmpty().withMessage('Modèle requis'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Année invalide'),
  body('capacity').isFloat({ min: 0 }).withMessage('Capacité doit être positive'),
  body('vehicleType').isIn(['camion', 'camionnette', 'moto', 'velo', 'tricycle']).withMessage('Type de véhicule invalide')
];

// @route   POST api/vehicles/register
// @desc    Register a new vehicle (with 2 vehicle limit for regular users)
// @access  Private (collector)
router.post('/register', authenticateToken, vehicleValidation, VehicleController.registerVehicle);

// @route   GET api/vehicles/my
// @desc    Get user's vehicles
// @access  Private (collector)
router.get('/my', authenticateToken, VehicleController.getUserVehicles);

// @route   PUT api/vehicles/:id
// @desc    Update user's vehicle
// @access  Private (collector)
router.put('/:id', authenticateToken, vehicleValidation, VehicleController.updateVehicle);

// @route   DELETE api/vehicles/:id
// @desc    Delete user's vehicle
// @access  Private (collector)
router.delete('/:id', authenticateToken, VehicleController.deleteVehicle);

// @route   GET api/vehicles
// @desc    Get all vehicles (admin only)
// @access  Private (admin)
router.get('/', authenticateToken, VehicleController.getAllVehicles);

// @route   GET api/vehicles/:id
// @desc    Get a specific vehicle by ID
// @access  Private
router.get('/:id', authenticateToken, VehicleController.getVehicleById);

module.exports = router;
