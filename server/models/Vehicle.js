const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  vehicleType: {
    type: String,
    enum: ['camion', 'camionnette', 'moto', 'velo', 'tricycle'],
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  assignedCollectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  status: {
    type: String,
    enum: ['actif', 'inactif', 'maintenance', 'hors_service'],
    default: 'actif'
  },
  fuelLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  documents: {
    carteGrise: String,
    assurance: String,
    controletechnique: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

vehicleSchema.index({ ownerId: 1, status: 1 });
vehicleSchema.index({ organizationId: 1, assignedCollectorId: 1 });
vehicleSchema.index({ licensePlate: 1 }, { unique: true });
vehicleSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vehicle', vehicleSchema);
