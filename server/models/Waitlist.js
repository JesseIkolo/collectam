const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['menage', 'collecteur', 'collectam-business', 'entreprise'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'converted', 'rejected'],
    default: 'pending'
  },
  source: {
    type: String,
    default: 'contact-form'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
waitlistSchema.index({ email: 1 });
waitlistSchema.index({ userType: 1 });
waitlistSchema.index({ status: 1 });
waitlistSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Waitlist', waitlistSchema);
