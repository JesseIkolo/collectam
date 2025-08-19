const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const AuthService = require('../services/AuthService');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    // Clean up test data
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'Test123!@#',
      phone: '+1234567890',
      role: 'user'
    };

    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(validUserData.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject signup with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ ...validUserData, email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject signup with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ ...validUserData, password: '123' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      email: 'test@example.com',
      password: 'Test123!@#',
      phone: '+1234567890'
    };

    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/signup')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: userData.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('POST /api/auth/upgrade', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create and login user
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#',
          phone: '+1234567890'
        });

      authToken = signupResponse.body.data.accessToken;
      userId = signupResponse.body.data.user.id;
    });

    it('should upgrade subscription to premium', async () => {
      const response = await request(app)
        .post('/api/auth/upgrade')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ plan: 'premium' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.subscription.plan).toBe('premium');
    });

    it('should reject upgrade without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/upgrade')
        .send({ plan: 'premium' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject invalid subscription plan', async () => {
      const response = await request(app)
        .post('/api/auth/upgrade')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ plan: 'invalid' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});

describe('AuthService', () => {
  describe('generateTokens', () => {
    it('should generate valid JWT tokens', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        role: 'user'
      };

      const tokens = await AuthService.generateTokens(mockUser);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const payload = { id: 'user123', email: 'test@example.com' };
      const token = require('jsonwebtoken').sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

      const decoded = AuthService.verifyToken(token);

      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        AuthService.verifyToken('invalid-token');
      }).toThrow('Invalid token');
    });
  });

  describe('generateOTP', () => {
    it('should generate 6-digit OTP', () => {
      const otp = AuthService.generateOTP();

      expect(otp).toMatch(/^\d{6}$/);
      expect(otp.length).toBe(6);
    });
  });
});
