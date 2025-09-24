const WasteRequest = require('../models/WasteRequest');
const WasteCollectionRequest = require('../models/WasteCollectionRequest');
const User = require('../models/User');
const webSocketService = require('../services/WebSocketService');
const mongoose = require('mongoose');

/**
 * Find the nearest available collector to a given location
 * @param {Array} coordinates - [longitude, latitude]
 * @param {Number} maxDistance - Maximum distance in meters (default: 50km)
 * @returns {Object|null} - Nearest collector or null if none found
 */
const findNearestCollector = async (coordinates, maxDistance = 50000) => {
  try {
    console.log('🔍 Recherche du collecteur le plus proche pour:', coordinates);
    
    // Collecteurs disponibles avec position valide
    // Accepte soit userType 'collecteur' soit role 'collector'
    let availableCollectors = await User.find({
      onDuty: true,
      $or: [
        { userType: 'collecteur' },
        { role: 'collector' }
      ],
      'lastLocation.coordinates.0': { $exists: true },
      'lastLocation.coordinates.1': { $exists: true }
    });

    console.log('🚛 Collecteurs candidats trouvés (onDuty):', availableCollectors.length);

    // Fallback: si aucun collecteur "onDuty" n'est trouvé, élargir la recherche
    if (availableCollectors.length === 0) {
      console.log('🔄 Fallback: recherche de collecteurs récents même si onDuty=false');
      const since = new Date(Date.now() - 60 * 60 * 1000); // 60 minutes
      availableCollectors = await User.find({
        $or: [
          { userType: 'collecteur' },
          { role: 'collector' }
        ],
        'lastLocation.coordinates.0': { $exists: true },
        'lastLocation.coordinates.1': { $exists: true },
        lastLocationUpdate: { $gte: since }
      });
      console.log('🚛 Collecteurs candidats trouvés (fallback récent):', availableCollectors.length);
    }

    if (availableCollectors.length === 0) {
      console.log('❌ Aucun collecteur disponible trouvé (même avec fallback)');
      return null;
    }

    // Calculer manuellement la distance et trouver le plus proche
    let nearestCollector = null;
    let minDistance = Infinity;

    for (const collector of availableCollectors) {
      if (collector.lastLocation && collector.lastLocation.coordinates && collector.lastLocation.coordinates.length === 2) {
        // Calcul simple de distance (approximation)
        const [collectorLng, collectorLat] = collector.lastLocation.coordinates;
        const [requestLng, requestLat] = coordinates;
        
        // Distance euclidienne approximative (en degrés, puis convertie en mètres)
        const latDiff = requestLat - collectorLat;
        const lngDiff = requestLng - collectorLng;
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000; // ~111km par degré
        
        if (distance < maxDistance && distance < minDistance) {
          minDistance = distance;
          nearestCollector = { ...collector.toObject(), distance }
        }
      }
    }

    const nearestCollectors = nearestCollector ? [nearestCollector] : [];

    if (nearestCollectors.length > 0) {
      const collector = nearestCollectors[0];
      console.log(`✅ Collecteur trouvé: ${collector.firstName} ${collector.lastName} à ${Math.round(collector.distance)}m`);
      return collector;
    }

    console.log('❌ Aucun collecteur disponible trouvé dans un rayon de', maxDistance, 'mètres');
    return null;
  } catch (error) {
    console.error('❌ Erreur lors de la recherche du collecteur le plus proche:', error);
    return null;
  }
};

/**
 * Send notification to collector about new waste request
 * @param {String} collectorId - ID of the collector
 * @param {Object} wasteRequest - The waste request object
 */
