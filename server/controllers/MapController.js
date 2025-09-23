const WasteRequest = require('../models/WasteRequest');
const User = require('../models/User');

/**
 * Get active collectors in the area
 */
const getActiveCollectors = async (req, res) => {
  try {
    console.log('🚛 Récupération collecteurs actifs');
    
    // Récupérer les vrais collecteurs actifs de la base de données
    const activeCollectors = await User.find({
      userType: 'collecteur',
      onDuty: true,
      'lastLocation.coordinates': { $exists: true, $ne: [] }
    }).select('firstName lastName phone lastLocation onDuty updatedAt');

    console.log(`📋 ${activeCollectors.length} collecteurs actifs trouvés`);

    // Formatter les données pour la carte
    const formattedCollectors = activeCollectors.map(collector => ({
      collectorId: collector._id.toString(),
      name: `${collector.firstName} ${collector.lastName}`,
      location: {
        type: 'Point',
        coordinates: collector.lastLocation.coordinates
      },
      onDuty: collector.onDuty,
      lastUpdate: collector.updatedAt.toISOString()
    }));

    // Si aucun collecteur actif, créer un collecteur de test automatiquement
    if (formattedCollectors.length === 0) {
      console.log('⚠️ Aucun collecteur actif, création d\'un collecteur de test...');
      
      // Créer un collecteur de test dans la base
      try {
        const testCollector = new User({
          firstName: 'Jean',
          lastName: 'Dupont (Test)',
          email: 'test.collecteur@collectam.com',
          phone: '+237690123456',
          userType: 'collecteur',
          onDuty: true,
          lastLocation: {
            type: 'Point',
            coordinates: [9.7043, 4.0511]
          },
          password: 'test123' // Mot de passe temporaire
        });
        
        await testCollector.save();
        console.log('✅ Collecteur de test créé:', testCollector._id);
        
        // Retourner le collecteur créé
        formattedCollectors = [{
          collectorId: testCollector._id.toString(),
          name: `${testCollector.firstName} ${testCollector.lastName}`,
          location: testCollector.lastLocation,
          onDuty: testCollector.onDuty,
          lastUpdate: testCollector.updatedAt.toISOString()
        }];
      } catch (error) {
        console.error('❌ Erreur création collecteur de test:', error);
        
        // Fallback vers données mockées
        const mockCollectors = [
          {
            collectorId: 'mock-1',
            name: 'Jean Dupont (Mock)',
            location: {
              type: 'Point',
              coordinates: [9.7043, 4.0511]
            },
            onDuty: true,
            lastUpdate: new Date().toISOString()
          }
        ];
        
        return res.json({
          success: true,
          data: mockCollectors,
          count: mockCollectors.length,
          message: 'Données mockées - erreur création collecteur test'
        });
      }
    }

    res.json({
      success: true,
      data: formattedCollectors,
      count: formattedCollectors.length
    });
  } catch (error) {
    console.error('❌ Erreur récupération collecteurs actifs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des collecteurs'
    });
  }
};

/**
 * Get nearby waste collections
 */
const getNearbyCollections = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    // Get user's waste requests and some nearby ones
    const userRequests = await WasteRequest.find({ userId })
      .populate('assignedCollector', 'firstName lastName phone')
      .sort({ createdAt: -1 })
      .limit(10);

    // Transform to match frontend interface
    const collections = userRequests.map(request => {
      const distance = Math.random() * 10; // Mock distance calculation
      
      return {
        id: request._id.toString(),
        wasteType: request.wasteType,
        address: request.address,
        coordinates: request.coordinates?.coordinates ? {
          lat: request.coordinates.coordinates[1],
          lng: request.coordinates.coordinates[0]
        } : {
          lat: 4.0511,
          lng: 9.7043
        },
        status: request.status,
        urgency: request.urgency,
        scheduledDate: request.preferredDate.toISOString(),
        scheduledTime: request.preferredTime,
        distance: Math.round(distance * 10) / 10,
        assignedCollector: request.assignedCollector ? {
          id: request.assignedCollector._id.toString(),
          name: `${request.assignedCollector.firstName} ${request.assignedCollector.lastName}`,
          phone: request.assignedCollector.phone,
          estimatedArrival: request.status === 'in_progress' ? 
            new Date(Date.now() + Math.random() * 60 * 60 * 1000).toISOString() : undefined
        } : undefined,
        completedAt: request.completedAt?.toISOString()
      };
    });

    // Add some mock nearby collections for demonstration
    const mockNearbyCollections = [
      {
        id: 'mock-1',
        wasteType: 'plastic',
        address: 'Rue de la Liberté, Akwa',
        coordinates: { lat: 4.0520, lng: 9.7050 },
        status: 'scheduled',
        urgency: 'medium',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledTime: '10:00',
        distance: 0.8,
        assignedCollector: {
          id: '1',
          name: 'Jean Dupont',
          phone: '+237690123456',
          estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'mock-2',
        wasteType: 'organic',
        address: 'Avenue Charles de Gaulle, Bonanjo',
        coordinates: { lat: 4.0495, lng: 9.6975 },
        status: 'in_progress',
        urgency: 'high',
        scheduledDate: new Date().toISOString(),
        scheduledTime: '14:30',
        distance: 1.2,
        assignedCollector: {
          id: '2',
          name: 'Marie Ngono',
          phone: '+237691234567',
          estimatedArrival: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        }
      }
    ];

    const allCollections = [...collections, ...mockNearbyCollections];

    res.json({
      success: true,
      data: allCollections
    });
  } catch (error) {
    console.error('Get nearby collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des collectes'
    });
  }
};

