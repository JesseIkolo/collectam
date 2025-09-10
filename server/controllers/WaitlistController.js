const Waitlist = require('../models/Waitlist');

module.exports = {
    async addToWaitlist(req, res) {
        try {
            const { firstName, lastName, email, phoneNumber, message, userType } = req.body;
            
            // Validate required fields
            if (!firstName || !lastName || !email || !message || !userType) {
                return res.status(400).json({
                    success: false,
                    message: 'Required fields: firstName, lastName, email, message, userType'
                });
            }

            // Validate userType
            const validUserTypes = ['menage', 'collecteur', 'collectam-business', 'entreprise'];
            if (!validUserTypes.includes(userType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid userType. Must be one of: menage, collecteur, collectam-business, entreprise'
                });
            }

            // Check if email already exists in waitlist
            const existingEntry = await Waitlist.findOne({ email });
            if (existingEntry) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists in waitlist'
                });
            }

            // Get client info for tracking
            const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
            const userAgent = req.get('User-Agent');

            // Create waitlist entry
            const waitlistEntry = await Waitlist.create({
                firstName,
                lastName,
                email,
                phoneNumber: phoneNumber || null,
                message,
                userType,
                ipAddress,
                userAgent
            });

            res.status(201).json({
                success: true,
                message: 'Successfully added to waitlist',
                data: {
                    id: waitlistEntry._id,
                    firstName: waitlistEntry.firstName,
                    lastName: waitlistEntry.lastName,
                    email: waitlistEntry.email,
                    userType: waitlistEntry.userType,
                    status: waitlistEntry.status,
                    createdAt: waitlistEntry.createdAt
                }
            });

        } catch (error) {
            console.error('Waitlist error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    async getWaitlist(req, res) {
        try {
            const { page = 1, limit = 10, userType, status } = req.query;
            
            // Build filter
            const filter = {};
            if (userType) filter.userType = userType;
            if (status) filter.status = status;

            // Get paginated results
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { createdAt: -1 }
            };

            const waitlistEntries = await Waitlist.find(filter)
                .sort(options.sort)
                .limit(options.limit * 1)
                .skip((options.page - 1) * options.limit);

            const total = await Waitlist.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: {
                    entries: waitlistEntries,
                    pagination: {
                        page: options.page,
                        limit: options.limit,
                        total,
                        pages: Math.ceil(total / options.limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get waitlist error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    async updateWaitlistStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['pending', 'contacted', 'converted', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be one of: pending, contacted, converted, rejected'
                });
            }

            const waitlistEntry = await Waitlist.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!waitlistEntry) {
                return res.status(404).json({
                    success: false,
                    message: 'Waitlist entry not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Status updated successfully',
                data: waitlistEntry
            });

        } catch (error) {
            console.error('Update waitlist status error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
};
