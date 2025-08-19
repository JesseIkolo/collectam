const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'assigned'
  },
  qrCode: {
    type: String,
    required: true
  },
  timestamp: {
    assigned: { type: Date, default: Date.now },
    started: Date,
    completed: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mission', missionSchema);
