const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { userSignupValidation, userLoginValidation, handleValidationErrors } = require('../middlewares/validation');
const { authenticateToken } = require('../middlewares/auth');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', userSignupValidation, handleValidationErrors, UserController.signup);

// @route   POST api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', userLoginValidation, handleValidationErrors, UserController.login);

// @route   POST api/auth/upgrade
// @desc    Upgrade user subscription
// @access  Private
router.post('/upgrade', authenticateToken, UserController.upgradeSubscription);

module.exports = router;
