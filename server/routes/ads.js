const express = require('express');
const router = express.Router();
const AdController = require('../controllers/AdController');
const { authenticateToken, authorize, optionalAuth } = require('../middlewares/auth');
const { adCreationValidation, handleValidationErrors } = require('../middlewares/validation');

// @route   POST api/ads/create
// @desc    Create a new advertisement
// @access  Private (admin, advertiser)
router.post('/create', authenticateToken, authorize('admin'), adCreationValidation, handleValidationErrors, AdController.createAd);

// @route   GET api/ads
// @desc    Get targeted ads for user
// @access  Public (with optional auth for targeting)
router.get('/', optionalAuth, AdController.getTargetedAds);

// @route   GET api/ads/:id
// @desc    Get a specific ad by ID
// @access  Public
router.get('/:id', AdController.getAdById);

// @route   POST api/ads/:id/click
// @desc    Track ad click
// @access  Public (with optional auth)
router.post('/:id/click', optionalAuth, AdController.trackAdClick);

// @route   PUT api/ads/:id
// @desc    Update an advertisement
// @access  Private (admin)
router.put('/:id', authenticateToken, authorize('admin'), AdController.updateAd);

// @route   DELETE api/ads/:id
// @desc    Delete an advertisement
// @access  Private (admin)
router.delete('/:id', authenticateToken, authorize('admin'), AdController.deleteAd);

// @route   GET api/ads/analytics/:id
// @desc    Get ad analytics
// @access  Private (admin)
router.get('/analytics/:id', authenticateToken, authorize('admin'), AdController.getAdAnalytics);

module.exports = router;
