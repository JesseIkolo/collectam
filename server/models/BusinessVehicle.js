const mongoose = require('mongoose');

const businessVehicleSchema = new mongoose.Schema({
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
    min: 0,
    description: 'Capacité en tonnes ou m³'
  },
  vehicleType: {
    type: String,
    enum: ['camion', 'camionnette', 'moto', 'velo', 'tricycle', 'benne', 'compacteur'],
    required: true
  },
  // Référence vers l'entreprise Business propriétaire
  businessOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Collecteur assigné à ce véhicule
  assignedCollectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessCollector'
  },
  // Localisation actuelle
  location: {
    type: { 
      type: String, 
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: function(v) {
          return v.length === 2;
        },
        message: 'Coordinates must be an array of exactly 2 numbers [longitude, latitude]'
      }
    }
  },
  // Statut du véhicule
  status: {
    type: String,
    enum: ['actif', 'inactif', 'maintenance', 'hors_service', 'en_mission'],
    default: 'actif'
  },
  // Informations sur le carburant
  fuelType: {
    type: String,
    enum: ['essence', 'diesel', 'electrique', 'hybride', 'gaz'],
    default: 'diesel'
  },
  fuelLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  // Kilométrage
  mileage: {
    type: Number,
    min: 0,
    default: 0
  },
  // Informations d'achat/location
  acquisitionType: {
    type: String,
    enum: ['achat', 'location', 'leasing'],
    default: 'achat'
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number,
    min: 0
  },
  // Documents obligatoires
  documents: {
    carteGrise: {
      url: String,
      expiryDate: Date
    },
    assurance: {
      url: String,
      expiryDate: Date,
      company: String,
      policyNumber: String
    },
    controletech: {
      url: String,
      expiryDate: Date
    },
    permisConduire: {
      url: String,
      expiryDate: Date
    }
  },
  // Maintenance
  maintenanceHistory: [{
    date: Date,
    type: {
      type: String,
      enum: ['vidange', 'revision', 'reparation', 'controle_technique', 'autre']
    },
    description: String,
    cost: Number,
    garage: String,
    nextMaintenanceDate: Date
  }],
  nextMaintenanceDate: {
    type: Date
  },
  // Zone d'opération
  operationZone: {
    type: String,
    trim: true
  },
  // Équipements spéciaux
  equipment: [{
    name: String,
    description: String,
    serialNumber: String
  }],
  // Informations financières
  monthlyOperatingCost: {
    type: Number,
    min: 0
  },
  // GPS/Tracking
  gpsDevice: {
    deviceId: String,
    isActive: {
      type: Boolean,
      default: false
    }
  },
  // Vérification administrative
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date
  },
  // Notes internes
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
businessVehicleSchema.index({ businessOwnerId: 1, status: 1 });
businessVehicleSchema.index({ licensePlate: 1 }, { unique: true });
businessVehicleSchema.index({ assignedCollectorId: 1 });
businessVehicleSchema.index({ location: '2dsphere' }, { sparse: true });
businessVehicleSchema.index({ vehicleType: 1, status: 1 });
businessVehicleSchema.index({ 'documents.assurance.expiryDate': 1 });
businessVehicleSchema.index({ 'documents.controletech.expiryDate': 1 });
businessVehicleSchema.index({ nextMaintenanceDate: 1 });

// Méthode pour vérifier si le véhicule est disponible
businessVehicleSchema.methods.isAvailable = function() {
  return this.status === 'actif' && !this.assignedCollectorId;
};

// Méthode pour vérifier si les documents sont à jour
businessVehicleSchema.methods.hasValidDocuments = function() {
  const now = new Date();
  const assuranceValid = this.documents.assurance.expiryDate > now;
  const controleValid = this.documents.controletech.expiryDate > now;
  return assuranceValid && controleValid;
};

// Méthode pour calculer l'âge du véhicule
businessVehicleSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.year;
});

// Méthode pour obtenir le statut de maintenance
businessVehicleSchema.methods.getMaintenanceStatus = function() {
  if (!this.nextMaintenanceDate) return 'non_planifie';
  
  const now = new Date();
  const daysUntilMaintenance = Math.ceil((this.nextMaintenanceDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilMaintenance < 0) return 'en_retard';
  if (daysUntilMaintenance <= 7) return 'urgent';
  if (daysUntilMaintenance <= 30) return 'bientot';
  return 'ok';
};

module.exports = mongoose.model('BusinessVehicle', businessVehicleSchema);
