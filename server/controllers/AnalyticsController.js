const User = require('../models/User');
const Organization = require('../models/Organization');
const Collection = require('../models/Collection');
const Mission = require('../models/Mission');
const Vehicle = require('../models/Vehicle');

/**
 * Analytics Controller - Role-based analytics data
 * Supports the dashboard analytics requirements
 */

/**
 * Get global analytics (Admin only)
 */
const getGlobalAnalytics = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const dateRange = getDateRange(timeframe);

    const [
      organizationStats,
      userStats,
      collectionStats,
      performanceMetrics
    ] = await Promise.all([
      getOrganizationAnalyticsHelper(dateRange),
      getUserAnalytics(dateRange),
      getCollectionAnalytics(dateRange),
      getPerformanceMetrics(dateRange)
    ]);

    res.json({
      success: true,
      data: {
        timeframe,
        organizations: organizationStats,
        users: userStats,
        collections: collectionStats,
        performance: performanceMetrics
      }
    });
  } catch (error) {
    console.error('Global analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve global analytics'
    });
  }
};

/**
 * Get organization analytics (Org Admin)
 */
const getOrganizationAnalytics = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { timeframe = '30d' } = req.query;
    const dateRange = getDateRange(timeframe);

    const [
      collectorPerformance,
      vehicleUtilization,
      collectionMetrics,
      efficiency
    ] = await Promise.all([
      getCollectorPerformance(organizationId, dateRange),
      getVehicleUtilization(organizationId, dateRange),
      getOrgCollectionMetrics(organizationId, dateRange),
      getOrgEfficiency(organizationId, dateRange)
    ]);

    res.json({
      success: true,
      data: {
        timeframe,
        collectors: collectorPerformance,
        vehicles: vehicleUtilization,
        collections: collectionMetrics,
        efficiency
      }
    });
  } catch (error) {
    console.error('Organization analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve organization analytics'
    });
  }
};

/**
 * Get personal analytics (All users)
 */
const getPersonalAnalytics = async (req, res) => {
  try {
    const { _id: userId, role } = req.user;
    const { timeframe = '30d' } = req.query;
    const dateRange = getDateRange(timeframe);

    let analyticsData = {};

    switch (role) {
      case 'collector':
        analyticsData = await getCollectorPersonalAnalytics(userId, dateRange);
        break;
      case 'user':
        analyticsData = await getUserPersonalAnalytics(userId, dateRange);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Personal analytics not available for this role'
        });
    }

    res.json({
      success: true,
      data: {
        timeframe,
        ...analyticsData
      }
    });
  } catch (error) {
    console.error('Personal analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve personal analytics'
    });
  }
};

/**
 * Helper functions for analytics calculations
 */

const getDateRange = (timeframe) => {
  const now = new Date();
  let startDate;

  switch (timeframe) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { startDate, endDate: now };
};

const getOrganizationAnalyticsHelper = async (dateRange) => {
  const { startDate, endDate } = dateRange;

  const [total, active, growth] = await Promise.all([
    Organization.countDocuments(),
    Organization.countDocuments({ status: 'active' }),
    Organization.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    })
  ]);

  const regionDistribution = await Organization.aggregate([
    {
      $group: {
        _id: '$address.country',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return {
    total,
    active,
    growth,
    regionDistribution
  };
};

const getUserAnalytics = async (dateRange) => {
  const { startDate, endDate } = dateRange;

  const [total, active, byRole] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({
      lastSeenAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }),
    User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const growth = await User.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  });

  return {
    total,
    active,
    growth,
    byRole
  };
};

const getCollectionAnalytics = async (dateRange) => {
  const { startDate, endDate } = dateRange;

  const [total, completed, pending] = await Promise.all([
    Collection.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    Collection.countDocuments({
      status: 'completed',
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    Collection.countDocuments({ status: 'pending' })
  ]);

  const dailyTrends = await Collection.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
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

  return {
    total,
    completed,
    pending,
    completionRate: total > 0 ? (completed / total * 100) : 0,
    dailyTrends
  };
};

const getPerformanceMetrics = async (dateRange) => {
  const { startDate, endDate } = dateRange;

  const avgResponseTime = await Collection.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        avgTime: {
          $avg: {
            $subtract: ['$completedAt', '$createdAt']
          }
        }
      }
    }
  ]);

  return {
    avgResponseTime: avgResponseTime[0]?.avgTime || 0
  };
};