const notifyCollector = async (collectorId, wasteRequest) => {
  try {
    console.log('🔔 Envoi de notification au collecteur:', collectorId);
    
    // Envoyer notification WebSocket temps réel
    webSocketService.notifyNewWasteRequest(collectorId.toString(), {
      _id: wasteRequest._id,
      wasteType: wasteRequest.wasteType,
      address: wasteRequest.address,
      urgency: wasteRequest.urgency,
      estimatedWeight: wasteRequest.estimatedWeight,
      preferredDate: wasteRequest.preferredDate,
      coordinates: wasteRequest.coordinates
    });
    
    console.log(`📱 Notification WebSocket envoyée au collecteur ${collectorId} pour la demande ${wasteRequest._id}`);
    
    // TODO: Ajouter notifications push mobile et SMS/Email de secours
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de notification:', error);
  }
};

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
 * Create a new waste request with automatic collector assignment
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
      notes,
      coordinates // Optional: coordinates can be provided by frontend
    } = req.body;

    console.log('🗑️ Création d\'une nouvelle demande de collecte:', {
      userId,
      wasteType,
      description,
      estimatedWeight,
      address,
      preferredDate,
      preferredTime,
      urgency,
      notes,
      coordinates
    });

    // Create the waste request
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

    // If coordinates are provided, use them; otherwise, let the pre-save middleware handle it
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      wasteRequest.coordinates = {
        type: 'Point',
        coordinates: coordinates
      };
    }

    console.log('💾 Sauvegarde de la demande...');
    console.log('👤 ID utilisateur dans la demande:', wasteRequest.userId);
    await wasteRequest.save();
    console.log('✅ Demande sauvegardée avec succès!');
    console.log('🆔 ID de la demande créée:', wasteRequest._id);

    // Try to find and assign the nearest collector
    const nearestCollector = await findNearestCollector(wasteRequest.coordinates.coordinates);
    
    if (nearestCollector) {
      // Assign the collector to the request
      wasteRequest.assignedCollector = nearestCollector._id;
      wasteRequest.status = 'scheduled'; // Change status to scheduled when assigned
      wasteRequest.scheduledDate = new Date(); // Set scheduled date to now
      
      await wasteRequest.save();
      console.log(`✅ Collecteur assigné: ${nearestCollector.firstName} ${nearestCollector.lastName}`);
      
      // Send notification to the collector
      await notifyCollector(nearestCollector._id, wasteRequest);
      
      // Notify the household that a collector has been assigned
      webSocketService.notifyCollectorAssigned(userId.toString(), {
        _id: nearestCollector._id,
        firstName: nearestCollector.firstName,
        lastName: nearestCollector.lastName,
        phone: nearestCollector.phone,
        email: nearestCollector.email
      });
      
      // Populate the assigned collector for response
      await wasteRequest.populate('assignedCollector', 'firstName lastName phone email');
    } else {
      console.log('⚠️ Aucun collecteur disponible - demande reste en attente');
    }

    // Populate the user data for response
    await wasteRequest.populate('userId', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: nearestCollector 
        ? `Demande créée et assignée au collecteur ${nearestCollector.firstName} ${nearestCollector.lastName}`
        : 'Demande créée avec succès - en attente d\'assignation',
      data: wasteRequest,
      assignedCollector: nearestCollector ? {
        id: nearestCollector._id,
        name: `${nearestCollector.firstName} ${nearestCollector.lastName}`,
        phone: nearestCollector.phone,
        distance: Math.round(nearestCollector.distance)
      } : null
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création de la demande:', error);
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
    console.log('📊 getWasteStats - Début de la requête ménage');
    const { _id: userId } = req.user;
    console.log('👤 Utilisateur ID:', userId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Récupérer les stats du nouveau modèle (WasteRequest)
    const [
      totalNew,
      pendingNew,
      scheduledNew,
      completedNew,
      cancelledNew,
      totalWeightNewAgg
    ] = await Promise.all([
      WasteRequest.countDocuments({ userId }),
      WasteRequest.countDocuments({ userId, status: 'pending' }),
      WasteRequest.countDocuments({ userId, status: 'scheduled' }),
      WasteRequest.countDocuments({ userId, status: 'completed' }),
      WasteRequest.countDocuments({ userId, status: 'cancelled' }),
      WasteRequest.aggregate([
        { $match: { userId: userObjectId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$collectionDetails.actualWeight', '$estimatedWeight'] } } } }
      ])
    ]);

    // Récupérer les stats du modèle legacy (WasteCollectionRequest)
    const [
      totalLegacy,
      pendingLegacy,
      scheduledLegacy,
      inProgressLegacy,
      completedLegacy,
      cancelledLegacy,
      totalWeightLegacyAgg
    ] = await Promise.all([
      WasteCollectionRequest.countDocuments({ userId }),
      WasteCollectionRequest.countDocuments({ userId, status: 'pending' }),
      WasteCollectionRequest.countDocuments({ userId, status: { $in: ['confirmed', 'assigned'] } }),
      WasteCollectionRequest.countDocuments({ userId, status: 'in_progress' }),
      WasteCollectionRequest.countDocuments({ userId, status: 'completed' }),
      WasteCollectionRequest.countDocuments({ userId, status: 'cancelled' }),
      WasteCollectionRequest.aggregate([
        { $match: { userId: userObjectId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$collectedQuantity', '$quantity'] } } } }
      ])
    ]);

    const total = totalNew + totalLegacy;
    const pending = pendingNew + pendingLegacy;
    const scheduled = scheduledNew + scheduledLegacy;
    const in_progress = inProgressLegacy + (await WasteRequest.countDocuments({ userId, status: 'in_progress' }));
    const completed = completedNew + completedLegacy;
    const cancelled = cancelledNew + cancelledLegacy;
    const totalWeight = (totalWeightNewAgg[0]?.total || 0) + (totalWeightLegacyAgg[0]?.total || 0);

    console.log('📊 Statistiques calculées (fusion new + legacy):');
    console.log(`  - Total demandes: ${total}`);
    console.log(`  - En attente: ${pending}`);
    console.log(`  - Programmées: ${scheduled}`);
    console.log(`  - En cours: ${in_progress}`);
    console.log(`  - Terminées: ${completed}`);
    console.log(`  - Annulées: ${cancelled}`);
    console.log(`  - Poids total collecté: ${totalWeight}kg`);

    const stats = {
      total,
      pending,
      scheduled,
      in_progress,
      completed,
      cancelled,
      totalWeight
    };

    console.log('📊 Stats finales ménage (fusion):', stats);

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get waste stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

/**
 * Get all waste requests assigned to the current collector
 */
const getAssignedRequests = async (req, res) => {
  try {
    const { _id: collectorId } = req.user;
    const collectorObjectId = typeof collectorId === 'string' 
      ? new mongoose.Types.ObjectId(collectorId) 
      : collectorId;
    
    // Verify that the user is a collector
    if (req.user.userType !== 'collecteur' && req.user.role !== 'collector') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux collecteurs'
      });
    }

    // Utiliser une requête avec distinct pour éviter les doublons
    const assignedRequests = await WasteRequest.aggregate([
      {
        $match: {
          assignedCollector: collectorObjectId,
          status: { $in: ['scheduled', 'in_progress'] }
        }
      },
      {
        $group: {
          _id: {
            userId: '$userId',
            wasteType: '$wasteType',
            address: '$address',
            preferredDate: '$preferredDate'
          },
          doc: { $first: '$$ROOT' } // Garder seulement le premier document de chaque groupe
        }
      },
      {
        $replaceRoot: { newRoot: '$doc' }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
          pipeline: [
            { $project: { firstName: 1, lastName: 1, phone: 1, address: 1 } }
          ]
        }
      },
      {
        $unwind: '$userId'
      },
      {
        $sort: { scheduledDate: 1, createdAt: 1 }
      }
    ]);

    console.log(`📋 ${assignedRequests.length} demandes assignées trouvées pour le collecteur ${collectorId}`);

    res.json({
      success: true,
      data: assignedRequests,
      count: assignedRequests.length
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des demandes assignées:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes assignées'
    });
  }
};

/**
 * Start collection process (collector marks as in_progress)
 */
const startCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: collectorId } = req.user;

    // Verify that the user is a collector
    if (req.user.userType !== 'collecteur' && req.user.role !== 'collector') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux collecteurs'
      });
    }

    const wasteRequest = await WasteRequest.findOne({
      _id: id,
      assignedCollector: collectorId,
      status: 'scheduled'
    });

    if (!wasteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée ou non assignée à ce collecteur'
      });
    }

    wasteRequest.status = 'in_progress';
    await wasteRequest.save();

    await wasteRequest.populate('userId', 'firstName lastName phone');

    console.log(`🚛 Collecte démarrée par ${req.user.firstName} ${req.user.lastName} pour la demande ${id}`);

    // Diffuser l'événement temps réel aux clients (ménage + collecteur)
    try {
      webSocketService.broadcastCollectionStarted({
        requestId: id.toString(),
        collectorId: collectorId.toString(),
        userId: wasteRequest.userId?._id?.toString?.() || (wasteRequest.userId && wasteRequest.userId.toString ? wasteRequest.userId.toString() : undefined),
        message: 'Collecte démarrée',
        timestamp: new Date().toISOString()
      });
    } catch (wsErr) {
      console.warn('⚠️ WS broadcastCollectionStarted a échoué:', wsErr?.message || wsErr);
    }

    res.json({
      success: true,
      message: 'Collecte démarrée avec succès',
      data: wasteRequest
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de la collecte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du démarrage de la collecte'
    });
  }
};

