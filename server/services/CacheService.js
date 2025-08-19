const Redis = require('ioredis');
const winston = require('winston');

class CacheService {
  constructor() {
    this.redis = null;
    this.isConnected = false;
    this.defaultTTL = 3600; // 1 hour in seconds
    this.init();
  }

  // Initialize Redis connection
  async init() {
    try {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB || 0,
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000
      });

      this.redis.on('connect', () => {
        winston.info('Redis connected successfully');
        this.isConnected = true;
      });

      this.redis.on('error', (error) => {
        winston.error('Redis connection error:', error);
        this.isConnected = false;
      });

      this.redis.on('close', () => {
        winston.warn('Redis connection closed');
        this.isConnected = false;
      });

      await this.redis.connect();
    } catch (error) {
      winston.error('Failed to initialize Redis:', error);
      this.isConnected = false;
    }
  }

  // Generic cache get
  async get(key) {
    try {
      if (!this.isConnected) return null;
      
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      winston.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  // Generic cache set
  async set(key, value, ttl = this.defaultTTL) {
    try {
      if (!this.isConnected) return false;
      
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttl, serialized);
      return true;
    } catch (error) {
      winston.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  // Delete cache key
  async del(key) {
    try {
      if (!this.isConnected) return false;
      
      await this.redis.del(key);
      return true;
    } catch (error) {
      winston.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  // Cache user profile
  async cacheUserProfile(userId, userProfile) {
    const key = `user:${userId}`;
    return await this.set(key, userProfile, 3600); // 1 hour TTL
  }

  // Get cached user profile
  async getUserProfile(userId) {
    const key = `user:${userId}`;
    return await this.get(key);
  }

  // Cache mission status
  async cacheMissionStatus(missionId, status) {
    const key = `mission:${missionId}:status`;
    return await this.set(key, status, 1800); // 30 minutes TTL
  }

  // Get cached mission status
  async getMissionStatus(missionId) {
    const key = `mission:${missionId}:status`;
    return await this.get(key);
  }

  // Cache collection data
  async cacheCollection(collectionId, collectionData) {
    const key = `collection:${collectionId}`;
    return await this.set(key, collectionData, 1800); // 30 minutes TTL
  }

  // Get cached collection
  async getCollection(collectionId) {
    const key = `collection:${collectionId}`;
    return await this.get(key);
  }

  // Cache heatmap data with lazy loading
  async cacheHeatmapData(bounds, timeframe, heatmapData) {
    const key = `heatmap:${bounds.join(',')}:${timeframe}`;
    return await this.set(key, heatmapData, 7200); // 2 hours TTL
  }

  // Get cached heatmap data
  async getHeatmapData(bounds, timeframe) {
    const key = `heatmap:${bounds.join(',')}:${timeframe}`;
    return await this.get(key);
  }

  // Cache API rate limiting data
  async incrementRateLimit(identifier, windowMs, maxRequests) {
    try {
      if (!this.isConnected) return { count: 1, remaining: maxRequests - 1 };

      const key = `rate_limit:${identifier}`;
      const current = await this.redis.incr(key);
      
      if (current === 1) {
        await this.redis.expire(key, Math.ceil(windowMs / 1000));
      }

      return {
        count: current,
        remaining: Math.max(0, maxRequests - current),
        resetTime: Date.now() + windowMs
      };
    } catch (error) {
      winston.error(`Rate limit error for ${identifier}:`, error);
      return { count: 1, remaining: maxRequests - 1 };
    }
  }

  // Cache session data
  async cacheSession(sessionId, sessionData, ttl = 86400) { // 24 hours
    const key = `session:${sessionId}`;
    return await this.set(key, sessionData, ttl);
  }

  // Get cached session
  async getSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  // Cache OTP with expiration
  async cacheOTP(phone, otp, ttl = 600) { // 10 minutes
    const key = `otp:${phone}`;
    return await this.set(key, { otp, createdAt: Date.now() }, ttl);
  }

  // Verify and consume OTP
  async verifyOTP(phone, providedOTP) {
    try {
      const key = `otp:${phone}`;
      const cached = await this.get(key);
      
      if (!cached) {
        return { valid: false, error: 'OTP expired or not found' };
      }

      if (cached.otp !== providedOTP) {
        return { valid: false, error: 'Invalid OTP' };
      }

      // Delete OTP after successful verification
      await this.del(key);
      
      return { valid: true };
    } catch (error) {
      winston.error(`OTP verification error for ${phone}:`, error);
      return { valid: false, error: 'Verification failed' };
    }
  }

  // Cache nearby collectors for location
  async cacheNearbyCollectors(location, radius, collectors) {
    const key = `collectors:${location[0]},${location[1]}:${radius}`;
    return await this.set(key, collectors, 1800); // 30 minutes TTL
  }

  // Get cached nearby collectors
  async getNearbyCollectors(location, radius) {
    const key = `collectors:${location[0]},${location[1]}:${radius}`;
    return await this.get(key);
  }

  // Cache vehicle GPS data
  async cacheVehicleLocation(vehicleId, gpsData) {
    const key = `vehicle:${vehicleId}:location`;
    return await this.set(key, gpsData, 300); // 5 minutes TTL
  }

  // Get cached vehicle location
  async getVehicleLocation(vehicleId) {
    const key = `vehicle:${vehicleId}:location`;
    return await this.get(key);
  }

  // Bulk cache operations
  async mget(keys) {
    try {
      if (!this.isConnected) return {};
      
      const values = await this.redis.mget(keys);
      const result = {};
      
      keys.forEach((key, index) => {
        result[key] = values[index] ? JSON.parse(values[index]) : null;
      });
      
      return result;
    } catch (error) {
      winston.error('Bulk cache get error:', error);
      return {};
    }
  }

  // Clear cache by pattern
  async clearPattern(pattern) {
    try {
      if (!this.isConnected) return false;
      
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      
      return true;
    } catch (error) {
      winston.error(`Clear pattern error for ${pattern}:`, error);
      return false;
    }
  }

  // Get cache statistics
  async getStats() {
    try {
      if (!this.isConnected) return null;
      
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      
      return {
        connected: this.isConnected,
        memory: info,
        keyspace: keyspace,
        uptime: await this.redis.info('server')
      };
    } catch (error) {
      winston.error('Cache stats error:', error);
      return null;
    }
  }

  // Health check
  async healthCheck() {
    try {
      if (!this.isConnected) return false;
      
      await this.redis.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Graceful shutdown
  async disconnect() {
    try {
      if (this.redis) {
        await this.redis.disconnect();
        winston.info('Redis disconnected gracefully');
      }
    } catch (error) {
      winston.error('Redis disconnect error:', error);
    }
  }
}

module.exports = new CacheService();
