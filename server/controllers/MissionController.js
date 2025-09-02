const Mission = require('../models/Mission');
const Collection = require('../models/Collection');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const MatchingService = require('../services/MatchingService');
const WebSocketService = require('../services/WebSocketService');
const WebhookService = require('../services/WebhookService');
const NotificationService = require('../services/NotificationService');

class MissionController {
  // Create a new mission
  async create(req, res) {
    try {
      const { collectionId, collectorId, vehicleId } = req.body;
      const organizationId = req.user.organizationId || req.body.organizationId;

      if (!organizationId) {
        return res.status(400).json({ success: false, message: 'Organization ID required' });
      }

      // Verify collection exists and belongs to organization
      const collection = await Collection.findById(collectionId);
      if (!collection) {
        return res.status(404).json({ success: false, message: 'Collection not found' });
      }

      let finalCollectorId = collectorId;

      // Auto-assignment if enabled and no collector provided
      if (!finalCollectorId && process.env.ENABLE_AUTO_ASSIGN === 'true') {
        const assign = await MatchingService.assignCollector(collectionId, organizationId);
        if (assign.success && assign.recommendedCollector) {
          finalCollectorId = assign.recommendedCollector._id;
        }
      }

      // Verify collector belongs to organization (if set)
      if (finalCollectorId) {
        const collector = await User.findOne({ _id: finalCollectorId, organizationId });
        if (!collector) {
          return res.status(404).json({ success: false, message: 'Collector not found' });
        }
      }

      // Verify vehicle belongs to organization
      if (vehicleId) {
        const vehicle = await Vehicle.findOne({ _id: vehicleId, organizationId });
        if (!vehicle) {
          return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
      }

      const mission = await Mission.create({
        collectionId,
        organizationId,
        collectorId: finalCollectorId,
        vehicleId,
        status: finalCollectorId ? 'assigned' : 'planned',
        qrCode: `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });

      // Realtime notifications
      if (finalCollectorId) {
        WebSocketService.broadcastMissionAssignment(organizationId, mission._id, finalCollectorId);
        WebSocketService.broadcastMissionStatusChange(organizationId, mission._id, 'planned', 'assigned');
        WebhookService.emit(organizationId, 'mission.assigned', { missionId: String(mission._id), collectorId: String(finalCollectorId) });
        try { await NotificationService.sendMissionNotification({ phone: '' }, mission, 'assigned'); } catch (_) { }
      } else {
        WebSocketService.broadcastMissionUpdate(organizationId, mission._id, { action: 'created', status: 'planned' });
        WebhookService.emit(organizationId, 'mission.created', { missionId: String(mission._id) });
      }

      res.status(201).json({
        success: true,
        message: finalCollectorId ? 'Mission created and assigned' : 'Mission created (planned)',
        data: { mission }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create mission',
        error: error.message
      });
    }
  }

  // Get missions with organization scoping
  async getMissions(req, res) {
    try {
      const { status, collectorId, page = 1, limit = 10 } = req.query;
      const filter = { ...req.organizationFilter };

      if (status) filter.status = status;
      if (collectorId) filter.collectorId = collectorId;

      const missions = await Mission.find(filter)
        .populate('collectionId', 'location wasteType')
        .populate('collectorId', 'firstName lastName email')
        .populate('vehicleId', 'registration vehicleType')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Mission.countDocuments(filter);

      res.json({
        success: true,
        data: {
          missions,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          total
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch missions',
        error: error.message
      });
    }
  }

  // Update mission status
  async updateStatus(req, res) {
    try {
      const { missionId } = req.params;
      const { status, blockReason, proofs, location } = req.body;

      const mission = await Mission.findOne({ _id: missionId, ...req.organizationFilter });
      if (!mission) {
        return res.status(404).json({ success: false, message: 'Mission not found' });
      }

      // Validate status transitions
      const validTransitions = {
        'planned': ['assigned'],
        'assigned': ['in-progress', 'cancelled'],
        'in-progress': ['blocked', 'completed', 'cancelled'],
        'blocked': ['in-progress', 'cancelled'],
        'completed': [],
        'cancelled': []
      };

      if (!validTransitions[mission.status].includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${mission.status} to ${status}`
        });
      }

      // Update status and timestamps
      mission.status = status;
      if (status === 'in-progress' && !mission.timestamp.started) {
        mission.timestamp.started = new Date();
      } else if (status === 'completed') {
        mission.timestamp.completed = new Date();
      } else if (status === 'cancelled') {
        mission.timestamp.cancelled = new Date();
      }

      // Handle blocking
      if (status === 'blocked' && blockReason) {
        mission.blockReason = {
          reason: blockReason.reason,
          description: blockReason.description,
          timestamp: new Date()
        };
      }

      // Handle proofs
      if (proofs) {
        if (proofs.before) {
          mission.proofs.before = {
            photo: proofs.before.photo,
            timestamp: new Date(),
            location: proofs.before.location || location
          };
        }
        if (proofs.after) {
          mission.proofs.after = {
            photo: proofs.after.photo,
            timestamp: new Date(),
            location: proofs.after.location || location
          };
        }
      }

      await mission.save();

      // Realtime notification for status change
      WebSocketService.broadcastMissionStatusChange(mission.organizationId, mission._id, req.body.oldStatus || 'unknown', status);
      WebhookService.emit(mission.organizationId, 'mission.status_changed', { missionId: String(mission._id), status });
      try { await NotificationService.sendMissionNotification({ phone: '' }, mission, status === 'completed' ? 'completed' : 'reminder'); } catch (_) { }

      res.json({
        success: true,
        message: 'Mission status updated successfully',
        data: { mission }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update mission status',
        error: error.message
      });
    }
  }

