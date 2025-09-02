const request = require('supertest');
const app = require('./testApp');
const User = require('../models/User');
const Collection = require('../models/Collection');
const Organization = require('../models/Organization');
const InvitationService = require('../services/InvitationService');

async function setupOrgAndUser() {
  const org = await Organization.create({ name: 'Test Organization', slug: `test-org-${Date.now()}` });
  const admin = await User.create({
    firstName: 'Admin', lastName: 'User', email: 'admin@test.com', password: 'AdminPass123!', phone: '+1234567890', role: 'admin', organizationId: org._id
  });
  const invitation = await InvitationService.issue({ role: 'user', organizationId: org._id, invitedBy: admin._id });
  const userData = { invitationToken: invitation.token, firstName: 'Test', lastName: 'User', email: `test${Date.now()}@test.com`, password: 'TestPass123!', phone: '+1234567890' };
  const userResponse = await request(app).post('/api/auth/signup').send(userData).expect(201);
  return { org, admin, authToken: userResponse.body.data.accessToken, userId: userResponse.body.data.user.id };
}

describe('Collections Endpoints', () => {
  let authToken, userId, testOrg, adminUser;

  afterAll(async () => {
    await User.deleteMany({});
    await Collection.deleteMany({});
    await Organization.deleteMany({});
  });

  describe('POST /api/collections/report', () => {
    beforeEach(async () => {
      const setup = await setupOrgAndUser();
      authToken = setup.authToken; userId = setup.userId; testOrg = setup.org; adminUser = setup.admin;
    });

    it('should create a new collection report', async () => {
      const collectionData = {
        wasteType: 'plastic',
        quantity: 5,
        location: { type: 'Point', coordinates: [2.3522, 48.8566] }
      };

      const response = await request(app)
        .post('/api/collections/report')
        .set('Authorization', `Bearer ${authToken}`)
        .send(collectionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.collection.wasteType).toBe('plastic');
      expect(response.body.data.collection.userId).toBe(userId);
    });

    it('should reject report without authentication', async () => {
      const collectionData = {
        wasteType: 'plastic',
        quantity: 5,
        location: { type: 'Point', coordinates: [2.3522, 48.8566] }
      };

      const response = await request(app)
        .post('/api/collections/report')
        .send(collectionData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access token required');
    });

    it('should reject report with invalid coordinates', async () => {
      const collectionData = {
        wasteType: 'plastic',
        quantity: 5,
        location: { type: 'Point', coordinates: [200, 100] }
      };

      const response = await request(app)
        .post('/api/collections/report')
        .set('Authorization', `Bearer ${authToken}`)
        .send(collectionData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject report with invalid waste type', async () => {
      const collectionData = {
        wasteType: 'invalid-waste-type',
        quantity: 5,
        location: { type: 'Point', coordinates: [2.3522, 48.8566] }
      };

      const response = await request(app)
        .post('/api/collections/report')
        .set('Authorization', `Bearer ${authToken}`)
        .send(collectionData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/collections/schedule', () => {
    beforeEach(async () => {
      const setup = await setupOrgAndUser();
      authToken = setup.authToken; userId = setup.userId; testOrg = setup.org; adminUser = setup.admin;
    });

    it('should schedule a collection', async () => {
      const scheduleData = {
        collectionId: '507f1f77bcf86cd799439011',
        scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      };

      const response = await request(app)
        .post('/api/collections/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send(scheduleData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject scheduling without authentication', async () => {
      const scheduleData = {
        wasteType: 'glass',
        quantity: 3,
        location: { type: 'Point', coordinates: [2.3522, 48.8566] }
      };

      const response = await request(app)
        .post('/api/collections/schedule')
        .send(scheduleData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access token required');
    });

    it('should reject past scheduled time', async () => {
      const scheduleData = {
        wasteType: 'glass',
        quantity: 3,
        location: { type: 'Point', coordinates: [2.3522, 48.8566] },
        scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000)
      };

      const response = await request(app)
        .post('/api/collections/schedule')
        .set('Authorization', `Bearer ${authToken}`)
        .send(scheduleData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/collections', () => {
    beforeEach(async () => {
      const setup = await setupOrgAndUser();
      authToken = setup.authToken; userId = setup.userId; testOrg = setup.org; adminUser = setup.admin;
      await Collection.create([
        { userId, organizationId: testOrg._id, wasteType: 'plastic', quantity: 5, location: { type: 'Point', coordinates: [2.3522, 48.8566] }, status: 'pending' },
        { userId, organizationId: testOrg._id, wasteType: 'glass', quantity: 3, location: { type: 'Point', coordinates: [2.3522, 48.8566] }, status: 'completed' }
      ]);
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
      expect(response.body.message).toContain('Access token required');
    });
  });

  describe('GET /api/collections/status/:status', () => {
    beforeEach(async () => {
      const setup = await setupOrgAndUser();
      authToken = setup.authToken; userId = setup.userId; testOrg = setup.org; adminUser = setup.admin;
      await Collection.create([
        { userId, organizationId: testOrg._id, wasteType: 'plastic', quantity: 5, location: { type: 'Point', coordinates: [2.3522, 48.8566] }, status: 'pending' },
        { userId, organizationId: testOrg._id, wasteType: 'glass', quantity: 3, location: { type: 'Point', coordinates: [2.3522, 48.8566] }, status: 'completed' }
      ]);
    });

    it('should get collections by status for collector', async () => {
      const collectorInvitation = await InvitationService.issue({ role: 'collector', organizationId: testOrg._id, invitedBy: adminUser._id });
      const collectorData = { invitationToken: collectorInvitation.token, firstName: 'Collector', lastName: 'User', email: `collector${Date.now()}@test.com`, password: 'CollectorPass123!', phone: '+1234567890' };
      const collectorResponse = await request(app).post('/api/auth/signup').send(collectorData).expect(201);
      const collectorToken = collectorResponse.body.data.accessToken;

      const response = await request(app)
        .get('/api/collections/status/pending')
        .set('Authorization', `Bearer ${collectorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.collections).toHaveLength(1);
      expect(response.body.data.collections[0].status).toBe('pending');
    });

    it('should reject request from regular user', async () => {
      const response = await request(app)
        .get('/api/collections/status/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient permissions');
    });
  });
});