/**
 * Get collector details by ID
 */
const getCollectorDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Mock collector details - in real implementation, query from database
    const mockCollector = {
      id,
      name: 'Jean Dupont',
      vehicleType: 'Camion de collecte',
      currentLocation: 'Akwa, Douala',
      coordinates: {
        lat: 4.0511,
        lng: 9.7043
      },
      onDuty: true,
      phone: '+237690123456',
      lastUpdate: new Date().toISOString(),
      stats: {
        collectionsToday: 8,
        totalCollections: 156,
        rating: 4.8,
        experience: '2 ans'
      }
    };

    res.json({
      success: true,
      data: mockCollector
    });
  } catch (error) {
    console.error('Get collector details error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails du collecteur'
    });
  }
};

/**
 * Track a specific collection
 */
const trackCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const wasteRequest = await WasteRequest.findOne({ _id: id, userId })
      .populate('assignedCollector', 'firstName lastName phone');

    if (!wasteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Collecte non trouvée'
      });
    }

    const trackingData = {
      id: wasteRequest._id.toString(),
      wasteType: wasteRequest.wasteType,
      address: wasteRequest.address,
      coordinates: wasteRequest.coordinates?.coordinates ? {
        lat: wasteRequest.coordinates.coordinates[1],
        lng: wasteRequest.coordinates.coordinates[0]
      } : {
        lat: 4.0511,
        lng: 9.7043
      },
      status: wasteRequest.status,
      urgency: wasteRequest.urgency,
      scheduledDate: wasteRequest.preferredDate.toISOString(),
      scheduledTime: wasteRequest.preferredTime,
      distance: Math.round(Math.random() * 10 * 10) / 10,
      assignedCollector: wasteRequest.assignedCollector ? {
        id: wasteRequest.assignedCollector._id.toString(),
        name: `${wasteRequest.assignedCollector.firstName} ${wasteRequest.assignedCollector.lastName}`,
        phone: wasteRequest.assignedCollector.phone,
        estimatedArrival: wasteRequest.status === 'in_progress' ? 
          new Date(Date.now() + Math.random() * 60 * 60 * 1000).toISOString() : undefined,
        currentLocation: 'En route vers votre adresse'
      } : undefined,
      completedAt: wasteRequest.completedAt?.toISOString(),
      timeline: [
        {
          status: 'pending',
          timestamp: wasteRequest.createdAt.toISOString(),
          message: 'Demande créée'
        },
        ...(wasteRequest.status !== 'pending' ? [{
          status: 'scheduled',
          timestamp: wasteRequest.scheduledDate?.toISOString() || new Date().toISOString(),
          message: 'Collecte programmée'
        }] : []),
        ...(wasteRequest.status === 'in_progress' ? [{
          status: 'in_progress',
          timestamp: new Date().toISOString(),
          message: 'Collecteur en route'
        }] : []),
        ...(wasteRequest.status === 'completed' ? [{
          status: 'completed',
          timestamp: wasteRequest.completedAt?.toISOString() || new Date().toISOString(),
          message: 'Collecte terminée'
        }] : [])
      ]
    };

    res.json({
      success: true,
      data: trackingData
    });
  } catch (error) {
    console.error('Track collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du suivi de la collecte'
    });
  }
};

module.exports = {
  getActiveCollectors,
  getNearbyCollections,
  getCollectorDetails,
  trackCollection
};
