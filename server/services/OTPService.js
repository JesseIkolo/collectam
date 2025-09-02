const crypto = require('crypto');
const OTP = require('../models/OTP');

class OTPService {
    constructor({ ttlMinutes = 5, maxAttempts = 5, lockMinutes = 15 } = {}) {
        this.ttlMinutes = ttlMinutes;
        this.maxAttempts = maxAttempts;
        this.lockMinutes = lockMinutes;
    }

    generateCode() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    async issue(recipient, channel = 'sms', metadata = {}) {
        const code = this.generateCode();
        const expiresAt = new Date(Date.now() + this.ttlMinutes * 60 * 1000);

        await OTP.deleteMany({ recipient, channel });

        const record = await OTP.create({ recipient, channel, code, attempts: 0, maxAttempts: this.maxAttempts, expiresAt, metadata });

        return { code, expiresAt, recordId: record._id };
    }

    async verify(recipient, channel, code) {
        const record = await OTP.findOne({ recipient, channel }).sort({ createdAt: -1 });
        if (!record) return { ok: false, reason: 'not_found' };

        const now = new Date();
        if (record.lockedUntil && record.lockedUntil > now) {
            return { ok: false, reason: 'locked' };
        }
        if (record.expiresAt <= now) {
            return { ok: false, reason: 'expired' };
        }
        if (record.attempts >= record.maxAttempts) {
            return { ok: false, reason: 'max_attempts' };
        }

        if (record.code !== code) {
            record.attempts += 1;
            if (record.attempts >= record.maxAttempts) {
                record.lockedUntil = new Date(Date.now() + this.lockMinutes * 60 * 1000);
            }
            await record.save();
            return { ok: false, reason: 'invalid' };
        }

        await OTP.deleteMany({ recipient, channel });
        return { ok: true };
    }
}

module.exports = new OTPService();


