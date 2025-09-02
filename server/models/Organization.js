const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    settings: {
        autoAssignEnabled: { type: Boolean, default: false },
        autoAssignRadiusMeters: { type: Number, default: 10000 },
        maxActiveMissionsPerCollector: { type: Number, default: 5 },
        webhooks: [{
            url: String,
            events: [String],
            secret: String,
            enabled: { type: Boolean, default: true }
        }],
        limits: {
            collectors: { type: Number, default: 50 },
            vehicles: { type: Number, default: 50 },
            dailyMissions: { type: Number, default: 1000 }
        }
    }
}, {
    timestamps: true
});

organizationSchema.index({ slug: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Organization', organizationSchema);


