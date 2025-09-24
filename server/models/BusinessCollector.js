const mongoose = require('mongoose');

const businessCollectorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true,
    default: 'Collecteur'
  },
  // Référence vers l'entreprise Business qui a créé ce collecteur
  businessOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Lien vers le compte Collectam du collecteur (User)
  linkedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Statut du collecteur
  status: {
    type: String,
    enum: ['actif', 'inactif', 'suspendu'],
    default: 'actif'
  },
  // Date d'embauche
  hireDate: {
    type: Date,
    default: Date.now
  },
  // Véhicule assigné (optionnel)
  assignedVehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessVehicle'
  },
  // Zone d'intervention
  workZone: {
    type: String,
    trim: true
  },
  // Informations de contact d'urgence
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  // Adresse du collecteur
  address: {
    city: String,
    region: String,
    country: {
      type: String,
      default: 'Cameroun'
    }
  },
  // Informations professionnelles
  workSchedule: {
    startTime: String,
    endTime: String,
    workDays: [{
      type: String,
      enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
    }]
  },
  // Salaire (optionnel)
  salary: {
    amount: Number,
    currency: {
      type: String,
      default: 'XOF'
    },
    paymentFrequency: {
      type: String,
      enum: ['horaire', 'journalier', 'hebdomadaire', 'mensuel'],
      default: 'mensuel'
    }
  },
  // Documents
  documents: {
    photo: String,
    cni: String,
    cv: String,
    contrat: String
  },
  // Vérification
  isVerified: {
    type: Boolean,
    default: false
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
businessCollectorSchema.index({ businessOwnerId: 1, status: 1 });
businessCollectorSchema.index({ email: 1 });
businessCollectorSchema.index({ employeeId: 1, businessOwnerId: 1 });
businessCollectorSchema.index({ assignedVehicleId: 1 });
businessCollectorSchema.index({ linkedUserId: 1, businessOwnerId: 1 });

// Méthode pour obtenir le nom complet
businessCollectorSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Méthode pour vérifier si le collecteur est disponible
businessCollectorSchema.methods.isAvailable = function() {
  return this.status === 'actif' && !this.assignedVehicleId;
};

module.exports = mongoose.model('BusinessCollector', businessCollectorSchema);
