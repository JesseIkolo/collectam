const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/CollectionController');
const { authenticateToken, authorize } = require('../middlewares/auth');
const { collectionReportValidation, collectionScheduleValidation, handleValidationErrors } = require('../middlewares/validation');

// @route   POST api/collections/report
// @desc    Report a new waste collection point
// @access  Private (user)
router.post('/report', authenticateToken, collectionReportValidation, handleValidationErrors, CollectionController.reportCollection);

// @route   POST api/collections/schedule
// @desc    Schedule a collection
// @access  Private (user)
router.post('/schedule', authenticateToken, collectionScheduleValidation, handleValidationErrors, CollectionController.scheduleCollection);

// @route   GET api/collections
// @desc    Get all collections for the logged-in user
// @access  Private (user)
router.get('/', authenticateToken, CollectionController.getUserCollections);

// @route   GET api/collections/:id
// @desc    Get a specific collection by ID
// @access  Private (user, collector, manager)
router.get('/:id', authenticateToken, CollectionController.getCollectionById);

// @route   PUT api/collections/:id
// @desc    Update a collection (e.g., cancel)
// @access  Private (user)
router.put('/:id', authenticateToken, CollectionController.updateCollection);

// @route   GET api/collections/status/:status
// @desc    Get collections by status
// @access  Private (collector, manager)
router.get('/status/:status', authenticateToken, authorize('collector', 'manager', 'admin'), CollectionController.getCollectionsByStatus);

module.exports = router;
