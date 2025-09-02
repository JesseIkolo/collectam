const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    action: { type: String, required: true },
    targetType: String,
    targetId: String,
    metadata: Object
}, { timestamps: true });

auditLogSchema.index({ organizationId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);


