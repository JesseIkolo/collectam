const geolib = require('geolib');
const Collection = require('../models/Collection');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

class MatchingService {
  // AI-based collector assignment algorithm
  async assignOptimalCollector(collectionId) {
    try {
      const collection = await Collection.findById(collectionId).populate('userId');
      if (!collection) {
        throw new Error('Collection not found');
      }

      // Get available collectors within radius
      const availableCollectors = await this.getAvailableCollectors(
        collection.location.coordinates,
        10000 // 10km radius
      );

      if (availableCollectors.length === 0) {
        throw new Error('No available collectors in the area');
      }

      // Score collectors based on multiple factors
      const scoredCollectors = await this.scoreCollectors(collection, availableCollectors);

      // Sort by score (highest first)
      scoredCollectors.sort((a, b) => b.score - a.score);

      return {
        success: true,
        recommendedCollector: scoredCollectors[0],
        alternatives: scoredCollectors.slice(1, 3)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get available collectors within radius
  async getAvailableCollectors(coordinates, radiusInMeters) {
    const collectors = await User.find({
      role: 'collector',
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: radiusInMeters
        }
      }
    }).populate('currentMissions');

    // Filter out busy collectors
    return collectors.filter(collector => {
      const activeMissions = collector.currentMissions?.filter(
        mission => mission.status === 'in-progress'
      ) || [];
      return activeMissions.length < 3; // Max 3 concurrent missions
    });
  }

  // Score collectors based on multiple factors
  async scoreCollectors(collection, collectors) {
    const scoredCollectors = [];

    for (const collector of collectors) {
      let score = 0;

      // Distance factor (closer = higher score)
      const distance = geolib.getDistance(
        { latitude: collection.location.coordinates[1], longitude: collection.location.coordinates[0] },
        { latitude: collector.address.coordinates[1], longitude: collector.address.coordinates[0] }
      );
      const distanceScore = Math.max(0, 100 - (distance / 100)); // 100 points max, -1 per 100m
      score += distanceScore * 0.4; // 40% weight

      // Rating factor
      const ratingScore = (collector.rating || 4.0) * 20; // 0-100 scale
      score += ratingScore * 0.3; // 30% weight

      // Experience factor (completed collections)
      const experienceScore = Math.min(100, (collector.completedCollections || 0) * 2);
      score += experienceScore * 0.2; // 20% weight

      // Availability factor (fewer active missions = higher score)
      const activeMissions = collector.currentMissions?.filter(
        mission => mission.status === 'in-progress'
      )?.length || 0;
      const availabilityScore = Math.max(0, 100 - (activeMissions * 33));
      score += availabilityScore * 0.1; // 10% weight

      scoredCollectors.push({
        collector,
        score: Math.round(score),
        factors: {
          distance: Math.round(distance),
          distanceScore: Math.round(distanceScore),
          rating: collector.rating || 4.0,
          ratingScore: Math.round(ratingScore),
          experience: collector.completedCollections || 0,
          experienceScore: Math.round(experienceScore),
          activeMissions,
          availabilityScore: Math.round(availabilityScore)
        }
      });
    }

    return scoredCollectors;
  }

  // Optimize route for multiple collections
  async optimizeRoute(collectorId, collectionIds) {
    try {
      const collector = await User.findById(collectorId);
      const collections = await Collection.find({
        _id: { $in: collectionIds }
      });

      if (!collector || collections.length === 0) {
        throw new Error('Invalid collector or collections');
      }

      // Simple nearest neighbor algorithm for route optimization
      const optimizedRoute = this.nearestNeighborRoute(
        collector.address.coordinates,
        collections
      );

      return {
        success: true,
        route: optimizedRoute,
        totalDistance: this.calculateTotalDistance(optimizedRoute),
        estimatedTime: this.estimateRouteTime(optimizedRoute)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Nearest neighbor route optimization
  nearestNeighborRoute(startCoordinates, collections) {
    const route = [];
    let currentPosition = startCoordinates;
    let remainingCollections = [...collections];

    while (remainingCollections.length > 0) {
      let nearestIndex = 0;
      let shortestDistance = Infinity;

      remainingCollections.forEach((collection, index) => {
        const distance = geolib.getDistance(
          { latitude: currentPosition[1], longitude: currentPosition[0] },
          { latitude: collection.location.coordinates[1], longitude: collection.location.coordinates[0] }
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestIndex = index;
        }
      });

      const nextCollection = remainingCollections.splice(nearestIndex, 1)[0];
      route.push({
        collection: nextCollection,
        distance: shortestDistance
      });
      currentPosition = nextCollection.location.coordinates;
    }

    return route;
  }

  // Calculate total route distance
  calculateTotalDistance(route) {
    return route.reduce((total, stop) => total + stop.distance, 0);
  }

  // Estimate route completion time
  estimateRouteTime(route) {
    const totalDistance = this.calculateTotalDistance(route);
    const averageSpeed = 30; // km/h in urban areas
    const collectionTime = route.length * 15; // 15 minutes per collection
    
    const travelTime = (totalDistance / 1000) / averageSpeed * 60; // minutes
    return Math.round(travelTime + collectionTime);
  }

  // Generate heatmap data for waste hotspots
  async generateHeatmapData(bounds, timeframe = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      const collections = await Collection.find({
        createdAt: { $gte: startDate },
        'location.coordinates': {
          $geoWithin: {
            $box: bounds // [[lng1, lat1], [lng2, lat2]]
          }
        }
      });

      // Group collections by grid cells
      const gridSize = 0.001; // ~100m grid
      const heatmapData = {};

      collections.forEach(collection => {
        const [lng, lat] = collection.location.coordinates;
        const gridLng = Math.floor(lng / gridSize) * gridSize;
        const gridLat = Math.floor(lat / gridSize) * gridSize;
        const key = `${gridLng},${gridLat}`;

        if (!heatmapData[key]) {
          heatmapData[key] = {
            coordinates: [gridLng, gridLat],
            count: 0,
            wasteTypes: {}
          };
        }

        heatmapData[key].count++;
        heatmapData[key].wasteTypes[collection.wasteType] = 
          (heatmapData[key].wasteTypes[collection.wasteType] || 0) + 1;
      });

      return {
        success: true,
        data: Object.values(heatmapData)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new MatchingService();
