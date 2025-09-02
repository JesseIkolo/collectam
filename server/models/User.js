const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['user', 'collector', 'org_admin', 'admin'],
    default: 'user'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  // Realtime availability/state for collectors
  onDuty: {
    type: Boolean,
    default: false
  },
  lastLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  lastSeenAt: {
    type: Date
  },
  points: {
    type: Number,
    default: 0
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic'
    },
    expiry: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  },
  preferences: {
    notifications: {
      sms: { type: Boolean, default: false },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false }
    }
  },
  security: {
    refreshTokens: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add refresh token to user's security store
userSchema.methods.addRefreshToken = async function (token) {
  if (!this.security) {
    this.security = { refreshTokens: [] };
  }
  if (!Array.isArray(this.security.refreshTokens)) {
    this.security.refreshTokens = [];
  }
  this.security.refreshTokens.push(token);
  await this.save();
};

// Remove refresh token from user's security store
userSchema.methods.removeRefreshToken = async function (token) {
  if (!this.security || !Array.isArray(this.security.refreshTokens)) return;
  this.security.refreshTokens = this.security.refreshTokens.filter(t => t !== token);
  await this.save();
};

// Index for organization scoping
userSchema.index({ organizationId: 1, role: 1 });

module.exports = mongoose.model('User', userSchema);
