const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registration: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  gpsData: {
    latitude: Number,
    longitude: Number,
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
