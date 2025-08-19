const Mission = require('../models/Mission');
const Collection = require('../models/Collection');
const QRCodeMiddleware = require('../middlewares/qrcode');
const { validationResult } = require('express-validator');

class MissionController {
  // Assign mission to collector (alias for assign)
  async assignMission(req, res) {
    return this.assign(req, res);
  }

  // Assign mission to collector
  async assign(req, res) {
    try {
      const { collectionId, vehicleId } = req.body;
      const collectorId = req.user.id;

      const collection = await Collection.findById(collectionId);
      if (!collection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found'
        });
      }

      // Generate QR code for validation
      const qrResult = await QRCodeMiddleware.generateMissionQR(
        null, // missionId will be set after save
        collectionId
      );
      
      if (!qrResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to generate QR code'
        });
      }

      const mission = new Mission({
        collectionId,
        collectorId,
        vehicleId,
        qrCode: qrResult.qrCode
      });

      await mission.save();

      // Update collection status
      collection.collectorId = collectorId;
      collection.status = 'in-progress';
      await collection.save();

      res.status(201).json({
        success: true,
        message: 'Mission assigned successfully',
        data: { mission }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Validate mission with QR code (alias)
  async validateMission(req, res) {
    return this.validate(req, res);
  }

  // Get collector missions
  async getCollectorMissions(req, res) {
    try {
      const collectorId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      let query = { collectorId };
      if (status) query.status = status;

      const missions = await Mission.find(query)
        .populate('collectionId', 'location wasteType scheduledTime')
        .populate('vehicleId', 'registration')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Mission.countDocuments(query);

      res.json({
        success: true,
        data: {
          missions,
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

  // Get mission by ID
  async getMissionById(req, res) {
    try {
      const { id } = req.params;
      const userRole = req.user.role;
      const userId = req.user.id;

      let query = { _id: id };
      
      // Collectors can only see their own missions
      if (userRole === 'collector') {
        query.collectorId = userId;
      }

      const mission = await Mission.findOne(query)
        .populate('collectionId')
        .populate('collectorId', 'email phone')
        .populate('vehicleId');

      if (!mission) {
        return res.status(404).json({
          success: false,
          message: 'Mission not found'
        });
      }

      res.json({
        success: true,
        data: { mission }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update mission status
  async updateMissionStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const collectorId = req.user.id;

      const mission = await Mission.findOne({ _id: id, collectorId });

      if (!mission) {
        return res.status(404).json({
          success: false,
          message: 'Mission not found'
        });
      }

      const validStatuses = ['assigned', 'in-progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      mission.status = status;
      
      if (status === 'in-progress') {
        mission.timestamp.started = new Date();
      } else if (status === 'completed') {
        mission.timestamp.completed = new Date();
      }

      await mission.save();

      res.json({
        success: true,
        message: 'Mission status updated successfully',
        data: { mission }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Validate mission with QR code
  async validate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { qrCode, photo } = req.body;
      const collectorId = req.user.id;

      const mission = await Mission.findOne({ 
        qrCode, 
        collectorId 
      }).populate('collectionId');

      if (!mission) {
        return res.status(404).json({
          success: false,
          message: 'Mission not found or invalid QR code'
        });
      }

      // Validate QR code
      const qrValidation = QRCodeMiddleware.validateQRCode(qrCode);
      
      if (!qrValidation.success) {
        return res.status(400).json({
          success: false,
          message: qrValidation.error
        });
      }


      // Update mission status
      mission.status = 'completed';
      mission.timestamp.completed = new Date();
      await mission.save();

      // Update collection status
      const collection = await Collection.findById(mission.collectionId._id);
      collection.status = 'completed';
      await collection.save();

      res.json({
        success: true,
        message: 'Mission validated and completed successfully',
        data: { mission }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get collector missions
  async getCollectorMissions(req, res) {
    try {
      const collectorId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const query = { collectorId };
      if (status) query.status = status;

      const missions = await Mission.find(query)
        .populate('collectionId')
        .populate('vehicleId')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Mission.countDocuments(query);

      res.json({
        success: true,
        data: {
          missions,
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
}

module.exports = new MissionController();