  // Assign mission to collector
  async assignMission(req, res) {
    try {
      const { missionId } = req.params;
      const { collectorId, vehicleId, reason } = req.body;

      const mission = await Mission.findOne({ _id: missionId, ...req.organizationFilter });
      if (!mission) {
        return res.status(404).json({ success: false, message: 'Mission not found' });
      }

      if (!['planned', 'assigned'].includes(mission.status)) {
        return res.status(400).json({ success: false, message: 'Mission must be planned or assigned to (re)assign' });
      }

      // Verify collector belongs to organization
      const collector = await User.findOne({ _id: collectorId, organizationId: mission.organizationId });
      if (!collector) {
        return res.status(404).json({ success: false, message: 'Collector not found' });
      }

      // Verify vehicle belongs to organization
      if (vehicleId) {
        const vehicle = await Vehicle.findOne({ _id: vehicleId, organizationId: mission.organizationId });
        if (!vehicle) {
          return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
      }

      const fromCollectorId = mission.collectorId;
      mission.collectorId = collectorId;
      mission.vehicleId = vehicleId;
      mission.status = 'assigned';
      mission.timestamp.assigned = new Date();

      await mission.save();

      // Audit trail
      mission.reassignmentHistory = mission.reassignmentHistory || [];
      mission.reassignmentHistory.push({
        fromCollectorId,
        toCollectorId: collectorId,
        reason,
        actorId: req.user.id,
        createdAt: new Date()
      });
      await mission.save();

      // Realtime notification for assignment
      WebSocketService.broadcastMissionAssignment(mission.organizationId, mission._id, collectorId);
      WebSocketService.broadcastMissionStatusChange(mission.organizationId, mission._id, 'planned', 'assigned');
      WebhookService.emit(mission.organizationId, 'mission.assigned', { missionId: String(mission._id), collectorId: String(collectorId) });
      try { await NotificationService.sendMissionNotification({ phone: '' }, mission, 'assigned'); } catch (_) { }

      res.json({ success: true, message: 'Mission assigned successfully', data: { mission } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to assign mission', error: error.message });
    }
  }

  // Get mission by ID
  async getMission(req, res) {
    try {
      const { missionId } = req.params;

      const mission = await Mission.findOne({ _id: missionId, ...req.organizationFilter })
        .populate('collectionId', 'location wasteType scheduledTime')
        .populate('collectorId', 'firstName lastName email phone')
        .populate('vehicleId', 'registration vehicleType capacity');

      if (!mission) {
        return res.status(404).json({ success: false, message: 'Mission not found' });
      }

      res.json({ success: true, data: { mission } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch mission', error: error.message });
    }
  }

  // Optimize route for a collector over a set of collections
  async optimizeRoute(req, res) {
    try {
      const { collectorId, collectionIds } = req.body;
      const organizationId = req.user.organizationId;

      // Basic org scope checks could be enhanced later
      const collector = await User.findOne({ _id: collectorId, organizationId });
      if (!collector) return res.status(404).json({ success: false, message: 'Collector not found' });

      const result = await MatchingService.optimizeRoute(collectorId, collectionIds);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error || 'Failed to optimize route' });
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to optimize route', error: error.message });
    }
  }
}

module.exports = new MissionController();
