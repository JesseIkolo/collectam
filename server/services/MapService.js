const axios = require('axios');
const geolib = require('geolib');
const Collection = require('../models/Collection');

class MapService {
  constructor() {
    this.osmBaseUrl = 'https://nominatim.openstreetmap.org';
    this.overpassUrl = 'https://overpass-api.de/api/interpreter';
  }

  // Geocode address to coordinates using OpenStreetMap
  async geocodeAddress(address) {
    try {
      const response = await axios.get(`${this.osmBaseUrl}/search`, {
        params: {
          q: address,
          format: 'json',
          limit: 1,
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'Nacollect-Backend/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          success: true,
          coordinates: [parseFloat(result.lon), parseFloat(result.lat)],
          displayName: result.display_name,
          address: result.address
        };
      }

      return {
        success: false,
        error: 'Address not found'
      };
    } catch (error) {
      return {
        success: false,
        error: `Geocoding failed: ${error.message}`
      };
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(longitude, latitude) {
    try {
      const response = await axios.get(`${this.osmBaseUrl}/reverse`, {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'Nacollect-Backend/1.0'
        }
      });

      if (response.data) {
        return {
          success: true,
          address: response.data.display_name,
          details: response.data.address
        };
      }

      return {
        success: false,
        error: 'Location not found'
      };
    } catch (error) {
      return {
        success: false,
        error: `Reverse geocoding failed: ${error.message}`
      };
    }
  }

  // Generate heatmap data for waste hotspots
  async generateHeatmap(bounds, timeframe = 30, gridSize = 0.001) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      // Get collections within bounds and timeframe
      const collections = await Collection.find({
        createdAt: { $gte: startDate },
        'location.coordinates': {
          $geoWithin: {
            $box: bounds // [[lng1, lat1], [lng2, lat2]]
          }
        }
      });

      // Create grid-based heatmap
      const heatmapGrid = {};
      const wasteTypeColors = {
        organic: '#4CAF50',
        plastic: '#FF9800',
        paper: '#2196F3',
        glass: '#9C27B0',
        metal: '#607D8B',
        electronic: '#F44336',
        hazardous: '#E91E63',
        mixed: '#795548'
      };

      collections.forEach(collection => {
        const [lng, lat] = collection.location.coordinates;
        const gridLng = Math.floor(lng / gridSize) * gridSize;
        const gridLat = Math.floor(lat / gridSize) * gridSize;
        const key = `${gridLng},${gridLat}`;

        if (!heatmapGrid[key]) {
          heatmapGrid[key] = {
            coordinates: [gridLng + gridSize/2, gridLat + gridSize/2],
            count: 0,
            intensity: 0,
            wasteTypes: {},
            collections: []
          };
        }

        heatmapGrid[key].count++;
        heatmapGrid[key].intensity = Math.min(100, heatmapGrid[key].count * 10);
        heatmapGrid[key].wasteTypes[collection.wasteType] = 
          (heatmapGrid[key].wasteTypes[collection.wasteType] || 0) + 1;
        heatmapGrid[key].collections.push(collection._id);
      });

      // Convert to array and add visualization data
      const heatmapData = Object.values(heatmapGrid).map(cell => ({
        ...cell,
        radius: Math.max(50, cell.count * 20),
        color: this.getHeatmapColor(cell.intensity),
        dominantWasteType: this.getDominantWasteType(cell.wasteTypes),
        wasteTypeColor: wasteTypeColors[this.getDominantWasteType(cell.wasteTypes)] || '#9E9E9E'
      }));

      return {
        success: true,
        data: heatmapData,
        metadata: {
          totalCollections: collections.length,
          gridSize,
          timeframe,
          bounds,
          generatedAt: new Date()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Heatmap generation failed: ${error.message}`
      };
    }
  }

  // Get heatmap color based on intensity
  getHeatmapColor(intensity) {
    if (intensity >= 80) return '#FF0000'; // Red - Very High
    if (intensity >= 60) return '#FF8000'; // Orange - High
    if (intensity >= 40) return '#FFFF00'; // Yellow - Medium
    if (intensity >= 20) return '#80FF00'; // Light Green - Low
    return '#00FF00'; // Green - Very Low
  }

  // Get dominant waste type in a grid cell
  getDominantWasteType(wasteTypes) {
    let maxCount = 0;
    let dominantType = 'mixed';

    Object.entries(wasteTypes).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantType = type;
      }
    });

    return dominantType;
  }

  // Find optimal collection routes
  async findOptimalRoute(startLocation, destinations, vehicleType = 'truck') {
    try {
      // Simple nearest neighbor algorithm for route optimization
      const route = [];
      let currentLocation = startLocation;
      let remainingDestinations = [...destinations];

      while (remainingDestinations.length > 0) {
        let nearestIndex = 0;
        let shortestDistance = Infinity;

        remainingDestinations.forEach((destination, index) => {
          const distance = geolib.getDistance(
            { latitude: currentLocation[1], longitude: currentLocation[0] },
            { latitude: destination.coordinates[1], longitude: destination.coordinates[0] }
          );

          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestIndex = index;
          }
        });

        const nextDestination = remainingDestinations.splice(nearestIndex, 1)[0];
        route.push({
          ...nextDestination,
          distance: shortestDistance,
          estimatedTime: this.calculateTravelTime(shortestDistance, vehicleType)
        });

        currentLocation = nextDestination.coordinates;
      }

      const totalDistance = route.reduce((sum, stop) => sum + stop.distance, 0);
      const totalTime = route.reduce((sum, stop) => sum + stop.estimatedTime, 0);

      return {
        success: true,
        route,
        summary: {
          totalDistance,
          totalTime,
          stops: route.length,
          efficiency: this.calculateRouteEfficiency(totalDistance, route.length)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Route optimization failed: ${error.message}`
      };
    }
  }

  // Calculate travel time based on distance and vehicle type
  calculateTravelTime(distanceInMeters, vehicleType) {
    const speeds = {
      truck: 25, // km/h in urban areas
      van: 30,
      motorcycle: 35,
      bicycle: 15
    };

    const speed = speeds[vehicleType] || 25;
    const distanceInKm = distanceInMeters / 1000;
    return Math.round((distanceInKm / speed) * 60); // minutes
  }

  // Calculate route efficiency score
  calculateRouteEfficiency(totalDistance, numberOfStops) {
    const averageDistancePerStop = totalDistance / numberOfStops;
    const idealDistance = 1000; // 1km ideal average
    
    if (averageDistancePerStop <= idealDistance) {
      return Math.round(100 - (averageDistancePerStop / idealDistance) * 20);
    } else {
      return Math.max(20, 80 - ((averageDistancePerStop - idealDistance) / 1000) * 10);
    }
  }

  // Get nearby waste collection points
  async getNearbyCollections(coordinates, radiusInMeters = 5000, status = 'pending') {
    try {
      const collections = await Collection.find({
        status,
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates
            },
            $maxDistance: radiusInMeters
          }
        }
      }).populate('userId', 'email phone');

