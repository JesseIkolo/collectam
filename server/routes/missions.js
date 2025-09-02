const express = require('express');
const router = express.Router();
const MissionController = require('../controllers/MissionController');
const { authenticateToken } = require('../middlewares/auth');
const { requireOrgScope, scopeToOrganization } = require('../middlewares/orgScope');
const {
    missionValidation,
    missionStatusUpdateValidation,
    missionReassignValidation,
    routeOptimizationValidation,
    handleValidationErrors
} = require('../middlewares/validation');

// Apply organization scoping to all routes
router.use(authenticateToken, requireOrgScope, scopeToOrganization);

// Create new mission (admin/org_admin only)
router.post('/', missionValidation, handleValidationErrors, MissionController.create);

// Get missions with filtering and pagination
router.get('/', MissionController.getMissions);

// Get specific mission
router.get('/:missionId', MissionController.getMission);

// Update mission status (collector can update their own missions)
router.patch('/:missionId/status', missionStatusUpdateValidation, handleValidationErrors, MissionController.updateStatus);

// Assign/reassign mission to collector (admin/org_admin only)
router.patch('/:missionId/assign', missionReassignValidation, handleValidationErrors, MissionController.assignMission);

// Route optimization
router.post('/optimize-route', routeOptimizationValidation, handleValidationErrors, MissionController.optimizeRoute);

module.exports = router;