/**
 * Complete collection process (collector marks as completed)
 */
const completeCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: collectorId } = req.user;
    const { actualWeight, notes, photos } = req.body;

    // Verify that the user is a collector
    if (req.user.userType !== 'collecteur' && req.user.role !== 'collector') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux collecteurs'
      });
    }

    const wasteRequest = await WasteRequest.findOne({
      _id: id,
      assignedCollector: collectorId,
      status: 'in_progress'
    });

    if (!wasteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée ou non en cours de collecte'
      });
    }

    // Update request status and collection details
    wasteRequest.status = 'completed';
    wasteRequest.completedAt = new Date();
    
    // Update collection details with proper weight
    const finalWeight = actualWeight ? parseFloat(actualWeight) : wasteRequest.estimatedWeight;
    wasteRequest.collectionDetails = {
      actualWeight: finalWeight,
      collectedBy: collectorId,
      photos: photos || []
    };

    if (notes) {
      wasteRequest.notes = (wasteRequest.notes || '') + '\n\nNotes du collecteur: ' + notes;
    }

    await wasteRequest.save();
    await wasteRequest.populate('userId', 'firstName lastName phone');

    // Diffuser l'événement temps réel aux clients (ménage + collecteur)
    try {
      webSocketService.broadcastCollectionCompleted({
        requestId: id.toString(),
        collectorId: collectorId.toString(),
        userId: wasteRequest.userId?._id?.toString?.() || (wasteRequest.userId && wasteRequest.userId.toString ? wasteRequest.userId.toString() : undefined),
        actualWeight: finalWeight,
        message: 'Collecte terminée',
        timestamp: new Date().toISOString()
      });
    } catch (wsErr) {
      console.warn('⚠️ WS broadcastCollectionCompleted a échoué:', wsErr?.message || wsErr);
    }

    res.json({
      success: true,
      message: 'Collecte terminée avec succès',
      data: wasteRequest
    });
  } catch (error) {
    console.error('❌ Erreur lors de la finalisation de la collecte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la finalisation de la collecte'
    });
  }
};

