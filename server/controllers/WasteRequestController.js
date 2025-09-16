const WasteRequest = require('../models/WasteRequest');
const User = require('../models/User');

/**
 * Get all waste requests for the current user
 */
const getWasteRequests = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    
    const wasteRequests = await WasteRequest.find({ userId })
      .populate('assignedCollector', 'firstName lastName phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: wasteRequests
    });
  } catch (error) {
    console.error('Get waste requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes'
    });
  }
};

/**
 * Create a new waste request
 */
const createWasteRequest = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const {
      wasteType,
      description,
      estimatedWeight,
      address,
      preferredDate,
      preferredTime,
      urgency,
      notes
    } = req.body;

    console.log('Données reçues:', {
      userId,
      wasteType,
      description,
      estimatedWeight,
      address,
      preferredDate,
      preferredTime,
      urgency,
      notes
    });

    const wasteRequest = new WasteRequest({
      userId,
      wasteType,
      description,
      estimatedWeight,
      address,
      preferredDate: new Date(preferredDate),
      preferredTime,
      urgency,
      notes
    });

    console.log('Tentative de sauvegarde...');
    await wasteRequest.save();
    console.log('Sauvegarde réussie!');

    // Populate the user data for response
    await wasteRequest.populate('userId', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Demande de collecte créée avec succès',
      data: wasteRequest
    });
  } catch (error) {
    console.error('Create waste request error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la demande',
      error: error.message
    });
  }
};

/**
 * Update an existing waste request
 */
const updateWasteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const updateData = req.body;

    const wasteRequest = await WasteRequest.findOne({ _id: id, userId });
    
    if (!wasteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    if (!wasteRequest.canBeModified()) {
      return res.status(400).json({
        success: false,
        message: 'Cette demande ne peut plus être modifiée'
      });
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (key === 'preferredDate') {
        wasteRequest[key] = new Date(updateData[key]);
      } else {
        wasteRequest[key] = updateData[key];
      }
    });

    await wasteRequest.save();
    await wasteRequest.populate('assignedCollector', 'firstName lastName phone');

    res.json({
      success: true,
      message: 'Demande mise à jour avec succès',
      data: wasteRequest
    });
  } catch (error) {
    console.error('Update waste request error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
};

/**
 * Delete a waste request
 */
const deleteWasteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const wasteRequest = await WasteRequest.findOne({ _id: id, userId });
    
    if (!wasteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    await WasteRequest.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Demande supprimée avec succès'
    });
  } catch (error) {
    console.error('Delete waste request error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
};

/**
 * Cancel a waste request
 */
const cancelWasteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const { reason } = req.body;

    const wasteRequest = await WasteRequest.findOne({ _id: id, userId });
    
    if (!wasteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }

    if (!wasteRequest.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Cette demande ne peut plus être annulée'
      });
    }

    wasteRequest.status = 'cancelled';
    wasteRequest.cancelledAt = new Date();
    wasteRequest.cancelReason = reason || 'Annulée par l\'utilisateur';

    await wasteRequest.save();
    await wasteRequest.populate('assignedCollector', 'firstName lastName phone');

    res.json({
      success: true,
      message: 'Demande annulée avec succès',
      data: wasteRequest
    });
  } catch (error) {
    console.error('Cancel waste request error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation'
    });
  }
};

/**
 * Get waste request statistics for the current user
 */
const getWasteStats = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const [
      totalRequests,
      pendingRequests,
      scheduledRequests,
      completedRequests,
      cancelledRequests,
      totalWeight,
      wasteTypeStats
    ] = await Promise.all([
      WasteRequest.countDocuments({ userId }),
      WasteRequest.countDocuments({ userId, status: 'pending' }),
      WasteRequest.countDocuments({ userId, status: 'scheduled' }),
      WasteRequest.countDocuments({ userId, status: 'completed' }),
      WasteRequest.countDocuments({ userId, status: 'cancelled' }),
      WasteRequest.aggregate([
        { $match: { userId: userId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$estimatedWeight' } } }
      ]),
      WasteRequest.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: '$wasteType', count: { $sum: 1 }, weight: { $sum: '$estimatedWeight' } } }
      ])
    ]);

    const stats = {
      total: totalRequests,
      pending: pendingRequests,
      scheduled: scheduledRequests,
      completed: completedRequests,
      cancelled: cancelledRequests,
      totalWeight: totalWeight[0]?.total || 0,
      wasteTypes: wasteTypeStats.reduce((acc, item) => {
        acc[item._id] = {
          count: item.count,
          weight: item.weight
        };
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get waste stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  getWasteRequests,
  createWasteRequest,
  updateWasteRequest,
  deleteWasteRequest,
  cancelWasteRequest,
  getWasteStats
};
