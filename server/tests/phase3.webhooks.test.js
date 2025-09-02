const request = require('supertest');
const app = require('./testApp');
const User = require('../models/User');
const Organization = require('../models/Organization');

describe('Phase 3 - Webhooks CRUD', () => {
    let adminToken;

    const setup = async () => {
        const org = await Organization.create({ name: `WH Org ${Date.now()}`, slug: `wh-${Date.now()}` });
        const admin = await User.create({
            firstName: 'Admin', lastName: 'WH', email: `wh.admin.${Date.now()}@test.com`, password: 'AdminPass123!',
            phone: '+2234500005', role: 'admin', organizationId: org._id
        });
        const adminLogin = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'AdminPass123!' });
        adminToken = adminLogin.body.data.accessToken;
    };

    it('can create, list, update and delete webhooks', async () => {
        await setup();

        // initial list
        const list0 = await request(app).get('/api/business/webhooks').set('Authorization', `Bearer ${adminToken}`).expect(200);
        expect(Array.isArray(list0.body.data.webhooks)).toBe(true);

        // create
        const created = await request(app)
            .post('/api/business/webhooks')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ url: 'https://example.com/webhooks', events: ['mission.created'], secret: 'shhh' })
            .expect(201);
        expect(created.body.success).toBe(true);

        // list
        const list1 = await request(app).get('/api/business/webhooks').set('Authorization', `Bearer ${adminToken}`).expect(200);
        expect(list1.body.data.webhooks.length).toBe(1);

        // update
        const updated = await request(app)
            .put('/api/business/webhooks/0')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ enabled: false })
            .expect(200);
        expect(updated.body.data.webhook.enabled).toBe(false);

        // delete
        await request(app).delete('/api/business/webhooks/0').set('Authorization', `Bearer ${adminToken}`).expect(200);
        const list2 = await request(app).get('/api/business/webhooks').set('Authorization', `Bearer ${adminToken}`).expect(200);
        expect(list2.body.data.webhooks.length).toBe(0);
    });
});