/**
 * Manually (re)assign the nearest available collector to a pending request
 */
const assignNearestCollector = async (req, res) => {
  try {
    const { id } = req.params;

    const wasteRequest = await WasteRequest.findById(id);
    if (!wasteRequest) {
      return res.status(404).json({ success: false, message: 'Demande non trouvée' });
    }

    if (wasteRequest.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'La demande n\'est pas en attente' });
    }

    // Ensure coordinates exist
    if (!wasteRequest.coordinates || !Array.isArray(wasteRequest.coordinates.coordinates) || wasteRequest.coordinates.coordinates.length !== 2) {
      // Fallback to Douala
      wasteRequest.coordinates = { type: 'Point', coordinates: [9.7043, 4.0511] };
    }

    const nearestCollector = await findNearestCollector(wasteRequest.coordinates.coordinates);
    if (!nearestCollector) {
      return res.status(200).json({ success: true, message: 'Aucun collecteur disponible pour le moment', data: wasteRequest });
    }

    wasteRequest.assignedCollector = nearestCollector._id;
    wasteRequest.status = 'scheduled';
    wasteRequest.scheduledDate = new Date();
    await wasteRequest.save();

    // Notifications
    await notifyCollector(nearestCollector._id, wasteRequest);
    webSocketService.notifyCollectorAssigned(wasteRequest.userId.toString(), {
      _id: nearestCollector._id,
      firstName: nearestCollector.firstName,
      lastName: nearestCollector.lastName,
      phone: nearestCollector.phone,
      email: nearestCollector.email
    });

    await wasteRequest.populate('assignedCollector', 'firstName lastName phone email');

    return res.json({ success: true, message: 'Collecteur assigné avec succès', data: wasteRequest });
  } catch (error) {
    console.error('❌ Erreur assignation manuelle du collecteur:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de l\'assignation' });
  }
};

