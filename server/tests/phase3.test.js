const request = require('supertest');
const app = require('./testApp');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Collection = require('../models/Collection');
const Mission = require('../models/Mission');
const InvitationService = require('../services/InvitationService');

describe('Phase 3 - Analytics', () => {
    let org, adminToken, collector, collectorToken;

    const setup = async () => {
        org = await Organization.create({ name: `P3 Org ${Date.now()}`, slug: `p3-${Date.now()}` });
        const admin = await User.create({
            firstName: 'Admin', lastName: 'P3', email: `p3.admin.${Date.now()}@test.com`, password: 'AdminPass123!',
            phone: '+2234500000', role: 'admin', organizationId: org._id
        });
        const adminLogin = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'AdminPass123!' });
        adminToken = adminLogin.body.data.accessToken;

        // collector
        const inviteCollector = await InvitationService.issue({ role: 'collector', organizationId: org._id, invitedBy: admin._id });
        const collectorSignup = await request(app).post('/api/auth/signup').send({
            invitationToken: inviteCollector.token,
            firstName: 'P3', lastName: 'Collector',
            email: `p3.collector.${Date.now()}@test.com`, password: 'CollectorPass123!', phone: '+2234500001'
        }).expect(201);
        collectorToken = collectorSignup.body.data.accessToken;
        collector = collectorSignup.body.data.user;

        // create some missions across statuses
        const userInvite = await InvitationService.issue({ role: 'user', organizationId: org._id, invitedBy: admin._id });
        const userSignup = await request(app).post('/api/auth/signup').send({
            invitationToken: userInvite.token,
            firstName: 'P3', lastName: 'User',
            email: `p3.user.${Date.now()}@test.com`, password: 'UserPass123!', phone: '+2234500002'
        }).expect(201);
        const userToken = userSignup.body.data.accessToken;

        // report two collections
        const c1 = await request(app)
            .post('/api/collections/report')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ wasteType: 'plastic', quantity: 1, location: { type: 'Point', coordinates: [2.35, 48.85] } })
            .expect(201);
        const c2 = await request(app)
            .post('/api/collections/report')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ wasteType: 'paper', quantity: 1, location: { type: 'Point', coordinates: [2.36, 48.86] } })
            .expect(201);

        // create two missions (one completed, one in-progress)
        const m1 = await request(app)
            .post('/api/missions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ collectionId: c1.body.data.collection._id, organizationId: org._id })
            .expect(201);
        const mission1 = m1.body.data.mission;

        await request(app)
            .patch(`/api/missions/${mission1._id}/assign`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ collectorId: collector.id })
            .expect(200);
        await request(app)
            .patch(`/api/missions/${mission1._id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'in-progress' })
            .expect(200);
        await request(app)
            .patch(`/api/missions/${mission1._id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'completed' })
            .expect(200);

        const m2 = await request(app)
            .post('/api/missions')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ collectionId: c2.body.data.collection._id, organizationId: org._id })
            .expect(201);
        const mission2 = m2.body.data.mission;
        await request(app)
            .patch(`/api/missions/${mission2._id}/assign`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ collectorId: collector.id })
            .expect(200);
        await request(app)
            .patch(`/api/missions/${mission2._id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'in-progress' })
            .expect(200);
    };

    afterEach(async () => {
        await Mission.deleteMany({});
        await Collection.deleteMany({});
        await User.deleteMany({});
        await Organization.deleteMany({});
    });

    it('returns KPIs grouped by day', async () => {
        await setup();
        const res = await request(app)
            .get('/api/business/analytics/kpis?interval=day')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.byStatus)).toBe(true);
    });

    it('returns top collector performance', async () => {
        await setup();
        const res = await request(app)
            .get('/api/business/analytics/collectors?limit=5')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.collectors)).toBe(true);
    });

    it('exports missions as CSV', async () => {
        await setup();
        const res = await request(app)
            .get('/api/business/analytics/exports/missions.csv')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        expect(res.headers['content-type']).toContain('text/csv');
        expect(res.text.split('\n')[0]).toContain('missionId');
    });
});


