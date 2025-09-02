const crypto = require('crypto');
const fetch = require('node-fetch');
const Organization = require('../models/Organization');
const WebhookLog = require('../models/WebhookLog');

class WebhookService {
    constructor() {
        this.maxRetries = 3;
        this.retryDelayMs = 2000;
    }

    signPayload(secret, payload) {
        const body = JSON.stringify(payload);
        const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');
        return { body, signature };
    }

    async deliver(url, secret, payload, attempt = 1, organizationId) {
        try {
            const { body, signature } = this.signPayload(secret || '', payload);
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Collectam-Signature': signature,
                    'X-Collectam-Event': payload.event,
                    'X-Collectam-Delivery': payload.id
                },
                body
            });
            if (!res.ok) {
                throw new Error(`Non-2xx status: ${res.status}`);
            }
            try { await WebhookLog.create({ organizationId, url, event: payload.event, payloadId: payload.id, status: 'success', httpStatus: res.status }); } catch (_) { }
            return true;
        } catch (err) {
            if (attempt < this.maxRetries) {
                await new Promise(r => setTimeout(r, this.retryDelayMs * attempt));
                return this.deliver(url, secret, payload, attempt + 1, organizationId);
            }
            try { await WebhookLog.create({ organizationId, url, event: payload.event, payloadId: payload.id, status: 'failed', error: String(err) }); } catch (_) { }
            return false;
        }
    }

    async emit(organizationId, event, data) {
        try {
            const org = await Organization.findById(organizationId).select('settings.webhooks');
            if (!org || !org.settings || !Array.isArray(org.settings.webhooks)) return;

            const deliveries = org.settings.webhooks
                .filter(w => w.enabled !== false && (!w.events || w.events.length === 0 || w.events.includes(event)))
                .map(w => this.deliver(w.url, w.secret, {
                    id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
                    event,
                    organizationId: String(organizationId),
                    data,
                    timestamp: new Date().toISOString()
                }, 1, organizationId));

            await Promise.allSettled(deliveries);
        } catch (_) {
            // Swallow errors to avoid impacting main flow
        }
    }
}

module.exports = new WebhookService();


