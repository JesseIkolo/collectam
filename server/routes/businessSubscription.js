const express = require('express');
const router = express.Router();
const BusinessController = require('../controllers/BusinessController');
const { authenticateToken } = require('../middlewares/auth');
const { body } = require('express-validator');

// Routes for individual business subscriptions (not organization-based)
router.use(authenticateToken);

// Get subscription plans
router.get('/plans', BusinessController.getSubscriptionPlans);

// Subscribe to business plan
router.post('/subscribe', [
    body('planId').isIn(['business-monthly', 'business-quarterly', 'business-yearly'])
], BusinessController.subscribeToBusiness);

// Fleet management routes (for collectam-business users)
router.get('/fleet', BusinessController.getFleet);

// Assign/remove collectors from vehicles
router.post('/fleet/assign-collector', [
    body('vehicleId').isMongoId(),
    body('collectorId').isMongoId()
], BusinessController.assignCollectorToVehicle);

router.delete('/fleet/vehicles/:vehicleId/collector', BusinessController.removeCollectorFromVehicle);

// Account deletion
router.delete('/account', [
    body('password').isLength({ min: 8 })
], BusinessController.deleteAccount);

module.exports = router;
