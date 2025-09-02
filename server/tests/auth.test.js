const request = require('supertest');
const app = require('./testApp'); // Use test app instead of main app
const User = require('../models/User');
const Organization = require('../models/Organization');
const Invitation = require('../models/Invitation');
const AuthService = require('../services/AuthService');
const InvitationService = require('../services/InvitationService');

describe('Authentication Endpoints', () => {
  let testOrg;
  let adminUser;
  let authToken;
  let userId;

  beforeAll(async () => {
    // Create test organization
    testOrg = await Organization.create({
      name: 'Test Organization',
      slug: 'test-org'
    });

    // Create admin user
    adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'AdminPass123!',
      phone: '+1234567890',
      role: 'admin'
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Invitation.deleteMany({});
  });

  afterEach(async () => {
    // Clean up test data after each test
    await User.deleteMany({ email: { $ne: 'admin@test.com' } });
    await Invitation.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid invitation', async () => {
      // First create an invitation using the service
      const invitationResult = await InvitationService.issue({
        role: 'user',
        organizationId: testOrg._id,
        invitedBy: adminUser._id
      });

      const validUserData = {
        invitationToken: invitationResult.token,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'Password123!',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(validUserData.email);
      expect(response.body.data.user.role).toBe('user');
      expect(response.body.data.user.organizationId.toString()).toBe(testOrg._id.toString());
    });

    it('should reject signup without invitation token', async () => {
      const userDataWithoutInvitation = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@test.com',
        password: 'Password123!',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userDataWithoutInvitation)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation errors');
    });

    it('should reject duplicate email', async () => {
      // Create first invitation and user
      const invitationResult1 = await InvitationService.issue({
        role: 'user',
        organizationId: testOrg._id,
        invitedBy: adminUser._id
      });

      const userData1 = {
        invitationToken: invitationResult1.token,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'Password123!',
        phone: '+1234567890'
      };

      // Create first user
      await request(app)
        .post('/api/auth/signup')
        .send(userData1)
        .expect(201);

      // Create second invitation for same email
      const invitationResult2 = await InvitationService.issue({
        role: 'user',
        organizationId: testOrg._id,
        invitedBy: adminUser._id
      });

      const userData2 = {
        invitationToken: invitationResult2.token,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john.doe@test.com', // Same email
        password: 'Password123!',
        phone: '+1234567890'
      };

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData2)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create invitation and user first
      const invitationResult = await InvitationService.issue({
        role: 'user',
        organizationId: testOrg._id,
        invitedBy: adminUser._id
      });

      const userData = {
        invitationToken: invitationResult.token,
        firstName: 'Login',
        lastName: 'User',
        email: 'login@test.com',
        password: 'LoginPass123!',
        phone: '+1234567890'
      };

      // Create user
      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      // Login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.accessToken).toBeTruthy();
      expect(response.body.data.refreshToken).toBeTruthy();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('POST /api/auth/upgrade', () => {
    it('should upgrade subscription to premium', async () => {
      // Create invitation and user first
      const invitationResult = await InvitationService.issue({
        role: 'user',
        organizationId: testOrg._id,
        invitedBy: adminUser._id
      });

      const userData = {
        invitationToken: invitationResult.token,
        firstName: 'Upgrade',
        lastName: 'User',
        email: 'upgrade@test.com',
        password: 'UpgradePass123!',
        phone: '+1234567890'
      };

      // Create user
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      authToken = signupResponse.body.data.accessToken;
      userId = signupResponse.body.data.user.id;

      // Upgrade subscription
      const response = await request(app)
        .post('/api/auth/upgrade')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          plan: 'premium'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.subscription.plan).toBe('premium');
    });

    it('should reject upgrade without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/upgrade')
        .send({
          subscriptionPlan: 'premium'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access token required');
    });

    it('should reject invalid subscription plan', async () => {
      // Create invitation and user for this test
      const invitationResult = await InvitationService.issue({
        role: 'user',
        organizationId: testOrg._id,
        invitedBy: adminUser._id
      });

      const userData = {
        invitationToken: invitationResult.token,
        firstName: 'Invalid',
        lastName: 'Plan',
        email: 'invalid-plan@test.com',
        password: 'InvalidPass123!',
        phone: '+1234567890'
      };

      // Create user
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      const testToken = signupResponse.body.data.accessToken;

      const response = await request(app)
        .post('/api/auth/upgrade')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          plan: 'invalid-plan'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid plan');
    });
  });
});

describe('AuthService', () => {
  describe('generateTokens', () => {
    it('should generate valid JWT tokens', async () => {
      const payload = {
        _id: 'user123',
        email: 'test@example.com',
        role: 'user'
      };

      const tokens = await AuthService.generateTokens(payload);

      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const payload = { id: 'user123', email: 'test@example.com' };
      const token = require('jsonwebtoken').sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

      const decoded = AuthService.verifyToken(token);

      expect(decoded).toBeTruthy();
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        AuthService.verifyToken(invalidToken);
      }).toThrow();
    });
  });
});
