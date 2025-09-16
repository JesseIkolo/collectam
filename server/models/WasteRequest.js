const mongoose = require('mongoose');

const wasteRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wasteType: {
    type: String,
    enum: ['organic', 'plastic', 'paper', 'glass', 'metal', 'electronic', 'hazardous', 'mixed'],
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 10
  },
  estimatedWeight: {
    type: Number,
    required: true,
    min: 0.1
  },
  address: {
    type: String,
    required: true,
    minlength: 5
  },
  coordinates: {
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
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelReason: {
    type: String
  },
  collectionDetails: {
    actualWeight: {
      type: Number
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vehicleUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    photos: [{
      url: String,
      description: String
    }]
  }
}, {
  timestamps: true
});

// Index for geospatial queries
wasteRequestSchema.index({ coordinates: '2dsphere' });

// Index for user queries
wasteRequestSchema.index({ userId: 1, status: 1 });

// Index for collector queries
wasteRequestSchema.index({ assignedCollector: 1, status: 1 });

// Virtual for formatted date
wasteRequestSchema.virtual('formattedPreferredDate').get(function() {
  return this.preferredDate.toLocaleDateString('fr-FR');
});

// Method to check if request can be modified
wasteRequestSchema.methods.canBeModified = function() {
  return this.status === 'pending';
};

// Method to check if request can be cancelled
wasteRequestSchema.methods.canBeCancelled = function() {
  return ['pending', 'scheduled'].includes(this.status);
};

// Pre-save middleware to set coordinates if not provided
wasteRequestSchema.pre('save', async function(next) {
  if (this.isModified('address') && (!this.coordinates || !this.coordinates.coordinates || !this.coordinates.coordinates.length)) {
    // In a real implementation, you would geocode the address here
    // For now, we'll set default coordinates for Douala, Cameroon
    this.coordinates = {
      type: 'Point',
      coordinates: [9.7043, 4.0511] // [longitude, latitude] for Douala
    };
  }
  next();
});

module.exports = mongoose.model('WasteRequest', wasteRequestSchema);
