const geolib = require('geolib');
const MapService = require('../services/MapService');

class MapMiddleware {
  // Validate and normalize geolocation data
  validateGeoLocation(req, res, next) {
    try {
      const { location } = req.body;

      if (!location || !location.coordinates) {
        return res.status(400).json({
          success: false,
          message: 'Location coordinates are required'
        });
      }

      const [longitude, latitude] = location.coordinates;

      // Validate coordinate ranges
      if (typeof longitude !== 'number' || typeof latitude !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Coordinates must be numbers'
        });
      }

      if (longitude < -180 || longitude > 180) {
        return res.status(400).json({
          success: false,
          message: 'Longitude must be between -180 and 180'
        });
      }

      if (latitude < -90 || latitude > 90) {
        return res.status(400).json({
          success: false,
          message: 'Latitude must be between -90 and 90'
        });
      }

      // Normalize location format for MongoDB 2dsphere
      req.body.location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location data',
        error: error.message
      });
    }
  }

  // Add address information from coordinates
  async enrichWithAddress(req, res, next) {
    try {
      if (req.body.location && req.body.location.coordinates) {
        const [longitude, latitude] = req.body.location.coordinates;
        
        const addressResult = await MapService.reverseGeocode(longitude, latitude);
        
        if (addressResult.success) {
          req.body.address = {
            formatted: addressResult.address,
            details: addressResult.details
          };
        }
      }
      
      next();
    } catch (error) {
      // Don't fail the request if address enrichment fails
      next();
    }
  }

  // Validate service area coverage
  validateServiceArea(allowedBounds) {
    return (req, res, next) => {
      try {
        const { location } = req.body;
        
        if (!location || !location.coordinates) {
          return next();
        }

        const [longitude, latitude] = location.coordinates;
        
        // Check if coordinates are within allowed service bounds
        const isWithinBounds = geolib.isPointInPolygon(
          { latitude, longitude },
          allowedBounds
        );

        if (!isWithinBounds) {
          return res.status(400).json({
            success: false,
            message: 'Location is outside service area',
            serviceArea: allowedBounds
          });
        }

        next();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Service area validation failed',
          error: error.message
        });
      }
    };
  }

  // Calculate distance between two points
  calculateDistance(req, res, next) {
    try {
      if (req.body.startLocation && req.body.endLocation) {
        const distance = geolib.getDistance(
          {
            latitude: req.body.startLocation.coordinates[1],
            longitude: req.body.startLocation.coordinates[0]
          },
          {
            latitude: req.body.endLocation.coordinates[1],
            longitude: req.body.endLocation.coordinates[0]
          }
        );

        req.calculatedDistance = distance;
        req.body.distance = distance;
      }

      next();
    } catch (error) {
      next(); // Don't fail if distance calculation fails
    }
  }

  // Validate GPS tracking data
  validateGpsData(req, res, next) {
    try {
      const { gpsData } = req.body;

      if (!gpsData) {
        return res.status(400).json({
          success: false,
          message: 'GPS data is required'
        });
      }

      const requiredFields = ['latitude', 'longitude', 'timestamp'];
      const missingFields = requiredFields.filter(field => !gpsData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Missing GPS data fields',
          missingFields
        });
      }

      // Validate GPS coordinates
      if (gpsData.latitude < -90 || gpsData.latitude > 90) {
        return res.status(400).json({
          success: false,
          message: 'Invalid GPS latitude'
        });
      }

      if (gpsData.longitude < -180 || gpsData.longitude > 180) {
        return res.status(400).json({
          success: false,
          message: 'Invalid GPS longitude'
        });
      }

      // Validate timestamp (should be recent)
      const now = new Date();
      const gpsTime = new Date(gpsData.timestamp);
      const timeDiff = Math.abs(now - gpsTime);
      const maxAge = 5 * 60 * 1000; // 5 minutes

      if (timeDiff > maxAge) {
        return res.status(400).json({
          success: false,
          message: 'GPS data is too old',
          maxAge: '5 minutes'
        });
      }

      // Add accuracy validation if provided
      if (gpsData.accuracy && gpsData.accuracy > 100) {
        req.gpsWarning = 'Low GPS accuracy detected';
      }

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'GPS data validation failed',
        error: error.message
      });
    }
  }

  // Detect suspicious location patterns
  detectSuspiciousMovement(req, res, next) {
    try {
      const { gpsData } = req.body;
      const { user } = req;

      if (!gpsData || !user.lastKnownLocation) {
        return next();
      }

      const distance = geolib.getDistance(
        {
          latitude: user.lastKnownLocation.coordinates[1],
          longitude: user.lastKnownLocation.coordinates[0]
        },
        {
          latitude: gpsData.latitude,
          longitude: gpsData.longitude
        }
      );

      const timeDiff = new Date() - new Date(user.lastLocationUpdate);
      const speed = distance / (timeDiff / 1000); // meters per second

      // Flag unrealistic speeds (> 50 m/s = 180 km/h)
      if (speed > 50) {
        req.suspiciousMovement = {
          detected: true,
          speed: Math.round(speed * 3.6), // Convert to km/h
          distance,
          timeDiff
        };
      }

      next();
    } catch (error) {
      next(); // Don't fail if detection fails
    }
  }

  // Enforce 2dsphere index requirements
  enforce2dsphereIndex(req, res, next) {
    try {
      // Ensure location data is properly formatted for 2dsphere indexing
      if (req.body.location && req.body.location.coordinates) {
        const [lng, lat] = req.body.location.coordinates;
        
        // MongoDB 2dsphere requires [longitude, latitude] order
        req.body.location = {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        };
      }

      // Add geospatial metadata
      req.geoMetadata = {
        indexType: '2dsphere',
        coordinateSystem: 'WGS84',
        projection: 'EPSG:4326'
      };

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: '2dsphere index formatting failed',
        error: error.message
      });
    }
  }

  // Rate limit geolocation requests by area
  rateLimitByArea(maxRequestsPerArea = 10, timeWindow = 60000) {
    const areaRequests = new Map();

    return (req, res, next) => {
      try {
        if (!req.body.location || !req.body.location.coordinates) {
          return next();
        }

        const [lng, lat] = req.body.location.coordinates;
        
        // Create area key (rounded to ~1km grid)
        const areaKey = `${Math.round(lat * 100)},${Math.round(lng * 100)}`;
        
        const now = Date.now();
        const requests = areaRequests.get(areaKey) || [];
        
        // Remove old requests
        const recentRequests = requests.filter(time => now - time < timeWindow);
        
        if (recentRequests.length >= maxRequestsPerArea) {
          return res.status(429).json({
            success: false,
            message: 'Too many requests for this area',
            retryAfter: Math.ceil(timeWindow / 1000)
          });
        }

        // Add current request
        recentRequests.push(now);
        areaRequests.set(areaKey, recentRequests);

        next();
      } catch (error) {
        next(); // Don't fail if rate limiting fails
      }
    };
  }
}

module.exports = new MapMiddleware();
