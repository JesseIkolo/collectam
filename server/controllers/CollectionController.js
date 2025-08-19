const Collection = require('../models/Collection');
const MatchingService = require('../services/MatchingService');
const { validationResult } = require('express-validator');

class CollectionController {
  // Handle waste reporting
  async report(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { location, wasteType, media, scheduledTime } = req.body;
      const userId = req.user.id;

      const collection = new Collection({
        userId,
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        },
        wasteType,
        media,
        scheduledTime
      });

      await collection.save();

      // Trigger AI matching for assignment
      await MatchingService.assignCollector(collection._id);

      res.status(201).json({
        success: true,
        message: 'Waste report submitted successfully',
        data: { collection }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Schedule collection
  async schedule(req, res) {
    try {
      const { collectionId, scheduledTime } = req.body;
      const userId = req.user.id;

      const collection = await Collection.findOne({ 
        _id: collectionId, 
        userId 
      });

      if (!collection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found'
        });
      }

      collection.scheduledTime = scheduledTime;
      await collection.save();

      res.json({
        success: true,
        message: 'Collection scheduled successfully',
        data: { collection }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Report collection (alias for report method)
  async reportCollection(req, res) {
    return this.report(req, res);
  }

  // Schedule collection (alias for schedule method)
  async scheduleCollection(req, res) {
    return this.schedule(req, res);
  }

  // Get collection by ID
  async getCollectionById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      let query = { _id: id };
      
      // Regular users can only see their own collections
      if (userRole === 'user') {
        query.userId = userId;
      }

      const collection = await Collection.findOne(query)
        .populate('userId', 'email phone')
        .populate('collectorId', 'email phone');

      if (!collection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found'
        });
      }

      res.json({
        success: true,
        data: { collection }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update collection
  async updateCollection(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updates = req.body;

      const collection = await Collection.findOne({ _id: id, userId });

      if (!collection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found'
        });
      }

      // Only allow certain fields to be updated
      const allowedUpdates = ['scheduledTime', 'status'];
      const filteredUpdates = {};
      
      allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });

      Object.assign(collection, filteredUpdates);
      await collection.save();

      res.json({
        success: true,
        message: 'Collection updated successfully',
        data: { collection }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get collections by status (for collectors/managers)
  async getCollectionsByStatus(req, res) {
    try {
      const { status } = req.params;
      const { page = 1, limit = 10, location } = req.query;

      let query = { status };

      // If location is provided, find nearby collections
      if (location) {
        const [lng, lat] = location.split(',').map(Number);
        query['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: 10000 // 10km radius
          }
        };
      }

      const collections = await Collection.find(query)
        .populate('userId', 'email phone address')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Collection.countDocuments(query);

      res.json({
        success: true,
        data: {
          collections,
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

  // Get user collections
  async getUserCollections(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const query = { userId };
      if (status) query.status = status;

      const collections = await Collection.find(query)
        .populate('collectorId', 'email phone')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Collection.countDocuments(query);

      res.json({
        success: true,
        data: {
          collections,
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

module.exports = new CollectionController();
