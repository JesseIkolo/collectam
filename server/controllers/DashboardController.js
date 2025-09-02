const User = require('../models/User');
const Organization = require('../models/Organization');
const Collection = require('../models/Collection');
const Mission = require('../models/Mission');
const Vehicle = require('../models/Vehicle');
const { requireDashboardAccess, requireAnalyticsAccess } = require('../middlewares/rbac');

/**
 * Dashboard Controller - Role-based dashboard data
 * Based on PROMPT_DASHBOARD_COLLECTAM_RBAC.md requirements
 */

/**
 * Get dashboard data based on user role
 */
const getDashboardData = async (req, res) => {
  try {
    const { role, organizationId, _id: userId } = req.user;
    let dashboardData = {};

    switch (role) {
      case 'admin':
        dashboardData = await getAdminDashboard();
        break;
      case 'org_admin':
        dashboardData = await getOrgAdminDashboard(organizationId);
        break;
      case 'collector':
        dashboardData = await getCollectorDashboard(userId);
        break;
      case 'user':
        dashboardData = await getUserDashboard(userId);
        break;
      default:
        return res.status(403).json({
          success: false,
          message: 'Invalid role for dashboard access'
        });
    }

    res.json({
      success: true,
      data: dashboardData,
      role,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
};

/**
 * ADMIN Dashboard - Global overview
 */
const getAdminDashboard = async () => {
  const [
    totalOrganizations,
    activeOrganizations,
    totalUsers,
    activeUsers,
    totalCollections,
    todayCollections,
    totalVehicles,
    activeVehicles
  ] = await Promise.all([
    Organization.countDocuments(),
    Organization.countDocuments({ status: 'active' }),
    User.countDocuments(),
    User.countDocuments({ lastSeenAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
    Collection.countDocuments(),
    Collection.countDocuments({ 
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }),
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: 'active' })
  ]);

  // Recent activity
  const recentOrganizations = await Organization.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name status createdAt');

  const recentCollections = await Collection.find()
    .populate('reportedBy', 'firstName lastName')
    .populate('organizationId', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  // Growth metrics
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const organizationGrowth = await Organization.countDocuments({
    createdAt: { $gte: lastMonth }
  });

  return {
    kpis: {
      organizations: {
        total: totalOrganizations,
        active: activeOrganizations,
        growth: organizationGrowth
      },
      users: {
        total: totalUsers,
        active: activeUsers
      },
      collections: {
        total: totalCollections,
        today: todayCollections
      },
      vehicles: {
        total: totalVehicles,
        active: activeVehicles
      }
    },
    recentActivity: {
      organizations: recentOrganizations,
      collections: recentCollections
    },
    charts: {
      organizationGrowth: await getOrganizationGrowthData(),
      collectionTrends: await getCollectionTrendsData()
    }
  };
};

/**
 * ORG_ADMIN Dashboard - Organization overview
 */
const getOrgAdminDashboard = async (organizationId) => {
  const [
    totalCollectors,
    activeCollectors,
    totalVehicles,
    activeVehicles,
    todayCollections,
    pendingCollections,
    activeMissions,
    completedMissions
  ] = await Promise.all([
    User.countDocuments({ organizationId, role: 'collector' }),
    User.countDocuments({ 
      organizationId, 
      role: 'collector', 
      onDuty: true 
    }),
    Vehicle.countDocuments({ organizationId }),
    Vehicle.countDocuments({ organizationId, status: 'active' }),
    Collection.countDocuments({ 
      organizationId,
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }),
    Collection.countDocuments({ organizationId, status: 'pending' }),
    Mission.countDocuments({ organizationId, status: 'in_progress' }),
    Mission.countDocuments({ 
      organizationId, 
      status: 'completed',
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    })
  ]);

  // Active missions with details
  const activeMissionsDetails = await Mission.find({ 
    organizationId, 
    status: 'in_progress' 
  })
    .populate('assignedTo', 'firstName lastName')
    .populate('vehicleId', 'licensePlate type')
    .limit(10);

  // Vehicle locations for map
  const vehicleLocations = await Vehicle.find({ 
    organizationId, 
    status: 'active',
    'location.coordinates': { $exists: true }
  }).select('licensePlate type location status');

  return {
    kpis: {
      collectors: {
        total: totalCollectors,
        active: activeCollectors
      },
      vehicles: {
        total: totalVehicles,
        active: activeVehicles
      },
      collections: {
        today: todayCollections,
        pending: pendingCollections
      },
      missions: {
        active: activeMissions,
        completed: completedMissions
      }
    },
    activeMissions: activeMissionsDetails,
    vehicleLocations,
    alerts: await getOrgAlerts(organizationId)
  };
};

/**
 * COLLECTOR Dashboard - Personal missions
 */
const getCollectorDashboard = async (userId) => {
  const collector = await User.findById(userId).populate('organizationId', 'name');
  
  const [
    activeMission,
    todayMissions,
    completedToday,
    totalCompleted
  ] = await Promise.all([
    Mission.findOne({ 
      assignedTo: userId, 
      status: 'in_progress' 
    }).populate('vehicleId', 'licensePlate type'),
    Mission.find({
      assignedTo: userId,
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }).populate('vehicleId', 'licensePlate'),
    Mission.countDocuments({
      assignedTo: userId,
      status: 'completed',
      completedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }),
    Mission.countDocuments({
      assignedTo: userId,
      status: 'completed'
    })
  ]);

  // Vehicle status if assigned
  let vehicleStatus = null;
  if (activeMission && activeMission.vehicleId) {
    vehicleStatus = await Vehicle.findById(activeMission.vehicleId);
  }

  return {
    collector: {
      name: `${collector.firstName} ${collector.lastName}`,
      onDuty: collector.onDuty,
      organization: collector.organizationId.name
    },
    missions: {
      active: activeMission,
      today: todayMissions,
      completedToday,
      totalCompleted
    },
    vehicle: vehicleStatus,
    performance: {
      completionRate: totalCompleted > 0 ? (completedToday / todayMissions.length * 100) : 0,
      points: collector.points || 0
    }
  };
};

/**
 * USER Dashboard - Personal waste management
 */
const getUserDashboard = async (userId) => {
  const user = await User.findById(userId);
  
  const [
    totalReports,
    pendingReports,
    completedReports,
    scheduledCollections
  ] = await Promise.all([
    Collection.countDocuments({ reportedBy: userId }),
    Collection.countDocuments({ reportedBy: userId, status: 'pending' }),
    Collection.countDocuments({ reportedBy: userId, status: 'completed' }),
    Collection.find({ 
      reportedBy: userId, 
      status: 'scheduled' 
    }).sort({ scheduledDate: 1 }).limit(5)
  ]);

  // Calculate environmental impact
  const impactData = await calculateUserImpact(userId);

  return {
    user: {
      name: `${user.firstName} ${user.lastName}`,
      points: user.points || 0
    },
    reports: {
      total: totalReports,
      pending: pendingReports,
      completed: completedReports
    },
    scheduledCollections,
    impact: impactData,
    rewards: await getUserRewards(userId)
  };
};

/**
 * Helper functions
 */
const getOrganizationGrowthData = async () => {
  const last6Months = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
  
  const growthData = await Organization.aggregate([
    { $match: { createdAt: { $gte: last6Months } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return growthData;
};

const getCollectionTrendsData = async () => {
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const trendsData = await Collection.aggregate([
    { $match: { createdAt: { $gte: last30Days } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  return trendsData;
};

const getOrgAlerts = async (organizationId) => {
  const alerts = [];
  
  // Vehicle maintenance alerts
  const maintenanceAlerts = await Vehicle.find({
    organizationId,
    maintenanceStatus: 'due'
  }).select('licensePlate maintenanceStatus');
  
  alerts.push(...maintenanceAlerts.map(v => ({
    type: 'maintenance',
    message: `Vehicle ${v.licensePlate} requires maintenance`,
    severity: 'warning'
  })));

  return alerts;
};

const calculateUserImpact = async (userId) => {
  const completedCollections = await Collection.find({
    reportedBy: userId,
    status: 'completed'
  });

  // Simple impact calculation (can be enhanced)
  const totalWaste = completedCollections.reduce((sum, collection) => {
    return sum + (collection.estimatedWeight || 0);
  }, 0);

  return {
    wasteCollected: totalWaste,
    co2Saved: totalWaste * 0.5, // Simplified calculation
    treesEquivalent: Math.floor(totalWaste / 10)
  };
};

const getUserRewards = async (userId) => {
  const user = await User.findById(userId);
  const points = user.points || 0;
  
  const badges = [];
  if (points >= 100) badges.push({ name: 'Eco-warrior', icon: '🏆' });
  if (points >= 50) badges.push({ name: 'Recycleur', icon: '♻️' });
  if (points >= 10) badges.push({ name: 'Vert', icon: '🌱' });

  return {
    points,
    badges,
    nextReward: points < 100 ? { name: 'Eco-warrior', pointsNeeded: 100 - points } : null
  };
};

module.exports = {
  getDashboardData
};
