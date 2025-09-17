const Mission = require('../models/Mission');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Collection = require('../models/Collection');
const Organization = require('../models/Organization');
const { validationResult } = require('express-validator');
const BillingService = require('../services/BillingService');

class BusinessController {
    // Get business dashboard overview
    async getDashboard(req, res) {
        try {
            const organizationId = req.user.organizationId;

            // Get counts by status
            const missionCounts = await Mission.aggregate([
                { $match: { organizationId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]);

            // Get collector count
            const collectorCount = await User.countDocuments({
                organizationId,
                role: 'collector'
            });

            // Get vehicle count
            const vehicleCount = await Vehicle.countDocuments({ organizationId });

            // Get today's missions
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayMissions = await Mission.countDocuments({
                organizationId,
                createdAt: { $gte: today }
            });

            // Get completed missions this week
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const weeklyCompleted = await Mission.countDocuments({
                organizationId,
                status: 'completed',
                'timestamp.completed': { $gte: weekAgo }
            });

            res.json({
                success: true,
                data: {
                    overview: {
                        totalMissions: missionCounts.reduce((sum, item) => sum + item.count, 0),
                        missionCounts,
                        collectorCount,
                        vehicleCount,
                        todayMissions,
                        weeklyCompleted
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard data',
                error: error.message
            });
        }
    }

    // Get collectors with their stats
    async getCollectors(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const organizationId = req.user.organizationId;

            const collectors = await User.find({
                organizationId,
                role: 'collector'
            })
                .select('firstName lastName email phone createdAt')
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);

            // Get mission counts for each collector
            const collectorsWithStats = await Promise.all(
                collectors.map(async (collector) => {
                    const totalMissions = await Mission.countDocuments({
                        organizationId,
                        collectorId: collector._id
                    });

                    const completedMissions = await Mission.countDocuments({
                        organizationId,
                        collectorId: collector._id,
                        status: 'completed'
                    });

                    return {
                        ...collector.toObject(),
                        stats: {
                            totalMissions,
                            completedMissions,
                            completionRate: totalMissions > 0 ? (completedMissions / totalMissions * 100).toFixed(1) : 0
                        }
                    };
                })
            );

            const total = await User.countDocuments({
                organizationId,
                role: 'collector'
            });

            res.json({
                success: true,
                data: {
                    collectors: collectorsWithStats,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    total
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch collectors',
                error: error.message
            });
        }
    }

    // Get vehicles with their stats
    async getVehicles(req, res) {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const organizationId = req.user.organizationId;

            const filter = { organizationId };
            if (status) filter.status = status;

            const vehicles = await Vehicle.find(filter)
                .populate('collectorId', 'firstName lastName email')
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);

            // Get mission counts for each vehicle
            const vehiclesWithStats = await Promise.all(
                vehicles.map(async (vehicle) => {
                    const totalMissions = await Mission.countDocuments({
                        organizationId,
                        vehicleId: vehicle._id
                    });

                    const completedMissions = await Mission.countDocuments({
                        organizationId,
                        vehicleId: vehicle._id,
                        status: 'completed'
                    });

                    return {
                        ...vehicle.toObject(),
                        stats: {
                            totalMissions,
                            completedMissions,
                            completionRate: totalMissions > 0 ? (completedMissions / totalMissions * 100).toFixed(1) : 0
                        }
                    };
                })
            );

            const total = await Vehicle.countDocuments(filter);

            res.json({
                success: true,
                data: {
                    vehicles: vehiclesWithStats,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    total
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch vehicles',
                error: error.message
            });
        }
    }

    // Get pending collections
    async getPendingCollections(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const organizationId = req.user.organizationId;

            const collections = await Collection.find({
                status: 'pending',
                organizationId
            })
                .populate('userId', 'firstName lastName email phone')
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);

            const total = await Collection.countDocuments({
                status: 'pending',
                organizationId
            });

            res.json({
                success: true,
                data: {
                    collections,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    total
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch pending collections',
                error: error.message
            });
        }
    }

    // Get organization settings
    async getOrgSettings(req, res) {
        try {
            const organizationId = req.user.organizationId;
            const org = await Organization.findById(organizationId).select('settings');
            if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
            res.json({ success: true, data: { settings: org.settings } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
        }
    }

    // Update organization settings
    async updateOrgSettings(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
            }
            const organizationId = req.user.organizationId;
            const { autoAssignEnabled, autoAssignRadiusMeters, maxActiveMissionsPerCollector } = req.body;
            const org = await Organization.findById(organizationId);
            if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });

            if (typeof autoAssignEnabled === 'boolean') org.settings.autoAssignEnabled = autoAssignEnabled;
            if (typeof autoAssignRadiusMeters === 'number') org.settings.autoAssignRadiusMeters = autoAssignRadiusMeters;
            if (typeof maxActiveMissionsPerCollector === 'number') org.settings.maxActiveMissionsPerCollector = maxActiveMissionsPerCollector;

            await org.save();
            res.json({ success: true, message: 'Settings updated', data: { settings: org.settings } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
        }
    }

    // Analytics: KPIs over a date range, grouped by day or week
    async getAnalyticsKpis(req, res) {
        try {
            const organizationId = req.user.organizationId;
            const { from, to, interval = 'day' } = req.query;

            const start = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const end = to ? new Date(to) : new Date();

            const dateTrunc = interval === 'week'
                ? { $dateTrunc: { date: '$createdAt', unit: 'week' } }
                : { $dateTrunc: { date: '$createdAt', unit: 'day' } };

            const pipeline = [
                { $match: { organizationId, createdAt: { $gte: start, $lte: end } } },
                {
                    $group: {
                        _id: { period: dateTrunc, status: '$status' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.period': 1 } }
            ];

            const byStatus = await Mission.aggregate(pipeline);

            res.json({ success: true, data: { byStatus, interval, from: start, to: end } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
        }
    }

    // Analytics: collector performance
    async getCollectorPerformance(req, res) {
        try {
            const organizationId = req.user.organizationId;
            const { from, to, limit = 10 } = req.query;
            const start = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const end = to ? new Date(to) : new Date();

            const pipeline = [
                { $match: { organizationId, createdAt: { $gte: start, $lte: end } } },
                {
                    $group: {
                        _id: '$collectorId',
                        total: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } }
                    }
                },
                { $sort: { completed: -1, total: -1 } },
                { $limit: Number(limit) }
            ];

            const results = await Mission.aggregate(pipeline);
            const populated = await User.populate(results, { path: '_id', select: 'firstName lastName email' });
            res.json({ success: true, data: { collectors: populated } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch collector performance', error: error.message });
        }
    }

    // Export missions CSV for a date range and optional status
    async exportMissionsCsv(req, res) {
        try {
            const organizationId = req.user.organizationId;
            const { from, to, status } = req.query;
            const start = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const end = to ? new Date(to) : new Date();

            const filter = { organizationId, createdAt: { $gte: start, $lte: end } };
            if (status) filter.status = status;

            const missions = await Mission.find(filter)
                .populate('collectorId', 'firstName lastName email')
                .populate('vehicleId', 'registration vehicleType')
                .populate('collectionId', 'wasteType location');

            const headers = ['missionId', 'status', 'createdAt', 'collector', 'vehicle', 'wasteType', 'longitude', 'latitude'];
            const rows = missions.map(m => [
                String(m._id),
                m.status,
                m.createdAt.toISOString(),
                m.collectorId ? `${m.collectorId.firstName} ${m.collectorId.lastName}` : '',
                m.vehicleId ? m.vehicleId.registration : '',
                m.collectionId ? m.collectionId.wasteType : '',
                m.collectionId?.location?.coordinates?.[0] ?? '',
                m.collectionId?.location?.coordinates?.[1] ?? ''
            ]);

            const csv = [headers.join(','), ...rows.map(r => r.map(v => String(v).replace(/"/g, '""')).join(','))].join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="missions_${start.toISOString()}_${end.toISOString()}.csv"`);
            res.status(200).send(csv);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to export CSV', error: error.message });
        }
    }

    // Webhooks CRUD (org_admin/admin)
    async listWebhooks(req, res) {
        try {
            const org = await Organization.findById(req.user.organizationId).select('settings.webhooks');
            if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
            res.json({ success: true, data: { webhooks: org.settings.webhooks || [] } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to list webhooks', error: error.message });
        }
    }

    async createWebhook(req, res) {
        try {
            const { url, events = [], secret = '' } = req.body;
            if (!url) return res.status(400).json({ success: false, message: 'url is required' });
            const org = await Organization.findById(req.user.organizationId);
            if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
            org.settings.webhooks = org.settings.webhooks || [];
            const hook = { url, events, secret, enabled: true };
            org.settings.webhooks.push(hook);
            await org.save();
            res.status(201).json({ success: true, data: { webhook: hook } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to create webhook', error: error.message });
        }
    }

    async updateWebhook(req, res) {
        try {
            const { index } = req.params;
            const { url, events, secret, enabled } = req.body;
            const org = await Organization.findById(req.user.organizationId);
            if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
            const i = Number(index);
            if (!org.settings.webhooks || !org.settings.webhooks[i]) return res.status(404).json({ success: false, message: 'Webhook not found' });
            if (typeof url === 'string') org.settings.webhooks[i].url = url;
            if (Array.isArray(events)) org.settings.webhooks[i].events = events;
            if (typeof secret === 'string') org.settings.webhooks[i].secret = secret;
            if (typeof enabled === 'boolean') org.settings.webhooks[i].enabled = enabled;
            await org.save();
            res.json({ success: true, data: { webhook: org.settings.webhooks[i] } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update webhook', error: error.message });
        }
    }

    async deleteWebhook(req, res) {
        try {
            const { index } = req.params;
            const org = await Organization.findById(req.user.organizationId);
            if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
            const i = Number(index);
            if (!org.settings.webhooks || !org.settings.webhooks[i]) return res.status(404).json({ success: false, message: 'Webhook not found' });
            org.settings.webhooks.splice(i, 1);
            await org.save();
            res.json({ success: true, message: 'Webhook deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to delete webhook', error: error.message });
        }
    }

    // Billing mock endpoints
    async listPlans(req, res) {
        res.json({ success: true, data: { plans: BillingService.getPlans() } });
    }

    async estimateInvoice(req, res) {
        try {
            const estimate = await BillingService.estimateInvoice(req.user.organizationId, new Date());
            res.json({ success: true, data: { estimate } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to estimate invoice', error: error.message });
        }
    }

    // Get business subscription plans
    async getSubscriptionPlans(req, res) {
        try {
            const plans = [
                {
                    id: 'business-monthly',
                    name: 'Mensuel',
                    price: 10000,
                    currency: 'XOF',
                    duration: 1,
                    durationType: 'month',
                    features: [
                        'Véhicules illimités',
                        'Collecteurs illimités',
                        'Gestion de flotte',
                        'Rapports avancés',
                        'Support prioritaire'
                    ]
                },
                {
                    id: 'business-quarterly',
                    name: 'Trimestriel',
                    price: 25000,
                    currency: 'XOF',
                    duration: 3,
                    durationType: 'month',
                    savings: 5000,
                    features: [
                        'Véhicules illimités',
                        'Collecteurs illimités',
                        'Gestion de flotte',
                        'Rapports avancés',
                        'Support prioritaire',
                        'Économie de 5 000 XOF'
                    ]
                },
                {
                    id: 'business-yearly',
                    name: 'Annuel',
                    price: 72000,
                    currency: 'XOF',
                    duration: 12,
                    durationType: 'month',
                    savings: 48000,
                    popular: true,
                    features: [
                        'Véhicules illimités',
                        'Collecteurs illimités',
                        'Gestion de flotte',
                        'Rapports avancés',
                        'Support prioritaire',
                        'Économie de 48 000 XOF',
                        'Formation gratuite'
                    ]
                }
            ];

            res.json({
                success: true,
                data: { plans }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des plans',
                error: error.message
            });
        }
    }

    // Subscribe to business plan
    async subscribeToBusiness(req, res) {
        try {
            const { planId } = req.body;
            const userId = req.user._id;

            const planPrices = {
                'business-monthly': { price: 10000, months: 1 },
                'business-quarterly': { price: 25000, months: 3 },
                'business-yearly': { price: 72000, months: 12 }
            };

            if (!planPrices[planId]) {
                return res.status(400).json({
                    success: false,
                    message: 'Plan invalide'
                });
            }

            const plan = planPrices[planId];
            const startDate = new Date();
            const expiry = new Date();
            expiry.setMonth(expiry.getMonth() + plan.months);

            // Update user subscription and userType
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    userType: 'collectam-business',
                    'subscription.plan': planId,
                    'subscription.price': plan.price,
                    'subscription.currency': 'XOF',
                    'subscription.startDate': startDate,
                    'subscription.expiry': expiry,
                    'subscription.isActive': true
                },
                { new: true, select: '-password' }
            );

            res.json({
                success: true,
                message: 'Abonnement Business activé avec succès',
                data: {
                    user: updatedUser,
                    subscription: {
                        plan: planId,
                        price: plan.price,
                        currency: 'XOF',
                        startDate,
                        expiry,
                        isActive: true
                    }
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'activation de l\'abonnement',
                error: error.message
            });
        }
    }

    // Get business fleet (collectors and vehicles)
    async getFleet(req, res) {
        try {
            const ownerId = req.user._id;

            // Get all vehicles owned by this business user
            const vehicles = await Vehicle.find({ ownerId })
                .populate('assignedCollectorId', 'firstName lastName email phone')
                .sort({ createdAt: -1 });

            // Get all collectors (users with role 'collector' that could be assigned)
            const availableCollectors = await User.find({ 
                role: 'collector',
                userType: 'collecteur'
            }).select('firstName lastName email phone onDuty lastSeenAt');

            // Get assigned collectors
            const assignedCollectorIds = vehicles
                .filter(v => v.assignedCollectorId)
                .map(v => v.assignedCollectorId._id);

            const assignedCollectors = await User.find({
                _id: { $in: assignedCollectorIds }
            }).select('firstName lastName email phone onDuty lastSeenAt');

            res.json({
                success: true,
                data: {
                    vehicles: {
                        total: vehicles.length,
                        active: vehicles.filter(v => v.status === 'actif').length,
                        list: vehicles
                    },
                    collectors: {
                        available: availableCollectors,
                        assigned: assignedCollectors,
                        total: assignedCollectors.length
                    }
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de la flotte',
                error: error.message
            });
        }
    }

    // Assign collector to vehicle
    async assignCollectorToVehicle(req, res) {
        try {
            const { vehicleId, collectorId } = req.body;
            const ownerId = req.user._id;

            // Verify vehicle belongs to this business user
            const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId });
            if (!vehicle) {
                return res.status(404).json({
                    success: false,
                    message: 'Véhicule non trouvé'
                });
            }

            // Verify collector exists
            const collector = await User.findOne({ 
                _id: collectorId, 
                role: 'collector' 
            });
            if (!collector) {
                return res.status(404).json({
                    success: false,
                    message: 'Collecteur non trouvé'
                });
            }

            // Update vehicle with assigned collector
            vehicle.assignedCollectorId = collectorId;
            await vehicle.save();

            const updatedVehicle = await Vehicle.findById(vehicleId)
                .populate('assignedCollectorId', 'firstName lastName email phone');

            res.json({
                success: true,
                message: 'Collecteur assigné avec succès',
                data: { vehicle: updatedVehicle }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'assignation du collecteur',
                error: error.message
            });
        }
    }

    // Remove collector from vehicle
    async removeCollectorFromVehicle(req, res) {
        try {
            const { vehicleId } = req.params;
            const ownerId = req.user._id;

            const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId });
            if (!vehicle) {
                return res.status(404).json({
                    success: false,
                    message: 'Véhicule non trouvé'
                });
            }

            vehicle.assignedCollectorId = null;
            await vehicle.save();

            res.json({
                success: true,
                message: 'Collecteur retiré avec succès',
                data: { vehicle }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors du retrait du collecteur',
                error: error.message
            });
        }
    }

    // Delete user account
    async deleteAccount(req, res) {
        try {
            const userId = req.user._id;
            const { password } = req.body;

            // Verify password before deletion
            const user = await User.findById(userId).select('+password');
            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Mot de passe incorrect'
                });
            }

            // Delete all user's vehicles
            await Vehicle.deleteMany({ ownerId: userId });

            // Delete user account
            await User.findByIdAndDelete(userId);

            res.json({
                success: true,
                message: 'Compte supprimé avec succès'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression du compte',
                error: error.message
            });
        }
    }
}

module.exports = new BusinessController();
