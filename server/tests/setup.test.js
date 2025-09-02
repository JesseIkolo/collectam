const mongoose = require('mongoose');

describe('Test Setup', () => {
    it('should connect to in-memory MongoDB', () => {
        expect(mongoose.connection.readyState).toBe(1); // 1 = connected
        expect(process.env.MONGO_URI).toMatch(/^mongodb:\/\//);
    });

    it('should have test environment variables set', () => {
        expect(process.env.NODE_ENV).toBe('test');
        expect(process.env.JWT_SECRET).toBe('test-jwt-secret-key-for-testing-only');
        expect(process.env.JWT_REFRESH_SECRET).toBe('test-refresh-secret-key-for-testing-only');
        expect(process.env.JWT_INVITE_SECRET).toBe('test-invite-secret-key-for-testing-only');
    });
});
