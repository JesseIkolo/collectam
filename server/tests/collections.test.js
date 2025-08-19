const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Collection = require('../models/Collection');

describe('Collections Endpoints', () => {
  let authToken;
  let userId;
  let collectorToken;
  let collectorId;

  beforeEach(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Collection.deleteMany({});

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'user@example.com',
        password: 'Test123!@#',
        phone: '+1234567890',
        role: 'user'
      });

    authToken = userResponse.body.data.accessToken;
    userId = userResponse.body.data.user.id;

    // Create test collector
    const collectorResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'collector@example.com',
        password: 'Test123!@#',
        phone: '+1234567891',
        role: 'collector'
      });

    collectorToken = collectorResponse.body.data.accessToken;
    collectorId = collectorResponse.body.data.user.id;
  });

  describe('POST /api/collections/report', () => {
    const validCollectionData = {
      location: {
        coordinates: [-74.006, 40.7128] // NYC coordinates
      },
      wasteType: 'plastic',
      description: 'Large pile of plastic bottles',
      estimatedWeight: 10.5
    };

    it('should create a new collection report', async () => {
      const response = await request(app)
        .post('/api/collections/report')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCollectionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.collection.wasteType).toBe('plastic');
      expect(response.body.data.collection.status).toBe('pending');
    });

    it('should reject report without authentication', async () => {
      const response = await request(app)
        .post('/api/collections/report')
        .send(validCollectionData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject report with invalid coordinates', async () => {
      const response = await request(app)
        .post('/api/collections/report')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validCollectionData,
          location: { coordinates: [200, 100] } // Invalid coordinates
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject report with invalid waste type', async () => {
      const response = await request(app)
        .post('/api/collections/report')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validCollectionData,
          wasteType: 'invalid-type'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/collections/schedule', () => {
    const validScheduleData = {
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      collectionType: 'regular',
      recurringPattern: 'weekly'
    };

    it('should schedule a collection', async () => {
      const response = await request(app)
        .post('/api/collections/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validScheduleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.schedule.collectionType).toBe('regular');
    });

    it('should reject scheduling without authentication', async () => {
      const response = await request(app)
        .post('/api/collections/schedule')
        .send(validScheduleData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject past scheduled time', async () => {
      const response = await request(app)
        .post('/api/collections/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validScheduleData,
          scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/collections', () => {
    beforeEach(async () => {
      // Create test collections
      await Collection.create({
        userId,
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128]
        },
        wasteType: 'plastic',
        status: 'pending'
      });

      await Collection.create({
        userId,
        location: {
          type: 'Point',
          coordinates: [-74.007, 40.7129]
        },
        wasteType: 'organic',
        status: 'completed'
      });
    });

    it('should get user collections', async () => {
      const response = await request(app)
        .get('/api/collections')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.collections).toHaveLength(2);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/collections')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/collections/status/:status', () => {
    beforeEach(async () => {
      await Collection.create({
        userId,
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128]
        },
        wasteType: 'plastic',
        status: 'pending'
      });
    });

    it('should get collections by status for collector', async () => {
      const response = await request(app)
        .get('/api/collections/status/pending')
        .set('Authorization', `Bearer ${collectorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.collections).toBeDefined();
    });

    it('should reject request from regular user', async () => {
      const response = await request(app)
        .get('/api/collections/status/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
