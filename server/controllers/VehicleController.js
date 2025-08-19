const Vehicle = require('../models/Vehicle');
const { validationResult } = require('express-validator');

class VehicleController {
  // Register new vehicle (alias)
  async registerVehicle(req, res) {
    return this.register(req, res);
  }

  // Get all vehicles
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

  // Get collector vehicles
  async getCollectorVehicles(req, res) {
    try {
      const collectorId = req.user.id;

      const vehicles = await Vehicle.find({ collectorId });

      res.json({
        success: true,
        data: { vehicles }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new VehicleController();
