const express = require('express');
const router = express.Router();
const BusinessController = require('../controllers/BusinessController');
const { authenticateToken } = require('../middlewares/auth');
const { requireOrgScope } = require('../middlewares/orgScope');
const { body } = require('express-validator');

// Business dashboard routes (org_admin only)
router.use(authenticateToken, requireOrgScope);

// Get dashboard overview
router.get('/dashboard', BusinessController.getDashboard);

// Get collectors with stats
router.get('/collectors', BusinessController.getCollectors);

// Get vehicles with stats
router.get('/vehicles', BusinessController.getVehicles);

// Get pending collections
router.get('/collections/pending', BusinessController.getPendingCollections);

// Organization settings
router.get('/settings', BusinessController.getOrgSettings);
router.patch('/settings',
    [
        body('autoAssignEnabled').optional().isBoolean(),
        body('autoAssignRadiusMeters').optional().isFloat({ min: 100, max: 50000 }),
        body('maxActiveMissionsPerCollector').optional().isInt({ min: 1, max: 50 })
    ],
    BusinessController.updateOrgSettings
);

// Analytics
router.get('/analytics/kpis', BusinessController.getAnalyticsKpis);
router.get('/analytics/collectors', BusinessController.getCollectorPerformance);
router.get('/analytics/exports/missions.csv', BusinessController.exportMissionsCsv);

// Webhooks management
router.get('/webhooks', BusinessController.listWebhooks);
router.post('/webhooks', [
    body('url').isURL(),
    body('events').optional().isArray(),
    body('secret').optional().isString()
], BusinessController.createWebhook);
router.put('/webhooks/:index', [
    body('url').optional().isURL(),
    body('events').optional().isArray(),
    body('secret').optional().isString(),
    body('enabled').optional().isBoolean()
], BusinessController.updateWebhook);
router.delete('/webhooks/:index', BusinessController.deleteWebhook);

// Billing
router.get('/billing/plans', BusinessController.listPlans);
router.get('/billing/estimate', BusinessController.estimateInvoice);

module.exports = router;
