const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'in-progress', 'completed'],
    default: 'pending'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  wasteType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    min: 0
  },
  description: String,
  media: [{
    url: String,
    type: String
  }],
  scheduledTime: {
    type: Date
  },
  scheduledDate: {
    type: Date
  }
}, {
  timestamps: true
});

collectionSchema.index({ location: '2dsphere' });
collectionSchema.index({ organizationId: 1, status: 1 });
collectionSchema.index({ organizationId: 1, userId: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
