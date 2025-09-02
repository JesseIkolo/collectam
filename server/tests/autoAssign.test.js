const request = require('supertest');
const app = require('./testApp');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Collection = require('../models/Collection');
const InvitationService = require('../services/InvitationService');

// Enable auto-assign for this test file
process.env.ENABLE_AUTO_ASSIGN = 'true';

describe('Phase 2 - Auto Assignment', () => {
    let org;
    let admin;

    beforeAll(async () => {
        org = await Organization.create({ name: 'Auto Assign Org', slug: `auto-org-${Date.now()}` });
        admin = await User.create({
            firstName: 'Admin', lastName: 'AA', email: 'aa.admin@test.com', password: 'AdminPass123!',
            phone: '+1234567000', role: 'admin', organizationId: org._id
        });
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Organization.deleteMany({});
        await Collection.deleteMany({});
    });

    it('should assign mission automatically when collectors exist', async () => {
        // Create a collector in org
        const invite = await InvitationService.issue({ role: 'collector', organizationId: org._id, invitedBy: admin._id });
        const collectorSignup = await request(app)
            .post('/api/auth/signup')
            .send({
                invitationToken: invite.token,
                firstName: 'Auto', lastName: 'Collector',
                email: `auto.collector.${Date.now()}@test.com`, password: 'CollectorPass123!', phone: '+1234567001'
            })
            .expect(201);
        const collectorToken = collectorSignup.body.data.accessToken;

        // Mark collector on-duty and send heartbeat with location
        await request(app)
            .patch('/api/auth/collectors/duty')
            .set('Authorization', `Bearer ${collectorToken}`)
            .send({ onDuty: true })
            .expect(200);
        await request(app)
            .post('/api/auth/collectors/heartbeat')
            .set('Authorization', `Bearer ${collectorToken}`)
            .send({ coordinates: [2.3522, 48.8566] })
            .expect(200);

        // Create a user and report a collection
        const inviteUser = await InvitationService.issue({ role: 'user', organizationId: org._id, invitedBy: admin._id });
        const userSignup = await request(app)
            .post('/api/auth/signup')
            .send({
                invitationToken: inviteUser.token,
                firstName: 'Auto', lastName: 'User',
                email: `auto.user.${Date.now()}@test.com`, password: 'UserPass123!', phone: '+1234567002'
            })
            .expect(201);

        const authToken = userSignup.body.data.accessToken;

        const report = await request(app)
            .post('/api/collections/report')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ wasteType: 'plastic', quantity: 1, location: { type: 'Point', coordinates: [2.3522, 48.8566] } })
            .expect(201);

        const collectionId = report.body.data.collection._id;

        // Login admin to create mission
        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'aa.admin@test.com', password: 'AdminPass123!' })
            .expect(200);
        const adminToken = adminLogin.body.data.accessToken;

        // Create mission without collectorId -> auto-assigned
        const missionCreate = await request(app)
            .post('/api/missions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ collectionId, organizationId: org._id })
            .expect(201);

        expect(missionCreate.body.success).toBe(true);
        expect(missionCreate.body.data.mission.collectorId).toBeTruthy();
        expect(missionCreate.body.data.mission.status).toBe('assigned');
    });

    it('should create planned mission when no collectors available', async () => {
        // Fresh org with no collectors
        const emptyOrg = await Organization.create({ name: 'Empty Org', slug: `empty-org-${Date.now()}` });
        const emptyAdmin = await User.create({
            firstName: 'Admin', lastName: 'Empty', email: `empty.admin.${Date.now()}@test.com`, password: 'AdminPass123!',
            phone: '+1234567099', role: 'admin', organizationId: emptyOrg._id
        });

        // Create a user and report a collection for empty org
        const inviteUser = await InvitationService.issue({ role: 'user', organizationId: emptyOrg._id, invitedBy: emptyAdmin._id });
        const userSignup = await request(app)
            .post('/api/auth/signup')
            .send({
                invitationToken: inviteUser.token,
                firstName: 'Planned', lastName: 'User',
                email: `planned.user.${Date.now()}@test.com`, password: 'UserPass123!', phone: '+1234567098'
            })
            .expect(201);
        const userToken = userSignup.body.data.accessToken;

        const report = await request(app)
            .post('/api/collections/report')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ wasteType: 'plastic', quantity: 1, location: { type: 'Point', coordinates: [2.3522, 48.8566] } })
            .expect(201);
        const collectionId = report.body.data.collection._id;

        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: emptyAdmin.email, password: 'AdminPass123!' })
            .expect(200);
        const token = login.body.data.accessToken;

        const missionCreate = await request(app)
            .post('/api/missions')
            .set('Authorization', `Bearer ${token}`)
            .send({ collectionId, organizationId: emptyOrg._id })
            .expect(201);

        expect(missionCreate.body.success).toBe(true);
        expect(missionCreate.body.data.mission.collectorId).toBeFalsy();
        expect(missionCreate.body.data.mission.status).toBe('planned');
    });
});
