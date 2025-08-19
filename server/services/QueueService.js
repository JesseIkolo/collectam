const Queue = require('bull');
const winston = require('winston');
const NotificationService = require('./NotificationService');
const CacheService = require('./CacheService');

class QueueService {
  constructor() {
    this.queues = {};
    this.redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB || 1 // Use different DB for queues
    };
    
    this.initializeQueues();
  }

  // Initialize all queues
  initializeQueues() {
    // Notification queue for SMS, email, WhatsApp
    this.queues.notifications = new Queue('notifications', {
      redis: this.redisConfig,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    });

    // Image processing queue for media optimization
    this.queues.imageProcessing = new Queue('image processing', {
      redis: this.redisConfig,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 25,
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 5000
        }
      }
    });

    // Analytics queue for data processing
    this.queues.analytics = new Queue('analytics', {
      redis: this.redisConfig,
      defaultJobOptions: {
        removeOnComplete: 200,
        removeOnFail: 100,
        attempts: 2,
        delay: 1000
      }
    });

    // Mission assignment queue for AI matching
    this.queues.missionAssignment = new Queue('mission assignment', {
      redis: this.redisConfig,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000
        }
      }
    });

    // Cleanup queue for maintenance tasks
    this.queues.cleanup = new Queue('cleanup', {
      redis: this.redisConfig,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 10,
        attempts: 1
      }
    });

    this.setupProcessors();
    this.setupEventHandlers();
  }

  // Setup queue processors
  setupProcessors() {
    // Notification processor
    this.queues.notifications.process('send-sms', async (job) => {
      const { phone, message } = job.data;
      winston.info(`Processing SMS job for ${phone}`);
      
      const result = await NotificationService.sendSMS(phone, message);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    });

    this.queues.notifications.process('send-email', async (job) => {
      const { to, subject, html, text } = job.data;
      winston.info(`Processing email job for ${to}`);
      
      const result = await NotificationService.sendEmail(to, subject, html, text);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    });

    this.queues.notifications.process('send-whatsapp', async (job) => {
      const { phone, message } = job.data;
      winston.info(`Processing WhatsApp job for ${phone}`);
      
      const result = await NotificationService.sendWhatsApp(phone, message);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    });

    // Image processing processor
    this.queues.imageProcessing.process('optimize-image', async (job) => {
      const { buffer, options, collectionId } = job.data;
      winston.info(`Processing image optimization for collection ${collectionId}`);
      
      const StorageService = require('./StorageService');
      const result = await StorageService.optimizeImage(buffer, options);
      
      return result;
    });

    // Analytics processor
    this.queues.analytics.process('update-heatmap', async (job) => {
      const { bounds, timeframe } = job.data;
      winston.info(`Processing heatmap update for bounds ${bounds}`);
      
      const MapService = require('./MapService');
      const heatmapData = await MapService.generateHeatmap(bounds, timeframe);
      
      if (heatmapData.success) {
        await CacheService.cacheHeatmapData(bounds, timeframe, heatmapData.data);
      }
      
      return heatmapData;
    });

    this.queues.analytics.process('calculate-metrics', async (job) => {
      const { type, data } = job.data;
      winston.info(`Processing metrics calculation for ${type}`);
      
      // Implement metrics calculation logic here
      return { type, processed: true, timestamp: new Date() };
    });

    // Mission assignment processor
    this.queues.missionAssignment.process('assign-collector', async (job) => {
      const { collectionId } = job.data;
      winston.info(`Processing collector assignment for collection ${collectionId}`);
      
      const MatchingService = require('./MatchingService');
      const result = await MatchingService.assignOptimalCollector(collectionId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    });

    // Cleanup processor
    this.queues.cleanup.process('clean-expired-cache', async (job) => {
      winston.info('Processing cache cleanup');
      
      // Clean expired sessions, OTPs, etc.
      await CacheService.clearPattern('session:*');
      await CacheService.clearPattern('otp:*');
      
      return { cleaned: true, timestamp: new Date() };
    });
  }

  // Setup event handlers for monitoring
  setupEventHandlers() {
    Object.entries(this.queues).forEach(([queueName, queue]) => {
      queue.on('completed', (job, result) => {
        winston.info(`Job ${job.id} in queue ${queueName} completed`, { result });
      });

      queue.on('failed', (job, err) => {
        winston.error(`Job ${job.id} in queue ${queueName} failed`, { error: err.message });
      });

      queue.on('stalled', (job) => {
        winston.warn(`Job ${job.id} in queue ${queueName} stalled`);
      });

      queue.on('progress', (job, progress) => {
        winston.debug(`Job ${job.id} in queue ${queueName} progress: ${progress}%`);
      });
    });
  }

  // Add notification job
  async addNotificationJob(type, data, options = {}) {
    try {
      const job = await this.queues.notifications.add(type, data, {
        priority: options.priority || 0,
        delay: options.delay || 0,
        ...options
      });
      
      winston.info(`Added ${type} notification job ${job.id}`);
      return job;
    } catch (error) {
      winston.error(`Failed to add notification job: ${error.message}`);
      throw error;
    }
  }

  // Add image processing job
  async addImageProcessingJob(data, options = {}) {
    try {
      const job = await this.queues.imageProcessing.add('optimize-image', data, {
        priority: options.priority || 0,
        ...options
      });
      
      winston.info(`Added image processing job ${job.id}`);
      return job;
    } catch (error) {
      winston.error(`Failed to add image processing job: ${error.message}`);
      throw error;
    }
  }

  // Add analytics job
  async addAnalyticsJob(type, data, options = {}) {
    try {
      const job = await this.queues.analytics.add(type, data, {
        priority: options.priority || 0,
        delay: options.delay || 0,
        ...options
      });
      
      winston.info(`Added ${type} analytics job ${job.id}`);
      return job;
    } catch (error) {
      winston.error(`Failed to add analytics job: ${error.message}`);
      throw error;
    }
  }

  // Add mission assignment job
  async addMissionAssignmentJob(data, options = {}) {
    try {
      const job = await this.queues.missionAssignment.add('assign-collector', data, {
        priority: options.priority || 5, // High priority for mission assignments
        ...options
      });
      
      winston.info(`Added mission assignment job ${job.id}`);
      return job;
    } catch (error) {
      winston.error(`Failed to add mission assignment job: ${error.message}`);
      throw error;
    }
  }

  // Schedule recurring cleanup job
  async scheduleCleanupJobs() {
    try {
      // Clean expired cache every hour
      await this.queues.cleanup.add('clean-expired-cache', {}, {
        repeat: { cron: '0 * * * *' }, // Every hour
        removeOnComplete: 5,
        removeOnFail: 5
      });

      winston.info('Scheduled recurring cleanup jobs');
    } catch (error) {
      winston.error(`Failed to schedule cleanup jobs: ${error.message}`);
    }
  }

  // Get queue statistics
  async getQueueStats() {
    const stats = {};
    
    for (const [name, queue] of Object.entries(this.queues)) {
      try {
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        const completed = await queue.getCompleted();
        const failed = await queue.getFailed();
        
        stats[name] = {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length
        };
      } catch (error) {
        stats[name] = { error: error.message };
      }
    }
    
    return stats;
  }

  // Pause all queues
  async pauseAll() {
    for (const [name, queue] of Object.entries(this.queues)) {
      try {
        await queue.pause();
        winston.info(`Paused queue: ${name}`);
      } catch (error) {
        winston.error(`Failed to pause queue ${name}: ${error.message}`);
      }
    }
  }

  // Resume all queues
  async resumeAll() {
    for (const [name, queue] of Object.entries(this.queues)) {
      try {
        await queue.resume();
        winston.info(`Resumed queue: ${name}`);
      } catch (error) {
        winston.error(`Failed to resume queue ${name}: ${error.message}`);
      }
    }
  }

  // Clean all queues
  async cleanAll() {
    for (const [name, queue] of Object.entries(this.queues)) {
      try {
        await queue.clean(5000, 'completed');
        await queue.clean(5000, 'failed');
        winston.info(`Cleaned queue: ${name}`);
      } catch (error) {
        winston.error(`Failed to clean queue ${name}: ${error.message}`);
      }
    }
  }

  // Graceful shutdown
  async shutdown() {
    winston.info('Shutting down queue service...');
    
    for (const [name, queue] of Object.entries(this.queues)) {
      try {
        await queue.close();
        winston.info(`Closed queue: ${name}`);
      } catch (error) {
        winston.error(`Failed to close queue ${name}: ${error.message}`);
      }
    }
  }
}

module.exports = new QueueService();
