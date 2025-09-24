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

    // Normaliser email
    const email = (req.body.email || '').toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email requis' });
    }

    // Vérifier que l'email correspond à un compte collecteur existant (plateforme)
    const platformCollector = await User.findOne({
      email,
      $or: [ { userType: 'collecteur' }, { role: 'collector' } ]
    }).select('_id firstName lastName email userType role');

    if (!platformCollector) {
      return res.status(400).json({
        success: false,
        message: 'Cet email ne correspond à aucun compte collecteur Collectam. Demandez au collecteur de créer d\'abord un compte.'
      });
    }

    // Empêcher le doublon de liaison pour ce Business
    const alreadyLinked = await BusinessCollector.findOne({
      businessOwnerId,
      linkedUserId: platformCollector._id
    });
    if (alreadyLinked) {
      return res.status(409).json({
        success: false,
        message: 'Ce collecteur est déjà lié à votre organisation'
      });
    }

    // Vérifier doublon email dans BusinessCollector (sécurité)
    const existingCollector = await BusinessCollector.findOne({ email });
    if (existingCollector) {
      return res.status(400).json({ success: false, message: 'Un collecteur avec cet email existe déjà' });
    }

    // Construire les données (adresse sans rue/CP)
    const address = {
      city: req.body?.address?.city || undefined,
      region: req.body?.address?.region || undefined,
      country: 'Cameroun'
    };

    // Créer le collecteur lié
    const collectorData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email,
      phone: req.body.phone,
      employeeId: req.body.employeeId,
      position: req.body.position,
      businessOwnerId,
      status: req.body.status || 'actif',
      workZone: req.body.workZone,
      address,
      salary: req.body.salary,
      notes: req.body.notes,
      linkedUserId: platformCollector._id
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
          linkedUserId: newCollector.linkedUserId,
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

    // Vérifier l'email si modifié → relier au compte Collectam correspondant
    let updateData = { ...req.body };
    // Si le collecteur n'était pas encore lié (ancien enregistrement), essayer de le lier via l'email actuel
    if (!collector.linkedUserId) {
      const emailToLink = (updateData.email || collector.email || '').toLowerCase();
      const platformCollectorForLegacy = await User.findOne({
        email: emailToLink,
        $or: [ { userType: 'collecteur' }, { role: 'collector' } ]
      }).select('_id');
      if (!platformCollectorForLegacy) {
        return res.status(400).json({ success: false, message: 'Ce collecteur n\'est pas lié à un compte Collectam. Modifiez son email pour un compte collecteur valide.' });
      }
      const alreadyLinkedLegacy = await BusinessCollector.findOne({
        businessOwnerId,
        linkedUserId: platformCollectorForLegacy._id,
        _id: { $ne: id }
      });
      if (alreadyLinkedLegacy) {
        return res.status(409).json({ success: false, message: 'Ce compte collecteur est déjà lié à votre organisation' });
      }
      updateData.linkedUserId = platformCollectorForLegacy._id;
      updateData.email = emailToLink;
    }
    if (updateData.email && updateData.email.toLowerCase() !== collector.email) {
      const email = updateData.email.toLowerCase();
      const existsOther = await BusinessCollector.findOne({ email, _id: { $ne: id } });
      if (existsOther) {
        return res.status(400).json({ success: false, message: 'Un collecteur avec cet email existe déjà' });
      }

      const platformCollector = await User.findOne({
        email,
        $or: [ { userType: 'collecteur' }, { role: 'collector' } ]
      }).select('_id');

      if (!platformCollector) {
        return res.status(400).json({ success: false, message: 'Cet email ne correspond à aucun compte collecteur Collectam' });
      }

      // Empêcher double liaison pour ce business
      const alreadyLinked = await BusinessCollector.findOne({
        businessOwnerId,
        linkedUserId: platformCollector._id,
        _id: { $ne: id }
      });
      if (alreadyLinked) {
        return res.status(409).json({ success: false, message: 'Ce collecteur est déjà lié à votre organisation' });
      }

      updateData.email = email;
      updateData.linkedUserId = platformCollector._id;
    }

    // Nettoyer l'adresse (supprimer rue / code postal)
    if (updateData.address) {
      updateData.address = {
        city: updateData.address.city || undefined,
        region: updateData.address.region || undefined,
        country: 'Cameroun'
      };
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

// Lister les collectes assignées aux collecteurs Business (nouveau + legacy)
const getAssignedCollections = async (req, res) => {
  try {
    const businessOwnerId = req.user.id;
    // Statuts par défaut: programmées et en cours
    const statusParam = (req.query.status || 'scheduled,in_progress').toString();
    const statuses = statusParam.split(',').map(s => s.trim()).filter(Boolean);
    const { from, to } = req.query;
    let dateFilter = {};
    if (from || to) {
      const start = from ? new Date(from) : new Date('1970-01-01');
      const end = to ? new Date(to) : new Date();
      dateFilter = { createdAt: { $gte: start, $lte: end } };
    }

    // Récupérer les linkedUserId des collecteurs de ce Business
    const collectors = await BusinessCollector.find({ businessOwnerId }).select('linkedUserId');
    const linkedCollectorIds = collectors.map(c => c.linkedUserId).filter(Boolean);

    if (linkedCollectorIds.length === 0) {
      return res.json({ success: true, data: [], count: 0 });
    }

    const mongoose = require('mongoose');
    const WasteRequest = require('../models/WasteRequest');
    const WasteCollectionRequest = require('../models/WasteCollectionRequest');

    // Construire filtres
    const linkedIds = linkedCollectorIds.map(id => typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id);

    const [newModel, legacyModel] = await Promise.all([
      WasteRequest.find({ assignedCollector: { $in: linkedIds }, status: { $in: statuses }, ...dateFilter })
        .populate('userId', 'firstName lastName phone')
        .populate('assignedCollector', 'firstName lastName phone email lastLocation')
        .sort({ scheduledDate: 1, createdAt: -1 })
        .lean(),
      WasteCollectionRequest.find({ assignedCollector: { $in: linkedIds }, status: { $in: statuses }, ...dateFilter })
        .populate('userId', 'firstName lastName phone')
        .populate('assignedCollector', 'firstName lastName phone email lastLocation')
        .sort({ preferredDate: 1, createdAt: -1 })
        .lean()
    ]);

    // Unifier le format
    const unified = [
      ...newModel.map(r => ({
        _id: r._id,
        model: 'new',
        user: r.userId,
        assignedCollector: r.assignedCollector,
        wasteType: r.wasteType,
        description: r.description,
        estimatedWeight: r.estimatedWeight,
        address: r.address,
        coordinates: r.coordinates, // { type: 'Point', coordinates: [lng, lat] }
        status: r.status,
        scheduledDate: r.scheduledDate || r.preferredDate,
        preferredDate: r.preferredDate,
        preferredTime: r.preferredTime,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      })),
      ...legacyModel.map(r => ({
        _id: r._id,
        model: 'legacy',
        user: r.userId,
        assignedCollector: r.assignedCollector,
        wasteType: r.wasteType,
        description: r.description,
        estimatedWeight: r.quantity,
        address: r.address,
        coordinates: Array.isArray(r.coordinates)
          ? { type: 'Point', coordinates: r.coordinates }
          : r.coordinates,
        status: r.status,
        scheduledDate: r.preferredDate,
        preferredDate: r.preferredDate,
        preferredTime: r.preferredTime,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }))
    ];

    res.json({ success: true, data: unified, count: unified.length });
  } catch (error) {
    console.error('❌ Erreur récupération collectes assignées Business:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des collectes assignées' });
  }
};

module.exports = {
  createBusinessCollector,
  getBusinessCollectors,
  getBusinessCollectorById,
  updateBusinessCollector,
  deleteBusinessCollector,
  assignVehicleToCollector,
  getAssignedCollections
};
