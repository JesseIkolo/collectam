const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    recipient: { type: String, required: true }, // email or phone
    channel: { type: String, enum: ['email', 'sms'], required: true },
    code: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    expiresAt: { type: Date, required: true },
    lockedUntil: { type: Date },
    metadata: { type: Object }
}, { timestamps: true });

otpSchema.index({ recipient: 1, channel: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);


