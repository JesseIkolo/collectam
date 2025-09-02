const request = require('supertest');
const app = require('./testApp'); // Use test app instead of main app
const User = require('../models/User');
const Organization = require('../models/Organization');
const Invitation = require('../models/Invitation');
const OTP = require('../models/OTP');
const Mission = require('../models/Mission');
const Collection = require('../models/Collection');

async function setupAdminAndOrg() {
    const org = await Organization.create({
        name: 'Test Organization',
        slug: `test-org-${Date.now()}`
    });
    await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        password: 'AdminPass123!',
        phone: '+1234567890',
        role: 'admin',
        organizationId: org._id
    });
    const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'AdminPass123!' })
        .expect(200);
    return { org, adminToken: login.body.data.accessToken };
}

describe('Phase 1 Implementation Tests', () => {
    afterAll(async () => {
        await User.deleteMany({});
        await Organization.deleteMany({});
        await Invitation.deleteMany({});
        await OTP.deleteMany({});
        await Mission.deleteMany({});
        await Collection.deleteMany({});
    });

    describe('OTP Service', () => {
        it('should generate and verify OTP', async () => {
            const recipient = 'test@example.com';

            const requestResponse = await request(app)
                .post('/api/auth/request-otp')
                .send({ recipient, channel: 'email' });

            expect(requestResponse.status).toBe(200);
            expect(requestResponse.body.success).toBe(true);

            const otpRecord = await OTP.findOne({ recipient, channel: 'email' });
            expect(otpRecord).toBeTruthy();
            expect(otpRecord.code).toHaveLength(6);

            const verifyResponse = await request(app)
                .post('/api/auth/verify-otp')
                .send({ recipient, channel: 'email', code: otpRecord.code });

            expect(verifyResponse.status).toBe(200);
            expect(verifyResponse.body.success).toBe(true);

            const deletedOTP = await OTP.findOne({ recipient, channel: 'email' });
            expect(deletedOTP).toBeFalsy();
        });

        it('should handle invalid OTP attempts', async () => {
            const recipient = 'test2@example.com';

            await request(app)
                .post('/api/auth/request-otp')
                .send({ recipient, channel: 'email' });

            for (let i = 0; i < 5; i++) {
                const response = await request(app)
                    .post('/api/auth/verify-otp')
                    .send({ recipient, channel: 'email', code: '000000' });
                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
            }

            const lockedResponse = await request(app)
                .post('/api/auth/verify-otp')
                .send({ recipient, channel: 'email', code: '000000' });

            expect(lockedResponse.status).toBe(429);
            expect(lockedResponse.body.message).toContain('locked');
        });
    });

    describe('Invitation System', () => {
        it('should issue invitation for collector', async () => {
            const { org, adminToken } = await setupAdminAndOrg();

            const response = await request(app)
                .post('/api/auth/invitations/issue')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ role: 'collector', organizationId: org._id });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeTruthy();
            expect(response.body.data.jti).toBeTruthy();

            const invitation = await Invitation.findOne({ jti: response.body.data.jti });
            expect(invitation).toBeTruthy();
            expect(invitation.role).toBe('collector');
            expect(invitation.organizationId.toString()).toBe(org._id.toString());
        });

        it('should validate invitation token', async () => {
            const { org, adminToken } = await setupAdminAndOrg();

            const issueResponse = await request(app)
                .post('/api/auth/invitations/issue')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ role: 'user', organizationId: org._id })
                .expect(201);

            const token = issueResponse.body.data.token;

            const validateResponse = await request(app)
                .post('/api/auth/invitations/validate')
                .send({ token });

            expect(validateResponse.status).toBe(200);
            expect(validateResponse.body.success).toBe(true);
            expect(validateResponse.body.data.role).toBe('user');
            expect(validateResponse.body.data.organizationId).toBe(org._id.toString());
        });

        it('should create user with invitation', async () => {
            const { org, adminToken } = await setupAdminAndOrg();

            const issueResponse = await request(app)
                .post('/api/auth/invitations/issue')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ role: 'collector', organizationId: org._id })
                .expect(201);

            const token = issueResponse.body.data.token;

            const signupResponse = await request(app)
                .post('/api/auth/signup')
                .send({
                    invitationToken: token,
                    firstName: 'John',
                    lastName: 'Collector',
                    email: 'collector@test.com',
                    password: 'CollectorPass123!',
                    phone: '+1234567891'
                });

            expect(signupResponse.status).toBe(201);
            expect(signupResponse.body.success).toBe(true);
            expect(signupResponse.body.data.user.role).toBe('collector');
            expect(signupResponse.body.data.user.organizationId).toBe(org._id.toString());

            const invitation = await Invitation.findOne({ jti: issueResponse.body.data.jti });
            expect(invitation.status).toBe('used');
        });
    });

    describe('Organization Scoping', () => {
        let orgAdminUser;
        let orgAdminToken;
        let collectorUser;
        let collectorToken;
        let collectionDoc;
        let org;

        beforeEach(async () => {
            org = await Organization.create({
                name: 'Scoped Org',
                slug: `scoped-org-${Date.now()}`
            });

            orgAdminUser = await User.create({
                firstName: 'Org',
                lastName: 'Admin',
                email: 'orgadmin@test.com',
                password: 'OrgAdminPass123!',
                phone: '+1234567892',
                role: 'org_admin',
                organizationId: org._id
            });

            collectorUser = await User.create({
                firstName: 'Test',
                lastName: 'Collector',
                email: 'testcollector@test.com',
                password: 'CollectorPass123!',
                phone: '+1234567893',
                role: 'collector',
                organizationId: org._id
            });

            collectionDoc = await Collection.create({
                userId: orgAdminUser._id,
                organizationId: org._id,
                wasteType: 'plastic',
                quantity: 1,
                location: { type: 'Point', coordinates: [2.3522, 48.8566] },
                status: 'pending'
            });

            const orgAdminLogin = await request(app)
                .post('/api/auth/login')
                .send({ email: 'orgadmin@test.com', password: 'OrgAdminPass123!' })
                .expect(200);
            orgAdminToken = orgAdminLogin.body.data.accessToken;

            const collectorLogin = await request(app)
                .post('/api/auth/login')
                .send({ email: 'testcollector@test.com', password: 'CollectorPass123!' })
                .expect(200);
            collectorToken = collectorLogin.body.data.accessToken;
        });

        it('should scope missions to organization', async () => {
            const missionResponse = await request(app)
                .post('/api/missions')
                .set('Authorization', `Bearer ${orgAdminToken}`)
                .send({ collectionId: collectionDoc._id, collectorId: collectorUser._id, organizationId: org._id });

            expect(missionResponse.status).toBe(201);

            const missionsResponse = await request(app)
                .get('/api/missions')
                .set('Authorization', `Bearer ${orgAdminToken}`);

            expect(missionsResponse.status).toBe(200);
            expect(missionsResponse.body.data.missions).toHaveLength(1);
            expect(missionsResponse.body.data.missions[0].organizationId.toString()).toBe(org._id.toString());
        });

        it('should require organization scope for org_admin', async () => {
            const userWithoutOrg = await User.create({
                firstName: 'No',
                lastName: 'Org',
                email: 'noorg@test.com',
                password: 'NoOrgPass123!',
                phone: '+1234567894',
                role: 'org_admin'
            });

            const noOrgLogin = await request(app)
                .post('/api/auth/login')
                .send({ email: 'noorg@test.com', password: 'NoOrgPass123!' })
                .expect(200);
            const noOrgToken = noOrgLogin.body.data.accessToken;

            const missionsResponse = await request(app)
                .get('/api/missions')
                .set('Authorization', `Bearer ${noOrgToken}`);

            expect(missionsResponse.status).toBe(403);
            expect(missionsResponse.body.message).toContain('Organization access required');
        });
    });

    describe('Business Dashboard', () => {
        it('should provide dashboard overview for org_admin', async () => {
            const { org, adminToken } = await setupAdminAndOrg();

            // Ensure at least one collector exists in this org
            await User.create({
                firstName: 'Dash',
                lastName: 'Collector',
                email: 'dash.collector@test.com',
                password: 'CollectorPass123!',
                phone: '+1234567896',
                role: 'collector',
                organizationId: org._id
            });

            const response = await request(app)
                .get('/api/business/dashboard')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.overview).toBeTruthy();
            expect(response.body.data.overview.collectorCount).toBeGreaterThan(0);
            expect(response.body.data.overview.vehicleCount).toBeGreaterThanOrEqual(0);
        });

        it('should list collectors with stats', async () => {
            const { org, adminToken } = await setupAdminAndOrg();

            // Ensure at least one collector exists in this org
            await User.create({
                firstName: 'Dash2',
                lastName: 'Collector',
                email: 'dash2.collector@test.com',
                password: 'CollectorPass123!',
                phone: '+1234567897',
                role: 'collector',
                organizationId: org._id
            });

            const response = await request(app)
                .get('/api/business/collectors')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.collectors).toBeTruthy();
            expect(response.body.data.collectors.length).toBeGreaterThan(0);

            const collector = response.body.data.collectors[0];
            expect(collector.stats).toBeTruthy();
            expect(collector.stats.totalMissions).toBeGreaterThanOrEqual(0);
            expect(collector.stats.completionRate).toBeGreaterThanOrEqual(0);
        });
    });
});
