const OTPService = require('../services/OTPService');
const InvitationService = require('../services/InvitationService');

const maskRecipient = (recipient, channel) => {
    if (channel === 'sms') {
        return recipient.replace(/.(?=.{2})/g, '*');
    }
    if (channel === 'email') {
        const [user, domain] = recipient.split('@');
        const maskedUser = user.length <= 2 ? '*'.repeat(user.length) : user[0] + '*'.repeat(user.length - 2) + user[user.length - 1];
        return `${maskedUser}@${domain}`;
    }
    return recipient;
};

module.exports = {
    async requestOTP(req, res) {
        try {
            const { recipient, channel = 'sms' } = req.body;
            if (!recipient) return res.status(400).json({ success: false, message: 'recipient required' });
            if (!['sms', 'email'].includes(channel)) return res.status(400).json({ success: false, message: 'invalid channel' });

            const { expiresAt } = await OTPService.issue(recipient, channel);

            return res.status(200).json({ success: true, message: 'OTP sent', data: { recipient: maskRecipient(recipient, channel), channel, expiresAt } });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Failed to send OTP' });
        }
    },

    async verifyOTP(req, res) {
        try {
            const { recipient, channel = 'sms', code } = req.body;
            if (!recipient || !code) return res.status(400).json({ success: false, message: 'recipient and code required' });

            const result = await OTPService.verify(recipient, channel, code);
            if (!result.ok) {
                const statusMap = { invalid: 400, expired: 400, not_found: 404, locked: 429, max_attempts: 429 };
                const http = statusMap[result.reason] || 400;
                return res.status(http).json({ success: false, message: `OTP ${result.reason}` });
            }
            return res.status(200).json({ success: true, message: 'OTP verified' });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Verification failed' });
        }
    },

    async issueInvitation(req, res) {
        try {
            const requester = req.user;
            if (!requester || !['admin'].includes(requester.role)) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            const { role, organizationId } = req.body;
            if (!role) return res.status(400).json({ success: false, message: 'role required' });
            const { token, jti, expiresAt } = await InvitationService.issue({ role, organizationId, invitedBy: requester.id });
            return res.status(201).json({ success: true, message: 'Invitation issued', data: { token, jti, expiresAt } });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Failed to issue invitation' });
        }
    },

    async validateInvitation(req, res) {
        try {
            const { token } = req.body;
            if (!token) return res.status(400).json({ success: false, message: 'token required' });
            const result = await InvitationService.validate(token);
            if (!result.ok) {
                return res.status(400).json({ success: false, message: `Invitation ${result.reason}` });
            }
            return res.status(200).json({ success: true, message: 'Invitation valid', data: result.payload });
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Failed to validate invitation' });
        }
    }
};


