const BusinessVehicle = require('../models/BusinessVehicle');
const User = require('../models/User');

// Créer un nouveau véhicule Business
const createBusinessVehicle = async (req, res) => {
  try {
    const businessOwnerId = req.user.id;
    
    // Vérifier que l'utilisateur est bien un Business
    const businessUser = await User.findById(businessOwnerId);
    if (!businessUser || businessUser.userType !== 'collectam-business') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les utilisateurs Business peuvent créer des véhicules'
      });
    }

    // Vérifier si la plaque d'immatriculation existe déjà
    const existingVehicle = await BusinessVehicle.findOne({ 
      licensePlate: req.body.licensePlate.toUpperCase() 
    });
    
    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: 'Un véhicule avec cette plaque d\'immatriculation existe déjà'
      });
    }

    // Créer le véhicule
    const vehicleData = {
      ...req.body,
      businessOwnerId,
      licensePlate: req.body.licensePlate.toUpperCase()
    };

    const newVehicle = new BusinessVehicle(vehicleData);
    await newVehicle.save();

    console.log(`✅ Nouveau véhicule Business créé: ${newVehicle.licensePlate} (${newVehicle.brand} ${newVehicle.model}) par ${businessUser.email}`);

    res.status(201).json({
      success: true,
      message: 'Véhicule créé avec succès',
      data: {
        vehicle: {
          _id: newVehicle._id,
          licensePlate: newVehicle.licensePlate,
          brand: newVehicle.brand,
          model: newVehicle.model,
          year: newVehicle.year,
          capacity: newVehicle.capacity,
          vehicleType: newVehicle.vehicleType,
          status: newVehicle.status,
          fuelType: newVehicle.fuelType,
          createdAt: newVehicle.createdAt
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur création véhicule Business:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du véhicule'
    });
  }
};

// Obtenir tous les véhicules d'un Business
const getBusinessVehicles = async (req, res) => {
  try {
    const businessOwnerId = req.user.id;
    const { status, vehicleType, page = 1, limit = 10 } = req.query;

    // Construire le filtre
    const filter = { businessOwnerId };
    if (status) {
      filter.status = status;
    }
    if (vehicleType) {
      filter.vehicleType = vehicleType;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vehicles = await BusinessVehicle.find(filter)
      .populate('assignedCollectorId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BusinessVehicle.countDocuments(filter);

    // Statistiques
    const stats = await BusinessVehicle.aggregate([
      { $match: { businessOwnerId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      actif: 0,
      inactif: 0,
      maintenance: 0,
      hors_service: 0,
      en_mission: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        vehicles,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        },
        stats: statusCounts
      }
    });

  } catch (error) {
    console.error('❌ Erreur récupération véhicules:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des véhicules'
    });
  }
};

// Obtenir un véhicule spécifique
const getBusinessVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const businessOwnerId = req.user.id;

    const vehicle = await BusinessVehicle.findOne({
      _id: id,
      businessOwnerId
    }).populate('assignedCollectorId', 'firstName lastName email phone position');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Véhicule non trouvé'
      });
    }

    res.json({
      success: true,
      data: { vehicle }
    });

  } catch (error) {
    console.error('❌ Erreur récupération véhicule:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du véhicule'
    });
  }
};

// Mettre à jour un véhicule
const updateBusinessVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const businessOwnerId = req.user.id;

    // Vérifier si le véhicule existe et appartient au Business
    const vehicle = await BusinessVehicle.findOne({
      _id: id,
      businessOwnerId
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Véhicule non trouvé'
      });
    }

    // Vérifier la plaque si modifiée
    if (req.body.licensePlate && req.body.licensePlate.toUpperCase() !== vehicle.licensePlate) {
      const existingVehicle = await BusinessVehicle.findOne({
        licensePlate: req.body.licensePlate.toUpperCase(),
        _id: { $ne: id }
      });

      if (existingVehicle) {
        return res.status(400).json({
          success: false,
          message: 'Un véhicule avec cette plaque d\'immatriculation existe déjà'
        });
      }
    }

    // Mettre à jour
    const updateData = { ...req.body };
    if (updateData.licensePlate) {
      updateData.licensePlate = updateData.licensePlate.toUpperCase();
    }

    const updatedVehicle = await BusinessVehicle.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log(`✅ Véhicule Business mis à jour: ${updatedVehicle.licensePlate}`);

    res.json({
      success: true,
      message: 'Véhicule mis à jour avec succès',
      data: { vehicle: updatedVehicle }
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour véhicule:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du véhicule'
    });
  }
};

// Supprimer un véhicule
const deleteBusinessVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const businessOwnerId = req.user.id;

    const vehicle = await BusinessVehicle.findOneAndDelete({
      _id: id,
      businessOwnerId
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Véhicule non trouvé'
      });
    }

    console.log(`🗑️ Véhicule Business supprimé: ${vehicle.licensePlate}`);

    res.json({
      success: true,
      message: 'Véhicule supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur suppression véhicule:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du véhicule'
    });
  }
};

// Assigner un collecteur à un véhicule
const assignCollectorToVehicle = async (req, res) => {
  try {
    const { vehicleId, collectorId } = req.body;
    const businessOwnerId = req.user.id;

    // Vérifier que le véhicule appartient au Business
    const vehicle = await BusinessVehicle.findOne({
      _id: vehicleId,
      businessOwnerId
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Véhicule non trouvé'
      });
    }

    // Mettre à jour l'assignation
    vehicle.assignedCollectorId = collectorId;
    await vehicle.save();

    res.json({
      success: true,
      message: 'Collecteur assigné avec succès',
      data: { vehicle }
    });

  } catch (error) {
    console.error('❌ Erreur assignation collecteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'assignation du collecteur'
    });
  }
};

module.exports = {
  createBusinessVehicle,
  getBusinessVehicles,
  getBusinessVehicleById,
  updateBusinessVehicle,
  deleteBusinessVehicle,
  assignCollectorToVehicle
};
