const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const MapController = require('../controllers/MapController');

/**
 * @swagger
 * /api/map/collectors:
 *   get:
 *     summary: Get active collectors in the area
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active collectors
 */
router.get('/collectors', 
  authenticateToken,
  MapController.getActiveCollectors
);

/**
 * @swagger
 * /api/map/active-collectors:
 *   get:
 *     summary: Get active collectors (alias for /collectors)
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active collectors
 */
router.get('/active-collectors', 
  authenticateToken,
  MapController.getActiveCollectors
);

/**
 * @swagger
 * /api/map/collections:
 *   get:
 *     summary: Get nearby waste collections
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of nearby collections
 */
router.get('/collections',
  authenticateToken,
  MapController.getNearbyCollections
);

/**
 * @swagger
 * /api/map/collectors/{id}:
 *   get:
 *     summary: Get collector details by ID
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Collector details
 */
router.get('/collectors/:id',
  authenticateToken,
  MapController.getCollectorDetails
);

/**
 * @swagger
 * /api/map/collections/{id}/track:
 *   get:
 *     summary: Track a specific collection
 *     tags: [Map]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Collection tracking data
 */
router.get('/collections/:id/track',
  authenticateToken,
  MapController.trackCollection
);

module.exports = router;
