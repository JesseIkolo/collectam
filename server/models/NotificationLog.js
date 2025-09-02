const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    channel: { type: String, enum: ['sms', 'email', 'push', 'whatsapp'], required: true },
    to: String,
    subject: String,
    message: String,
    template: String,
    status: { type: String, enum: ['success', 'failed'], required: true },
    messageId: String,
    error: String
}, { timestamps: true });

notificationLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('NotificationLog', notificationLogSchema);