const getCollectorPerformance = async (organizationId, dateRange) => {
  const { startDate, endDate } = dateRange;

  const performance = await Mission.aggregate([
    {
      $match: {
        organizationId,
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'collector'
      }
    },
    {
      $group: {
        _id: '$assignedTo',
        collector: { $first: { $arrayElemAt: ['$collector', 0] } },
        totalMissions: { $sum: 1 },
        completedMissions: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        collectorName: {
          $concat: ['$collector.firstName', ' ', '$collector.lastName']
        },
        totalMissions: 1,
        completedMissions: 1,
        completionRate: {
          $multiply: [
            { $divide: ['$completedMissions', '$totalMissions'] },
            100
          ]
        }
      }
    }
  ]);

  return performance;
};

const getVehicleUtilization = async (organizationId, dateRange) => {
  const vehicles = await Vehicle.find({ organizationId })
    .select('licensePlate type status');

  const utilization = await Mission.aggregate([
    {
      $match: {
        organizationId,
        createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
      }
    },
    {
      $group: {
        _id: '$vehicleId',
        missionCount: { $sum: 1 }
      }
    }
  ]);

  return vehicles.map(vehicle => {
    const usage = utilization.find(u => u._id?.toString() === vehicle._id.toString());
    return {
      vehicle: vehicle.licensePlate,
      type: vehicle.type,
      status: vehicle.status,
      missionCount: usage?.missionCount || 0
    };
  });
};

const getOrgCollectionMetrics = async (organizationId, dateRange) => {
  const { startDate, endDate } = dateRange;

  const metrics = await Collection.aggregate([
    {
      $match: {
        organizationId,
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalWeight: { $sum: '$estimatedWeight' }
      }
    }
  ]);

  return metrics[0] || { total: 0, completed: 0, totalWeight: 0 };
};

const getOrgEfficiency = async (organizationId, dateRange) => {
  // Calculate efficiency metrics for the organization
  const missions = await Mission.find({
    organizationId,
    status: 'completed',
    createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
  });

  const avgMissionTime = missions.reduce((sum, mission) => {
    const duration = mission.completedAt - mission.createdAt;
    return sum + duration;
  }, 0) / missions.length;

  return {
    avgMissionTime: avgMissionTime || 0,
    totalMissions: missions.length
  };
};

const getCollectorPersonalAnalytics = async (userId, dateRange) => {
  const { startDate, endDate } = dateRange;

  const [missions, performance] = await Promise.all([
    Mission.find({
      assignedTo: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    Mission.aggregate([
      {
        $match: {
          assignedTo: userId,
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          avgCompletionTime: {
            $avg: {
              $subtract: ['$completedAt', '$createdAt']
            }
          },
          totalCompleted: { $sum: 1 }
        }
      }
    ])
  ]);

  return {
    totalMissions: missions.length,
    completedMissions: missions.filter(m => m.status === 'completed').length,
    avgCompletionTime: performance[0]?.avgCompletionTime || 0,
    efficiency: performance[0]?.totalCompleted || 0
  };
};

const getUserPersonalAnalytics = async (userId, dateRange) => {
  const { startDate, endDate } = dateRange;

  const [reports, impact] = await Promise.all([
    Collection.find({
      reportedBy: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    Collection.aggregate([
      {
        $match: {
          reportedBy: userId,
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalWeight: { $sum: '$estimatedWeight' },
          totalReports: { $sum: 1 }
        }
      }
    ])
  ]);

  const impactData = impact[0] || { totalWeight: 0, totalReports: 0 };

  return {
    totalReports: reports.length,
    completedReports: reports.filter(r => r.status === 'completed').length,
    environmentalImpact: {
      wasteCollected: impactData.totalWeight,
      co2Saved: impactData.totalWeight * 0.5,
      treesEquivalent: Math.floor(impactData.totalWeight / 10)
    }
  };
};

module.exports = {
  getGlobalAnalytics,
  getOrganizationAnalytics,
  getPersonalAnalytics
};
