const geolib = require('geolib');
const Collection = require('../models/Collection');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

class MatchingService {
  // Backward-compatible alias used by controllers
  async assignCollector(collectionId, organizationId) {
    return this.assignOptimalCollector(collectionId, organizationId);
  }

  // AI-based collector assignment algorithm (scoped by organization when provided)
  async assignOptimalCollector(collectionId, organizationId) {
    try {
      const collection = await Collection.findById(collectionId).populate('userId');
      if (!collection) {
        throw new Error('Collection not found');
      }

      // Determine org-scoped settings if available
      let radius = 10000;
      let maxActive = 5;
      try {
        const Organization = require('../models/Organization');
        const org = organizationId ? await Organization.findById(organizationId).select('settings') : null;
        if (org && org.settings) {
          radius = org.settings.autoAssignRadiusMeters || radius;
          maxActive = org.settings.maxActiveMissionsPerCollector || maxActive;
        }
      } catch (_) { /* use defaults if any issue */ }

      // Get available collectors within radius or all if coordinates missing
      const availableCollectors = await this.getAvailableCollectors(
        collection.location?.coordinates,
        radius,
        organizationId,
        maxActive
      );

      if (availableCollectors.length === 0) {
        throw new Error('No available collectors');
      }

      // Score collectors based on multiple factors
      const scoredCollectors = await this.scoreCollectors(collection, availableCollectors);
      scoredCollectors.sort((a, b) => b.score - a.score);

      return {
        success: true,
        recommendedCollector: scoredCollectors[0].collector,
        alternatives: scoredCollectors.slice(1, 3).map(s => s.collector)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get available collectors within radius, scoped by organization
  async getAvailableCollectors(coordinates, radiusInMeters, organizationId, maxActiveMissionsPerCollector = 5) {
    const baseFilter = { role: 'collector', onDuty: true };
    if (organizationId) baseFilter.organizationId = organizationId;

    // If we have coordinates, try geospatial proximity; if none found, fallback to non-geo list
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      try {
        const collectors = await User.find({
          ...baseFilter,
          'address.coordinates': {
            $near: {
              $geometry: { type: 'Point', coordinates },
              $maxDistance: radiusInMeters
            }
          }
        });
        const nearby = this.filterAvailable(collectors);
        if (nearby && nearby.length > 0) {
          return nearby;
        }
        // If geospatial search yields no results, fall through to non-geo search
      } catch (_) {
        // Fall through to non-geo
      }
    }

    const collectors = await User.find(baseFilter).limit(100);
    return this.filterAvailable(collectors, maxActiveMissionsPerCollector);
  }

  async countActiveMissionsForCollector(collectorId, organizationId) {
    try {
      const Mission = require('../models/Mission');
      return Mission.countDocuments({ collectorId, organizationId, status: { $in: ['assigned', 'in-progress'] } });
    } catch (_) {
      return 0;
    }
  }

  async filterAvailable(collectors, maxActiveMissionsPerCollector = 5) {
    const filtered = [];
    for (const c of collectors) {
      const active = await this.countActiveMissionsForCollector(c._id, c.organizationId);
      if (active < maxActiveMissionsPerCollector) filtered.push(c);
    }
    return filtered;
  }

  // Score collectors based on distance and simple heuristics
  async scoreCollectors(collection, collectors) {
    const scoredCollectors = [];

    for (const collector of collectors) {
      let score = 0;

      // Distance factor if both have coordinates
      let distance = 100000; // default large distance
      if (collection.location?.coordinates && collector.address?.coordinates) {
        distance = geolib.getDistance(
          { latitude: collection.location.coordinates[1], longitude: collection.location.coordinates[0] },
          { latitude: collector.address.coordinates[1], longitude: collector.address.coordinates[0] }
        );
      }
      const distanceScore = Math.max(0, 100 - (distance / 100));
      score += distanceScore * 0.6;

      // Experience factor (optional fields)
      const experienceScore = Math.min(100, (collector.completedCollections || 0) * 2);
      score += experienceScore * 0.2;

      // Light load factor (fewer active missions preferred)
      const activeMissions = (collector.currentMissions || []).filter(m => m.status === 'in-progress').length;
      const availabilityScore = Math.max(0, 100 - (activeMissions * 33));
      score += availabilityScore * 0.2;

      scoredCollectors.push({ collector, score });
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

      // choose start coordinates: prefer lastLocation, then address, else first collection
      let startCoordinates = collector?.lastLocation?.coordinates || collector?.address?.coordinates;
      if (!startCoordinates && collections[0]?.location?.coordinates) {
        startCoordinates = collections[0].location.coordinates;
      }

      const optimizedRoute = this.nearestNeighborRoute(startCoordinates, collections);

      return {
        success: true,
        route: optimizedRoute,
        totalDistance: this.calculateTotalDistance(optimizedRoute),
        estimatedTime: this.estimateRouteTime(optimizedRoute)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

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
      route.push({ collection: nextCollection, distance: shortestDistance });
      currentPosition = nextCollection.location.coordinates;
    }

    return route;
  }

  calculateTotalDistance(route) { return route.reduce((total, stop) => total + stop.distance, 0); }

  estimateRouteTime(route) {
    const totalDistance = this.calculateTotalDistance(route);
    const averageSpeed = 30; // km/h in urban areas
    const collectionTime = route.length * 15; // minutes per collection
    const travelTime = (totalDistance / 1000) / averageSpeed * 60;
    return Math.round(travelTime + collectionTime);
  }

  async generateHeatmapData(bounds, timeframe = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);
      const collections = await Collection.find({
        createdAt: { $gte: startDate },
        'location.coordinates': { $geoWithin: { $box: bounds } }
      });
      const gridSize = 0.001;
      const heatmapData = {};
      collections.forEach(collection => {
        const [lng, lat] = collection.location.coordinates;
        const gridLng = Math.floor(lng / gridSize) * gridSize;
        const gridLat = Math.floor(lat / gridSize) * gridSize;
        const key = `${gridLng},${gridLat}`;
        if (!heatmapData[key]) heatmapData[key] = { coordinates: [gridLng, gridLat], count: 0, wasteTypes: {} };
        heatmapData[key].count++;
        heatmapData[key].wasteTypes[collection.wasteType] = (heatmapData[key].wasteTypes[collection.wasteType] || 0) + 1;
      });
      return { success: true, data: Object.values(heatmapData) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new MatchingService();
