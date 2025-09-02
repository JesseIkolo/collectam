const request = require('supertest');
const app = require('./testApp');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Collection = require('../models/Collection');
const Mission = require('../models/Mission');
const InvitationService = require('../services/InvitationService');

describe('Phase 2 - Endpoints', () => {
    let org, admin, adminToken, collector, collectorToken, userToken, collection;

    const setupOrgAdminCollectorAndUser = async () => {
        org = await Organization.create({ name: `Phase2 Org ${Date.now()}`, slug: `p2-${Date.now()}`, settings: { autoAssignEnabled: true } });
        const adminEmail = `p2.admin.${Date.now()}@test.com`;
        const adminUser = await User.create({
            firstName: 'Admin', lastName: 'P2', email: adminEmail, password: 'AdminPass123!',
            phone: '+1234500000', role: 'admin', organizationId: org._id
        });
        admin = adminUser;
        const login = await request(app).post('/api/auth/login').send({ email: adminEmail, password: 'AdminPass123!' });
        adminToken = login.body.data.accessToken;

        // create collector via invitation
        const inviteCollector = await InvitationService.issue({ role: 'collector', organizationId: org._id, invitedBy: admin._id });
        const collectorEmail = `p2.collector.${Date.now()}@test.com`;
        const collectorSignup = await request(app).post('/api/auth/signup').send({
            invitationToken: inviteCollector.token,
            firstName: 'P2', lastName: 'Collector',
            email: collectorEmail, password: 'CollectorPass123!', phone: '+1234500001'
        }).expect(201);
        collectorToken = collectorSignup.body.data.accessToken;
        collector = collectorSignup.body.data.user;

        // create a regular user and report a collection
        const inviteUser = await InvitationService.issue({ role: 'user', organizationId: org._id, invitedBy: admin._id });
        const userEmail = `p2.user.${Date.now()}@test.com`;
        const userSignup = await request(app).post('/api/auth/signup').send({
            invitationToken: inviteUser.token,
            firstName: 'P2', lastName: 'User',
            email: userEmail, password: 'UserPass123!', phone: '+1234500002'
        }).expect(201);
        userToken = userSignup.body.data.accessToken;

        const report = await request(app)
            .post('/api/collections/report')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ wasteType: 'plastic', quantity: 2, location: { type: 'Point', coordinates: [2.3522, 48.8566] } })
            .expect(201);
        collection = report.body.data.collection;
    };

    afterEach(async () => {
        await Mission.deleteMany({});
        await Collection.deleteMany({});
        await User.deleteMany({});
        await Organization.deleteMany({});
    });

    it('collector can toggle onDuty and send heartbeat', async () => {
        await setupOrgAdminCollectorAndUser();
        const duty = await request(app)
            .patch('/api/auth/collectors/duty')
            .set('Authorization', `Bearer ${collectorToken}`)
            .send({ onDuty: true })
            .expect(200);
        expect(duty.body.success).toBe(true);

        const hb = await request(app)
            .post('/api/auth/collectors/heartbeat')
            .set('Authorization', `Bearer ${collectorToken}`)
            .send({ coordinates: [2.3522, 48.8566] })
            .expect(200);
        expect(hb.body.success).toBe(true);
    });

    it('org settings can be fetched and updated', async () => {
        await setupOrgAdminCollectorAndUser();
        const getRes = await request(app)
            .get('/api/business/settings')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(getRes.body.success).toBe(true);

        const patchRes = await request(app)
            .patch('/api/business/settings')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ autoAssignRadiusMeters: 15000, maxActiveMissionsPerCollector: 3, autoAssignEnabled: true })
            .expect(200);
        expect(patchRes.body.success).toBe(true);
        expect(patchRes.body.data.settings.autoAssignRadiusMeters).toBe(15000);
    });

    it('can manually assign and reassign with audit trail', async () => {
        await setupOrgAdminCollectorAndUser();
        // create planned mission
        const createMission = await request(app)
            .post('/api/missions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ collectionId: collection._id, organizationId: org._id })
            .expect(201);
        const mission = createMission.body.data.mission;

        // assign
        const assignRes = await request(app)
            .patch(`/api/missions/${mission._id}/assign`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ collectorId: collector.id, reason: 'initial assignment' })
            .expect(200);
        expect(assignRes.body.success).toBe(true);

        // reassign (same collector for simplicity)
        const reassignRes = await request(app)
            .patch(`/api/missions/${mission._id}/assign`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ collectorId: collector.id, reason: 'route change' })
            .expect(200);
        expect(reassignRes.body.success).toBe(true);
        expect(reassignRes.body.data.mission.reassignmentHistory.length).toBeGreaterThan(0);
    });

    it('optimizes route for collector with given collections', async () => {
        await setupOrgAdminCollectorAndUser();
        // add a second collection nearby
        const report2 = await request(app)
            .post('/api/collections/report')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ wasteType: 'plastic', quantity: 1, location: { type: 'Point', coordinates: [2.36, 48.86] } })
            .expect(201);
        const collection2 = report2.body.data.collection;

        const res = await request(app)
            .post('/api/missions/optimize-route')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ collectorId: collector.id, collectionIds: [collection._id, collection2._id] })
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.route.length).toBe(2);
    });
});


