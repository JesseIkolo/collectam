const express = require('express');
const router = express.Router();
const WaitlistController = require('../controllers/WaitlistController');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation');
const { authenticateToken } = require('../middlewares/auth');

// Validation middleware for waitlist submission
const waitlistValidation = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('phoneNumber')
        .optional()
        .trim()
        .isMobilePhone()
        .withMessage('Valid phone number is required'),
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
    body('userType')
        .isIn(['menage', 'collecteur', 'collectam-business', 'entreprise'])
        .withMessage('User type must be one of: menage, collecteur, collectam-business, entreprise')
];

/**
 * @swagger
 * /api/waitlist:
 *   post:
 *     summary: Add user to waitlist
 *     tags: [Waitlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - message
 *               - userType
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Jean"
 *               lastName:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@email.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "+33123456789"
 *               message:
 *                 type: string
 *                 example: "Je suis intéressé par vos services de collecte"
 *               userType:
 *                 type: string
 *                 enum: [menage, collecteur, collectam-business, entreprise]
 *                 example: "menage"
 *     responses:
 *       201:
 *         description: Successfully added to waitlist
 *       400:
 *         description: Validation error or email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', waitlistValidation, handleValidationErrors, WaitlistController.addToWaitlist);

/**
 * @swagger
 * /api/waitlist:
 *   get:
 *     summary: Get waitlist entries (Admin only)
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: userType
 *         schema:
 *           type: string
 *           enum: [menage, collecteur, collectam-business, entreprise]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, contacted, converted, rejected]
 *     responses:
 *       200:
 *         description: Waitlist entries retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, WaitlistController.getWaitlist);

/**
 * @swagger
 * /api/waitlist/{id}/status:
 *   patch:
 *     summary: Update waitlist entry status (Admin only)
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, contacted, converted, rejected]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Waitlist entry not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/status', authenticateToken, WaitlistController.updateWaitlistStatus);

module.exports = router;
