const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { validationResult } = require('express-validator');

class VehicleController {
  // Register new vehicle with limit check
  async registerVehicle(req, res) {
    try {
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Erreurs de validation:', errors.array());
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { licensePlate, brand, model, year, capacity, vehicleType } = req.body;
      const ownerId = req.user._id;
      const user = req.user;
      
      console.log('🔑 Owner ID:', ownerId);
      console.log('👥 User type:', user.userType);

      // Check vehicle limit based on user type
      const existingVehicles = await Vehicle.countDocuments({ ownerId });
      console.log('🔢 Véhicules existants:', existingVehicles);
      const maxVehicles = user.userType === 'collectam-business' ? Infinity : 2;
      console.log('📊 Limite max:', maxVehicles);

      if (existingVehicles >= maxVehicles) {
        return res.status(403).json({
          success: false,
          message: `Vous avez atteint la limite de ${maxVehicles} véhicules. Créez un compte Collectam Business pour enregistrer plus de véhicules.`,
          upgrade: user.userType !== 'collectam-business' ? {
            message: 'Créez un compte Collectam Business pour enregistrer plus de véhicules',
            action: 'upgrade_to_business',
            requiresLogout: true
          } : null
        });
      }

      // Check if license plate already exists
      const existingVehicle = await Vehicle.findOne({ licensePlate });
      if (existingVehicle) {
        return res.status(409).json({
          success: false,
          message: 'Un véhicule avec cette plaque d\'immatriculation existe déjà'
        });
      }

      const vehicle = new Vehicle({
        licensePlate,
        brand,
        model,
        year,
        capacity,
        vehicleType,
        ownerId
      });

      console.log('💾 Sauvegarde en cours...');
      await vehicle.save();
      console.log('🎉 Véhicule sauvegardé avec succès');

      res.status(201).json({
        success: true,
        message: 'Véhicule enregistré avec succès',
        data: { 
          vehicle,
          remainingSlots: maxVehicles === Infinity ? 'illimité' : maxVehicles - existingVehicles - 1
        }
      });

    } catch (error) {
      console.error('💥 Erreur dans registerVehicle:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      });
    }
  }

  // Get all vehicles for admin
  async getAllVehicles(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      
      let query = {};
      if (status) query.status = status;

      const vehicles = await Vehicle.find(query)
        .populate('collectorId', 'email phone')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Vehicle.countDocuments(query);

      res.json({
        success: true,
        data: {
          vehicles,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get vehicle by ID
  async getVehicleById(req, res) {
    try {
      const { id } = req.params;

      const vehicle = await Vehicle.findById(id)
        .populate('collectorId', 'email phone');

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        data: { vehicle }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Assign collector to vehicle
  async assignCollector(req, res) {
    try {
      const { id } = req.params;
      const { collectorId } = req.body;

      const vehicle = await Vehicle.findById(id);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      vehicle.collectorId = collectorId;
      await vehicle.save();

      res.json({
        success: true,
        message: 'Collector assigned successfully',
        data: { vehicle }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update GPS location (alias)
  async updateGpsLocation(req, res) {
    return this.updateGPS(req, res);
  }

  // Register new vehicle
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { registration, capacity, groupId } = req.body;
      const collectorId = req.user.id;

      // Check if vehicle already exists
      const existingVehicle = await Vehicle.findOne({ registration });
      if (existingVehicle) {
        return res.status(409).json({
          success: false,
          message: 'Vehicle with this registration already exists'
        });
      }

      const vehicle = new Vehicle({
        registration,
        capacity,
        collectorId,
        groupId
      });

      await vehicle.save();

      res.status(201).json({
        success: true,
        message: 'Vehicle registered successfully',
        data: { vehicle }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update vehicle GPS data
  async updateGPS(req, res) {
    try {
      const { vehicleId } = req.params;
      const { latitude, longitude } = req.body;
      const collectorId = req.user.id;

      const vehicle = await Vehicle.findOne({ 
        _id: vehicleId, 
        collectorId 
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      vehicle.gpsData = {
        latitude,
        longitude,
        lastUpdated: new Date()
      };

      await vehicle.save();

      res.json({
        success: true,
        message: 'GPS data updated successfully',
        data: { vehicle }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get user's vehicles
  async getUserVehicles(req, res) {
    try {
      const ownerId = req.user._id;
      const user = req.user;

      const vehicles = await Vehicle.find({ ownerId }).sort({ createdAt: -1 });
      const maxVehicles = user.userType === 'collectam-business' ? Infinity : 2;

      res.json({
        success: true,
        data: { 
          vehicles,
          limit: {
            current: vehicles.length,
            max: maxVehicles,
            canAddMore: vehicles.length < maxVehicles,
            upgradeRequired: vehicles.length >= 2 && user.userType !== 'collectam-business'
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      });
    }
  }

  // Delete vehicle
  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;

      const vehicle = await Vehicle.findOne({ _id: id, ownerId });
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Véhicule non trouvé'
        });
      }

      await Vehicle.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Véhicule supprimé avec succès'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      });
    }
  }

  // Update vehicle
  async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;
      const { licensePlate, brand, model, year, capacity, vehicleType, status } = req.body;

      const vehicle = await Vehicle.findOne({ _id: id, ownerId });
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Véhicule non trouvé'
        });
      }

      // Check if new license plate already exists (if changed)
      if (licensePlate && licensePlate !== vehicle.licensePlate) {
        const existingVehicle = await Vehicle.findOne({ licensePlate });
        if (existingVehicle) {
          return res.status(409).json({
            success: false,
            message: 'Un véhicule avec cette plaque d\'immatriculation existe déjà'
          });
        }
      }

      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        id,
        { licensePlate, brand, model, year, capacity, vehicleType, status },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Véhicule mis à jour avec succès',
        data: { vehicle: updatedVehicle }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: error.message
      });
    }
  }
}

module.exports = new VehicleController();