/**
 * Get collector's collection history and statistics
 */
const getCollectorStats = async (req, res) => {
  try {
    const { _id: collectorId } = req.user;
    const collectorObjectId = typeof collectorId === 'string' 
      ? new mongoose.Types.ObjectId(collectorId) 
      : collectorId;

    // Verify that the user is a collector
    if (req.user.userType !== 'collecteur' && req.user.role !== 'collector') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux collecteurs'
      });
    }

    const [
      totalAssigned,
      completed,
      inProgress,
      scheduled,
      totalWeight,
      recentCollections
    ] = await Promise.all([
      WasteRequest.countDocuments({ assignedCollector: collectorObjectId }),
      WasteRequest.countDocuments({ assignedCollector: collectorObjectId, status: 'completed' }),
      WasteRequest.countDocuments({ assignedCollector: collectorObjectId, status: 'in_progress' }),
      WasteRequest.countDocuments({ assignedCollector: collectorObjectId, status: 'scheduled' }),
      WasteRequest.aggregate([
        { $match: { assignedCollector: collectorObjectId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$collectionDetails.actualWeight' } } }
      ]),
      WasteRequest.find({ 
        assignedCollector: collectorObjectId, 
        status: 'completed' 
      })
        .populate('userId', 'firstName lastName')
        .sort({ completedAt: -1 })
        .limit(10)
    ]);

    const stats = {
      totalAssigned,
      completed,
      inProgress,
      scheduled,
      completionRate: totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0,
      totalWeight: totalWeight[0]?.total || 0,
      recentCollections
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques du collecteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

/**
 * Update collector's current location
 */
const updateCollectorLocation = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { latitude, longitude, accuracy } = req.body;

    console.log('📍 Mise à jour position collecteur:', { userId, latitude, longitude, accuracy });

    // Validation des coordonnées
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude et longitude sont requis'
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Coordonnées invalides'
      });
    }

    // Mettre à jour la position du collecteur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'lastLocation': {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          'locationAccuracy': accuracy || null,
          'lastLocationUpdate': new Date(),
          'onDuty': true // Marquer comme en service quand il partage sa position
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Collecteur non trouvé'
      });
    }

    console.log('✅ Position collecteur mise à jour:', updatedUser.lastLocation);

    // Tentative d'auto-assignation de demandes en attente à proximité
    try {
      await autoAssignPendingRequestsForCollector(updatedUser._id);
    } catch (autoErr) {
      console.warn('⚠️ Auto-assign des demandes en attente a échoué:', autoErr?.message || autoErr);
    }

    res.json({
      success: true,
      message: 'Position mise à jour avec succès',
      data: {
        location: updatedUser.lastLocation,
        accuracy: updatedUser.locationAccuracy,
        lastUpdate: updatedUser.lastLocationUpdate
      }
    });
  } catch (error) {
    console.error('❌ Erreur mise à jour position:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la position'
    });
  }
};

/**
 * Get collector's current location (for assigned households)
 */
