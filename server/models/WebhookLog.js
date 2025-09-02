const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    url: String,
    event: String,
    payloadId: String,
    status: { type: String, enum: ['success', 'failed'], required: true },
    httpStatus: Number,
    error: String
}, { timestamps: true });

webhookLogSchema.index({ organizationId: 1, createdAt: -1 });

module.exports = mongoose.model('WebhookLog', webhookLogSchema);


