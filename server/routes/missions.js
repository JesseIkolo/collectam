const express = require('express');
const router = express.Router();
const MissionController = require('../controllers/MissionController');
const { authenticateToken, authorize } = require('../middlewares/auth');
const { missionValidation, handleValidationErrors } = require('../middlewares/validation');

// @route   POST api/missions/assign
// @desc    Assign a collection to a collector
// @access  Private (manager, admin)
router.post('/assign', authenticateToken, authorize('manager', 'admin'), missionValidation, handleValidationErrors, MissionController.assignMission);

// @route   POST api/missions/validate
// @desc    Validate a mission with QR code
// @access  Private (collector)
router.post('/validate', authenticateToken, authorize('collector'), MissionController.validateMission);

// @route   GET api/missions/collector
// @desc    Get all missions for the logged-in collector
// @access  Private (collector)
router.get('/collector', authenticateToken, authorize('collector'), MissionController.getCollectorMissions);

// @route   GET api/missions/:id
// @desc    Get a specific mission by ID
// @access  Private (collector, manager, admin)
router.get('/:id', authenticateToken, authorize('collector', 'manager', 'admin'), MissionController.getMissionById);

// @route   PUT api/missions/:id/status
// @desc    Update mission status
// @access  Private (collector)
router.put('/:id/status', authenticateToken, authorize('collector'), MissionController.updateMissionStatus);

module.exports = router;
