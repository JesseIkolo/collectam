// Test setup for Collectam Phase 1
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
process.env.JWT_INVITE_SECRET = 'test-invite-secret-key-for-testing-only';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:3001';
process.env.QR_SECRET = 'test-qr-secret-key-for-testing-only';
process.env.API_BASE_URL = 'http://localhost:5001';

beforeAll(async () => {
  try {
    // Start in-memory MongoDB
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;

    // Connect to in-memory database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🧪 Test MongoDB started:', uri);
  } catch (error) {
    console.error('Failed to start test MongoDB:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Cleanup
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    if (mongod) {
      await mongod.stop();
      console.log('🧪 Test MongoDB stopped');
    }
  } catch (error) {
    console.error('Error during test cleanup:', error);
  }
});

// Clear all collections after each test
afterEach(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    console.error('Error clearing test data:', error);
  }
});

// Global test timeout
jest.setTimeout(30000);
