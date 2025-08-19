const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/VehicleController');
const { authenticateToken, authorize } = require('../middlewares/auth');
const { vehicleRegistrationValidation, handleValidationErrors } = require('../middlewares/validation');

// @route   POST api/vehicles/register
// @desc    Register a new vehicle
// @access  Private (manager, admin)
router.post('/register', authenticateToken, authorize('manager', 'admin'), vehicleRegistrationValidation, handleValidationErrors, VehicleController.register);

// @route   GET api/vehicles
// @desc    Get all vehicles
// @access  Private (manager, admin)
router.get('/', authenticateToken, authorize('manager', 'admin'), VehicleController.getAllVehicles);

// @route   GET api/vehicles/:id
// @desc    Get a specific vehicle by ID
// @access  Private (manager, admin)
router.get('/:id', authenticateToken, authorize('manager', 'admin'), VehicleController.getVehicleById);

// @route   PUT api/vehicles/:id/assign
// @desc    Assign a collector to a vehicle
// @access  Private (manager, admin)
router.put('/:id/assign', authenticateToken, authorize('manager', 'admin'), VehicleController.assignCollector);

// @route   POST api/vehicles/:id/gps
// @desc    Update vehicle GPS location
// @access  Private (collector)
router.post('/:id/gps', authenticateToken, authorize('collector'), VehicleController.updateGpsLocation);

module.exports = router;
