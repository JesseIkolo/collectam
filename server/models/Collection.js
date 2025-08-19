const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
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
  media: [{
    url: String,
    type: String
  }],
  scheduledTime: {
    type: Date
  }
}, {
  timestamps: true
});

collectionSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Collection', collectionSchema);
