const express = require('express');
const router = express.Router();
const WasteCollectionRequest = require('../models/WasteCollectionRequest');
const { authenticateToken } = require('../middlewares/auth');

/**
 * @swagger
 * /api/waste-collection-requests/user:
 *   get:
 *     summary: Get all waste collection requests for the current user
 *     tags: [WasteCollectionRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's waste collection requests
 */
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    
    console.log(`🗑️ Récupération des demandes pour l'utilisateur: ${userId}`);
    
    // Utiliser WasteRequest (modèle principal où les demandes sont sauvegardées)
    const WasteRequest = require('../models/WasteRequest');
    
    // Debug: Compter toutes les demandes
    const totalRequests = await WasteRequest.countDocuments({});
    console.log(`📊 Total demandes dans la base: ${totalRequests}`);
    
    // Debug: Compter les demandes pour cet utilisateur
    const userRequestCount = await WasteRequest.countDocuments({ userId });
    console.log(`👤 Demandes pour utilisateur ${userId}: ${userRequestCount}`);
    
    const requests = await WasteRequest.find({ userId })
      .populate('assignedCollector', 'firstName lastName phone lastLocation')
      .sort({ createdAt: -1 });
    
    console.log(`📋 ${requests.length} demandes récupérées avec populate`);
    
    // Debug: Afficher les IDs des demandes trouvées
    if (requests.length > 0) {
      console.log('🔍 IDs des demandes trouvées:', requests.map(r => r._id.toString()));
    }
    
    // Formatter les demandes pour la carte
    const formattedRequests = requests.map(request => ({
      _id: request._id,
      userId: {
        _id: userId,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone
      },
      wasteType: request.wasteType,
      description: request.description,
      estimatedWeight: request.quantity, // Mapping quantity -> estimatedWeight
      address: request.address,
      coordinates: request.coordinates,
      preferredDate: request.preferredDate,
      preferredTime: request.preferredTime,
      urgency: request.urgency,
      status: request.status,
      notes: request.specialInstructions,
      assignedCollector: request.assignedCollector,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt
    }));
    
    res.json({
      success: true,
      data: formattedRequests,
      count: formattedRequests.length
    });
  } catch (error) {
    console.error('❌ Erreur récupération demandes utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes'
    });
  }
});

/**
 * @swagger
 * /api/waste-collection-requests:
 *   get:
 *     summary: Get all waste collection requests (admin/collector)
 *     tags: [WasteCollectionRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all waste collection requests
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userType } = req.user;
    const WasteRequest = require('../models/WasteRequest');
    
    let query = {};
    
    // Si c'est un collecteur, ne montrer que ses demandes assignées
    if (userType === 'collecteur') {
      query.assignedCollector = req.user._id;
      console.log(`🗑️ Récupération des demandes assignées au collecteur: ${req.user._id}`);
    }
    
    const requests = await WasteRequest.find(query)
      .populate('userId', 'firstName lastName phone')
      .populate('assignedCollector', 'firstName lastName phone lastLocation')
      .sort({ createdAt: -1 });
    
    console.log(`📋 ${requests.length} demandes trouvées pour le collecteur`);
    
    res.json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    console.error('❌ Erreur récupération demandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes'
    });
  }
});

/**
 * @swagger
 * /api/waste-collection-requests/{id}:
 *   get:
 *     summary: Get a specific waste collection request
 *     tags: [WasteCollectionRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Waste collection request details
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await WasteCollectionRequest.findById(id)
      .populate('userId', 'firstName lastName phone address')
      .populate('assignedCollector', 'firstName lastName phone lastLocation');
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('❌ Erreur récupération demande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la demande'
    });
  }
});

module.exports = router;
