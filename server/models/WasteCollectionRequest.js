const mongoose = require('mongoose');

const wasteCollectionRequestSchema = new mongoose.Schema({
  // Informations utilisateur
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['menage', 'entreprise', 'collecteur', 'collectam-business'],
    required: true
  },
  companyName: {
    type: String,
    trim: true
  },
  requestedBy: {
    type: String,
    required: true,
    trim: true
  },
  
  // Détails de la demande
  wasteType: {
    type: String,
    required: true,
    enum: [
      'Papier/Carton',
      'Plastique', 
      'Verre',
      'Métal',
      'Organique',
      'Électronique',
      'Textile',
      'Bois',
      'Déchets Dangereux',
      'Encombrants',
      'Autre'
    ]
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'tonnes', 'litres', 'unités', 'sacs', 'cartons', 'm³']
  },
  urgency: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Planification
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  
  // Localisation
  address: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    index: '2dsphere'
  },
  
  // Informations supplémentaires
  description: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  specialInstructions: {
    type: String,
    trim: true
  },
  
  // Statut et suivi
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Assignation
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: {
    type: Date
  },
  
  // Collecte
  actualCollectionDate: {
    type: Date
  },
  collectedQuantity: {
    type: Number
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Coûts
  estimatedCost: {
    type: Number,
    min: 0
  },
  actualCost: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'XOF'
  },
  
  // Photos et documents
  photos: [{
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Historique des statuts
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled']
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: String
  }],
  
  // Évaluation
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    trim: true
  },
  
  // Métadonnées
  priority: {
    type: Number,
    default: 0 // Plus élevé = plus prioritaire
  },
  tags: [String],
  
  // Récurrence (pour les demandes régulières)
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly']
    },
    interval: Number, // Tous les X jours/semaines/mois
    endDate: Date
  },
  parentRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteCollectionRequest'
  }
}, {
  timestamps: true
});

// Index pour les recherches géospatiales
wasteCollectionRequestSchema.index({ coordinates: '2dsphere' });

// Index pour les recherches par utilisateur
wasteCollectionRequestSchema.index({ userId: 1, status: 1 });

// Index pour les recherches par collecteur
wasteCollectionRequestSchema.index({ assignedCollector: 1, status: 1 });

// Index pour les recherches par date
wasteCollectionRequestSchema.index({ preferredDate: 1, status: 1 });

// Index pour les recherches par type de déchet
wasteCollectionRequestSchema.index({ wasteType: 1, status: 1 });

// Middleware pour ajouter l'historique des statuts
wasteCollectionRequestSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date()
    });
  }
  next();
});

// Méthodes d'instance
wasteCollectionRequestSchema.methods.updateStatus = function(newStatus, changedBy, note) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy: changedBy,
    note: note
  });
  return this.save();
};

wasteCollectionRequestSchema.methods.assignCollector = function(collectorId) {
  this.assignedCollector = collectorId;
  this.assignedAt = new Date();
  this.status = 'assigned';
  return this.save();
};

wasteCollectionRequestSchema.methods.markCompleted = function(collectedQuantity, actualCost, collectedBy) {
  this.status = 'completed';
  this.actualCollectionDate = new Date();
  this.collectedQuantity = collectedQuantity;
  this.actualCost = actualCost;
  this.collectedBy = collectedBy;
  return this.save();
};

// Méthodes statiques
wasteCollectionRequestSchema.statics.findByUser = function(userId, status = null) {
  const query = { userId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

wasteCollectionRequestSchema.statics.findByCollector = function(collectorId, status = null) {
  const query = { assignedCollector: collectorId };
  if (status) query.status = status;
  return this.find(query).sort({ preferredDate: 1 });
};

wasteCollectionRequestSchema.statics.findNearby = function(coordinates, maxDistance = 10000) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    status: { $in: ['pending', 'confirmed'] }
  });
};

module.exports = mongoose.model('WasteCollectionRequest', wasteCollectionRequestSchema);
