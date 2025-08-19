const User = require('../models/User');
const AuthService = require('../services/AuthService');
const { validationResult } = require('express-validator');

class UserController {
  // Handle user signup
  async signup(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { email, password, phone, role = 'user' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Create new user
      const user = new User({
        email,
        password,
        phone,
        role
      });

      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = await AuthService.generateTokens(user);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            points: user.points,
            subscription: user.subscription
          },
          accessToken
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Handle user login
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = await AuthService.generateTokens(user);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            points: user.points,
            subscription: user.subscription
          },
          accessToken
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Handle subscription upgrade
  async upgradeSubscription(req, res) {
    try {
      const { plan } = req.body;
      const userId = req.user.id;

      if (!['basic', 'premium'].includes(plan)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subscription plan'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update subscription
      user.subscription.plan = plan;
      user.subscription.expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await user.save();

      res.json({
        success: true,
        message: `Subscription upgraded to ${plan}`,
        data: {
          subscription: user.subscription
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