      return {
        success: true,
        collections,
        count: collections.length
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to find nearby collections: ${error.message}`
      };
    }
  }

  // Calculate service area coverage
  async calculateServiceCoverage(centerPoint, serviceRadius, gridResolution = 500) {
    try {
      const coverage = {
        totalArea: Math.PI * Math.pow(serviceRadius, 2),
        coveredCells: 0,
        uncoveredCells: 0,
        coveragePercentage: 0,
        grid: []
      };

      // Create grid within service radius
      const steps = Math.ceil((serviceRadius * 2) / gridResolution);
      
      for (let x = -steps/2; x <= steps/2; x++) {
        for (let y = -steps/2; y <= steps/2; y++) {
          const cellCenter = [
            centerPoint[0] + (x * gridResolution / 111320), // Convert meters to degrees
            centerPoint[1] + (y * gridResolution / 110540)
          ];

          const distance = geolib.getDistance(
            { latitude: centerPoint[1], longitude: centerPoint[0] },
            { latitude: cellCenter[1], longitude: cellCenter[0] }
          );

          if (distance <= serviceRadius) {
            const cellData = {
              coordinates: cellCenter,
              distance,
              covered: distance <= serviceRadius * 0.8, // 80% inner coverage
              gridX: x,
              gridY: y
            };

            coverage.grid.push(cellData);
            
            if (cellData.covered) {
              coverage.coveredCells++;
            } else {
              coverage.uncoveredCells++;
            }
          }
        }
      }

      coverage.coveragePercentage = Math.round(
        (coverage.coveredCells / (coverage.coveredCells + coverage.uncoveredCells)) * 100
      );

      return {
        success: true,
        coverage
      };
    } catch (error) {
      return {
        success: false,
        error: `Coverage calculation failed: ${error.message}`
      };
    }
  }
}

module.exports = new MapService();