const getCollectorLocation = async (req, res) => {
  try {
    const { collectorId } = req.params;

    console.log('📍 Récupération position collecteur:', collectorId);

    const collector = await User.findById(collectorId)
      .select('firstName lastName lastLocation locationAccuracy lastLocationUpdate onDuty')
      .lean();

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collecteur non trouvé'
      });
    }

    if (!collector.lastLocation) {
      return res.status(404).json({
        success: false,
        message: 'Position du collecteur non disponible'
      });
    }

    res.json({
      success: true,
      data: {
        collectorId: collector._id,
        name: `${collector.firstName} ${collector.lastName}`,
        location: collector.lastLocation,
        accuracy: collector.locationAccuracy,
        lastUpdate: collector.lastLocationUpdate,
        onDuty: collector.onDuty
      }
    });
  } catch (error) {
    console.error('❌ Erreur récupération position:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la position'
    });
  }
};

/**
 * Get all active collectors locations (for admin/overview)
 */
const getActiveCollectors = async (req, res) => {
  try {
    console.log('🚛 Récupération collecteurs actifs');

    const activeCollectors = await User.find({
      onDuty: true,
      $or: [
        { userType: 'collecteur' },
        { role: 'collector' }
      ],
      'lastLocation.coordinates.0': { $exists: true },
      'lastLocation.coordinates.1': { $exists: true },
      lastLocationUpdate: {
        $gte: new Date(Date.now() - 30 * 60 * 1000) // Dernière mise à jour dans les 30 minutes
      }
    })
    .select('firstName lastName lastLocation locationAccuracy lastLocationUpdate onDuty')
    .lean();

    res.json({
      success: true,
      data: activeCollectors.map(collector => ({
        collectorId: collector._id,
        name: `${collector.firstName} ${collector.lastName}`,
        location: collector.lastLocation,
        accuracy: collector.locationAccuracy,
        lastUpdate: collector.lastLocationUpdate,
        onDuty: collector.onDuty
      }))
    });
  } catch (error) {
    console.error('❌ Erreur récupération collecteurs actifs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des collecteurs actifs'
    });
  }
};

/**
 * Attempt to auto-assign the nearest available collector (current collector) to recent pending requests
 * Called when a collector updates their location and goes on duty
 */
async function autoAssignPendingRequestsForCollector(collectorId) {
  try {
    const collector = await User.findById(collectorId).lean();
    if (!collector || !collector.lastLocation || !Array.isArray(collector.lastLocation.coordinates)) {
      console.log('ℹ️ Auto-assign ignoré: collector sans position');
      return;
    }

    // Chercher quelques demandes en attente récentes
    const pendingRequests = await WasteRequest.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (pendingRequests.length === 0) {
      console.log('ℹ️ Auto-assign: aucune demande en attente');
      return;
    }

    console.log(`🔁 Auto-assign: ${pendingRequests.length} demandes en attente à vérifier`);

    for (const req of pendingRequests) {
      if (!req.coordinates || !req.coordinates.coordinates || req.coordinates.coordinates.length !== 2) {
        continue;
      }

      // Vérifier qui est le plus proche pour cette demande
      const nearest = await findNearestCollector(req.coordinates.coordinates);
      if (nearest && String(nearest._id) === String(collectorId)) {
        // Assigner si la demande est toujours en attente
        const updated = await WasteRequest.findOneAndUpdate(
          { _id: req._id, status: 'pending' },
          { 
            $set: { 
              assignedCollector: collectorId, 
              status: 'scheduled',
              scheduledDate: new Date() 
            } 
          },
          { new: true }
        );

        if (updated) {
          console.log(`✅ Auto-assign: demande ${updated._id} assignée au collecteur ${collectorId}`);

          // Notifications
          try { await notifyCollector(collectorId, updated); } catch {}
          try {
            webSocketService.notifyCollectorAssigned(updated.userId.toString(), {
              _id: collector._id,
              firstName: collector.firstName,
              lastName: collector.lastName,
              phone: collector.phone,
              email: collector.email
            });
          } catch {}
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur auto-assign demandes en attente:', error);
  }
};

module.exports = {
  getWasteRequests,
  createWasteRequest,
  updateWasteRequest,
  deleteWasteRequest,
  cancelWasteRequest,
  getWasteStats,
  // New collector functions
  getAssignedRequests,
  startCollection,
  completeCollection,
  getCollectorStats,
  assignNearestCollector,
  // New geolocation functions
  updateCollectorLocation,
  getCollectorLocation,
  getActiveCollectors
};
