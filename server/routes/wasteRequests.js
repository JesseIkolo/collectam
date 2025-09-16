const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { authenticateToken } = require('../middlewares/auth');
const WasteRequestController = require('../controllers/WasteRequestController');

// Validation middleware
const wasteRequestValidation = [
  body('wasteType')
    .notEmpty()
    .withMessage('Type de déchet requis')
    .isIn(['organic', 'plastic', 'paper', 'glass', 'metal', 'electronic', 'hazardous', 'mixed'])
    .withMessage('Type de déchet invalide'),
  body('description')
    .isLength({ min: 10 })
    .withMessage('Description doit contenir au moins 10 caractères'),
  body('estimatedWeight')
    .isFloat({ min: 0.1 })
    .withMessage('Poids estimé doit être supérieur à 0'),
  body('address')
    .isLength({ min: 5 })
    .withMessage('Adresse complète requise'),
  body('preferredDate')
    .isISO8601()
    .withMessage('Date invalide'),
  body('preferredTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Heure invalide (format HH:MM)'),
  body('urgency')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Niveau d\'urgence invalide'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes trop longues (max 500 caractères)')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @swagger
 * /api/waste-requests:
 *   get:
 *     summary: Get user's waste requests
 *     tags: [Waste Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of waste requests
 */
router.get('/', 
  authenticateToken,
  WasteRequestController.getWasteRequests
);

/**
 * @swagger
 * /api/waste-requests:
 *   post:
 *     summary: Create a new waste request
 *     tags: [Waste Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wasteType
 *               - description
 *               - estimatedWeight
 *               - address
 *               - preferredDate
 *               - preferredTime
 *               - urgency
 *             properties:
 *               wasteType:
 *                 type: string
 *                 enum: [organic, plastic, paper, glass, metal, electronic, hazardous, mixed]
 *               description:
 *                 type: string
 *                 minLength: 10
 *               estimatedWeight:
 *                 type: number
 *                 minimum: 0.1
 *               address:
 *                 type: string
 *                 minLength: 5
 *               preferredDate:
 *                 type: string
 *                 format: date-time
 *               preferredTime:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               urgency:
 *                 type: string
 *                 enum: [low, medium, high]
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Waste request created successfully
 */
router.post('/',
  authenticateToken,
  wasteRequestValidation,
  handleValidationErrors,
  WasteRequestController.createWasteRequest
);

/**
 * @swagger
 * /api/waste-requests/{id}:
 *   put:
 *     summary: Update a waste request
 *     tags: [Waste Requests]
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
 *         description: Waste request updated successfully
 */
router.put('/:id',
  authenticateToken,
  param('id').isMongoId().withMessage('ID invalide'),
  wasteRequestValidation,
  handleValidationErrors,
  WasteRequestController.updateWasteRequest
);

/**
 * @swagger
 * /api/waste-requests/{id}:
 *   delete:
 *     summary: Delete a waste request
 *     tags: [Waste Requests]
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
 *         description: Waste request deleted successfully
 */
router.delete('/:id',
  authenticateToken,
  param('id').isMongoId().withMessage('ID invalide'),
  handleValidationErrors,
  WasteRequestController.deleteWasteRequest
);

/**
 * @swagger
 * /api/waste-requests/{id}/cancel:
 *   patch:
 *     summary: Cancel a waste request
 *     tags: [Waste Requests]
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
 *         description: Waste request cancelled successfully
 */
router.patch('/:id/cancel',
  authenticateToken,
  param('id').isMongoId().withMessage('ID invalide'),
  handleValidationErrors,
  WasteRequestController.cancelWasteRequest
);

/**
 * @swagger
 * /api/waste-requests/stats:
 *   get:
 *     summary: Get waste request statistics
 *     tags: [Waste Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Waste request statistics
 */
router.get('/stats',
  authenticateToken,
  WasteRequestController.getWasteStats
);

module.exports = router;
