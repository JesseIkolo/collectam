const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Invitation = require('../models/Invitation');

class InvitationService {
    constructor({ ttlHours = 72 } = {}) {
        this.ttlHours = ttlHours;
    }

    async issue({ role, organizationId, invitedBy }) {
        const jti = uuidv4();
        const expiresAt = new Date(Date.now() + this.ttlHours * 60 * 60 * 1000);

        await Invitation.create({ jti, role, organizationId, invitedBy, status: 'active', expiresAt });

        const token = jwt.sign({ jti, role, organizationId }, process.env.JWT_INVITE_SECRET, { expiresIn: `${this.ttlHours}h` });
        return { token, jti, expiresAt };
    }

    async validate(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_INVITE_SECRET);
            const record = await Invitation.findOne({ jti: decoded.jti });
            if (!record) return { ok: false, reason: 'not_found' };
            if (record.status !== 'active') return { ok: false, reason: record.status };
            if (record.expiresAt <= new Date()) return { ok: false, reason: 'expired' };
            return { ok: true, payload: decoded };
        } catch (e) {
            return { ok: false, reason: 'invalid' };
        }
    }

    async consume(jti) {
        const record = await Invitation.findOne({ jti });
        if (!record) return;
        record.status = 'used';
        record.usedAt = new Date();
        await record.save();
    }

    async revoke(jti) {
        await Invitation.updateOne({ jti }, { $set: { status: 'revoked' } });
    }
}

module.exports = new InvitationService();


