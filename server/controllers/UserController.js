const User = require('../models/User');
const AuthService = require('../services/AuthService');

class UserController {

  // Upgrade subscription
  async upgradeSubscription(req, res) {
    try {
      const userId = req.user.id;
      const { plan } = req.body;

      if (!['basic', 'premium'].includes(plan)) {
        return res.status(400).json({ success: false, message: 'Invalid plan' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.subscription.plan = plan;
      user.subscription.expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await user.save();

      res.json({
        success: true,
        message: 'Subscription upgraded successfully',
        data: {
          subscription: user.subscription
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to upgrade subscription',
        error: error.message
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
        error: error.message
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { firstName, lastName, phone, address } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;
      if (address) user.address = address;

      await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }

  // Get notification preferences
  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('preferences');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.json({ success: true, data: { preferences: user.preferences || {} } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch preferences', error: error.message });
    }
  }

  // Update notification preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const { sms, email, push } = req.body?.notifications || {};
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.preferences = user.preferences || { notifications: {} };
      if (typeof sms === 'boolean') user.preferences.notifications.sms = sms;
      if (typeof email === 'boolean') user.preferences.notifications.email = email;
      if (typeof push === 'boolean') user.preferences.notifications.push = push;
      await user.save();
      res.json({ success: true, message: 'Preferences updated', data: { preferences: user.preferences } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update preferences', error: error.message });
    }
  }

  // Collector: toggle on-duty status
  async toggleDuty(req, res) {
    try {
      const userId = req.user.id;
      const { onDuty } = req.body;

      if (typeof onDuty !== 'boolean') {
        return res.status(400).json({ success: false, message: 'onDuty must be boolean' });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (user.role !== 'collector') return res.status(403).json({ success: false, message: 'Only collectors can toggle duty' });

      user.onDuty = onDuty;
      user.lastSeenAt = new Date();
      await user.save();

      res.json({ success: true, message: 'Duty status updated', data: { onDuty: user.onDuty } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update duty', error: error.message });
    }
  }

  // Collector: heartbeat with location
  async heartbeat(req, res) {
    try {
      const userId = req.user.id;
      const { coordinates } = req.body; // [lng, lat]

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (user.role !== 'collector') return res.status(403).json({ success: false, message: 'Only collectors can send heartbeat' });

      if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
        user.lastLocation = { type: 'Point', coordinates };
      }
      user.lastSeenAt = new Date();
      await user.save();

      res.json({ success: true, message: 'Heartbeat received' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to record heartbeat', error: error.message });
    }
  }
}

module.exports = new UserController();
