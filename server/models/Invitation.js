const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    jti: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'collector', 'manager', 'admin'], required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'used', 'revoked', 'expired'], default: 'active' },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
}, { timestamps: true });

invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { status: 'active' } });

module.exports = mongoose.model('Invitation', invitationSchema);


