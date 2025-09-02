const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registration: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  vehicleType: {
    type: String,
    enum: ['truck', 'van', 'motorcycle', 'bicycle'],
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
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  gpsData: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'out_of_service'],
    default: 'available'
  }
}, {
  timestamps: true
});

vehicleSchema.index({ organizationId: 1, status: 1 });
vehicleSchema.index({ organizationId: 1, collectorId: 1 });
vehicleSchema.index({ registration: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
