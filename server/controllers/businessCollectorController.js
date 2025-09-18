const BusinessCollector = require('../models/BusinessCollector');
const User = require('../models/User');

// Créer un nouveau collecteur Business
const createBusinessCollector = async (req, res) => {
  try {
    const businessOwnerId = req.user.id;
    
    // Vérifier que l'utilisateur est bien un Business
    const businessUser = await User.findById(businessOwnerId);
    if (!businessUser || businessUser.userType !== 'collectam-business') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les utilisateurs Business peuvent créer des collecteurs'
      });
    }

    // Vérifier si l'email existe déjà
    const existingCollector = await BusinessCollector.findOne({ 
      email: req.body.email.toLowerCase() 
    });
    
    if (existingCollector) {
      return res.status(400).json({
        success: false,
        message: 'Un collecteur avec cet email existe déjà'
      });
    }

    // Créer le collecteur
    const collectorData = {
      ...req.body,
      businessOwnerId,
      email: req.body.email.toLowerCase()
    };

    const newCollector = new BusinessCollector(collectorData);
    await newCollector.save();

    console.log(`✅ Nouveau collecteur Business créé: ${newCollector.firstName} ${newCollector.lastName} par ${businessUser.email}`);

    res.status(201).json({
      success: true,
      message: 'Collecteur créé avec succès',
      data: {
        collector: {
          _id: newCollector._id,
          firstName: newCollector.firstName,
          lastName: newCollector.lastName,
          email: newCollector.email,
          phone: newCollector.phone,
          position: newCollector.position,
          status: newCollector.status,
          employeeId: newCollector.employeeId,
          workZone: newCollector.workZone,
          createdAt: newCollector.createdAt
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur création collecteur Business:', error);
    
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
      message: 'Erreur serveur lors de la création du collecteur'
    });
  }
};

// Obtenir tous les collecteurs d'un Business
const getBusinessCollectors = async (req, res) => {
  try {
    const businessOwnerId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    // Construire le filtre
    const filter = { businessOwnerId };
    if (status) {
      filter.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const collectors = await BusinessCollector.find(filter)
      .populate('assignedVehicleId', 'licensePlate brand model')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BusinessCollector.countDocuments(filter);

    // Statistiques
    const stats = await BusinessCollector.aggregate([
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
      suspendu: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        collectors,
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
    console.error('❌ Erreur récupération collecteurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des collecteurs'
    });
  }
};

// Obtenir un collecteur spécifique
const getBusinessCollectorById = async (req, res) => {
  try {
    const { id } = req.params;
    const businessOwnerId = req.user.id;

    const collector = await BusinessCollector.findOne({
      _id: id,
      businessOwnerId
    }).populate('assignedVehicleId', 'licensePlate brand model vehicleType');

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collecteur non trouvé'
      });
    }

    res.json({
      success: true,
      data: { collector }
    });

  } catch (error) {
    console.error('❌ Erreur récupération collecteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du collecteur'
    });
  }
};

// Mettre à jour un collecteur
const updateBusinessCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const businessOwnerId = req.user.id;

    // Vérifier si le collecteur existe et appartient au Business
    const collector = await BusinessCollector.findOne({
      _id: id,
      businessOwnerId
    });

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collecteur non trouvé'
      });
    }

    // Vérifier l'email si modifié
    if (req.body.email && req.body.email.toLowerCase() !== collector.email) {
      const existingCollector = await BusinessCollector.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: id }
      });

      if (existingCollector) {
        return res.status(400).json({
          success: false,
          message: 'Un collecteur avec cet email existe déjà'
        });
      }
    }

    // Mettre à jour
    const updateData = { ...req.body };
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }

    const updatedCollector = await BusinessCollector.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log(`✅ Collecteur Business mis à jour: ${updatedCollector.firstName} ${updatedCollector.lastName}`);

    res.json({
      success: true,
      message: 'Collecteur mis à jour avec succès',
      data: { collector: updatedCollector }
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour collecteur:', error);
    
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
      message: 'Erreur serveur lors de la mise à jour du collecteur'
    });
  }
};

// Supprimer un collecteur
const deleteBusinessCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const businessOwnerId = req.user.id;

    const collector = await BusinessCollector.findOneAndDelete({
      _id: id,
      businessOwnerId
    });

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collecteur non trouvé'
      });
    }

    console.log(`🗑️ Collecteur Business supprimé: ${collector.firstName} ${collector.lastName}`);

    res.json({
      success: true,
      message: 'Collecteur supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur suppression collecteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du collecteur'
    });
  }
};

// Assigner un véhicule à un collecteur
const assignVehicleToCollector = async (req, res) => {
  try {
    const { collectorId, vehicleId } = req.body;
    const businessOwnerId = req.user.id;

    // Vérifier que le collecteur appartient au Business
    const collector = await BusinessCollector.findOne({
      _id: collectorId,
      businessOwnerId
    });

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collecteur non trouvé'
      });
    }

    // Mettre à jour l'assignation
    collector.assignedVehicleId = vehicleId;
    await collector.save();

    res.json({
      success: true,
      message: 'Véhicule assigné avec succès',
      data: { collector }
    });

  } catch (error) {
    console.error('❌ Erreur assignation véhicule:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'assignation du véhicule'
    });
  }
};

module.exports = {
  createBusinessCollector,
  getBusinessCollectors,
  getBusinessCollectorById,
  updateBusinessCollector,
  deleteBusinessCollector,
  assignVehicleToCollector
};
