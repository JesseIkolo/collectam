const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
  // Generate JWT tokens
  async generateTokens(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15m', algorithm: 'HS256' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d', algorithm: 'HS256' }
    );

    // Store refresh token in user document if supported
    if (typeof user.addRefreshToken === 'function') {
      await user.addRefreshToken(refreshToken);
    }

    return { accessToken, refreshToken };
  }

  // Verify JWT token
  verifyToken(token, secret = process.env.JWT_SECRET) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate secure random token
  generateSecureToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash password with bcrypt (handled in User model)
  // Verify password (handled in User model)

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

      const User = require('../models/User');
      const user = await User.findById(decoded.id);

      if (!user || !user.security.refreshTokens.includes(refreshToken)) {
        throw new Error('Invalid refresh token');
      }

      // Generate new access token
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role
      };

      const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '15m', algorithm: 'HS256' }
      );

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Revoke refresh token
  async revokeRefreshToken(userId, refreshToken) {
    const User = require('../models/User');
    const user = await User.findById(userId);

    if (user) {
      await user.removeRefreshToken(refreshToken);
    }
  }
}

module.exports = new AuthService();
