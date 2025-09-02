const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  status: {
    type: String,
    enum: ['planned', 'assigned', 'in-progress', 'blocked', 'completed', 'cancelled'],
    default: 'planned'
  },
  qrCode: {
    type: String,
    required: true
  },
  proofs: {
    before: {
      photo: String,
      timestamp: Date,
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number]
      }
    },
    after: {
      photo: String,
      timestamp: Date,
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number]
      }
    }
  },
  blockReason: {
    reason: { type: String, enum: ['vehicle_breakdown', 'access_denied', 'collector_unavailable', 'other'] },
    description: String,
    timestamp: Date
  },
  timestamp: {
    assigned: { type: Date },
    started: Date,
    completed: Date,
    cancelled: Date
  },
  reassignmentHistory: [{
    fromCollectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toCollectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, maxlength: 500 },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

missionSchema.index({ organizationId: 1, status: 1 });
missionSchema.index({ organizationId: 1, collectorId: 1 });
missionSchema.index({ organizationId: 1, createdAt: -1 });

module.exports = mongoose.model('Mission', missionSchema);
