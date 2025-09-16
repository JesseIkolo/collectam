const AuthService = require('../services/AuthService');
const User = require('../models/User');
const InvitationService = require('../services/InvitationService');

module.exports = {
    async signup(req, res) {
        try {
            const { invitationToken, firstName, lastName, email, password, phone, role, companyName, userType } = req.body;
            
            // Validate required fields
            if (!firstName || !lastName || !email || !password || !phone) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required: firstName, lastName, email, password, phone'
                });
            }

            let invitationResult = null;
            
            // Validate invitation token only if provided
            if (invitationToken && invitationToken.trim() !== '') {
                const InvitationService = require('../services/InvitationService');
                invitationResult = await InvitationService.validate(invitationToken);
                
                if (!invitationResult.ok) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid invitation: ${invitationResult.reason}`
                    });
                }
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            // Determine final role - map userType to role
            let finalRole = role || 'user';
            
            // Map userType to appropriate role
            if (userType) {
                switch (userType) {
                    case 'collecteur':
                    case 'collectam-business':
                        finalRole = 'collector';
                        break;
                    case 'entreprise':
                        finalRole = 'user';
                        break;
                    case 'menage':
                    default:
                        finalRole = 'user';
                        break;
                }
            }
            
            // Override with invitation role if provided
            if (invitationResult && invitationResult.payload.role) {
                finalRole = invitationResult.payload.role;
            }

            // Create user with invitation data
            const userData = {
                firstName,
                lastName,
                email,
                password,
                phone,
                role: finalRole,
                organizationId: invitationResult ? invitationResult.payload.organizationId : null,
                companyName: companyName || null,
                userType: userType || null
            };

            const user = await User.create(userData);

            // Consume invitation only if token was provided
            if (invitationResult) {
                await InvitationService.consume(invitationResult.payload.jti);
            }
            const tokens = await AuthService.generateTokens(user);

            // Remove password from response
            const userResponse = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId
            };

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    user: userResponse,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                }
            });

        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during signup'
            });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            // Find user by email
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate tokens
            const tokens = await AuthService.generateTokens(user);

            // Remove password from response
            const userResponse = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId
            };

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userResponse,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during login'
            });
        }
    },

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            const result = await AuthService.refreshAccessToken(refreshToken);
            
            if (!result.success) {
                return res.status(401).json({
                    success: false,
                    message: result.message
                });
            }

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                }
            });

        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during token refresh'
            });
        }
    },

    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            
            if (refreshToken) {
                await AuthService.revokeRefreshToken(refreshToken);
            }

            res.status(200).json({
                success: true,
                message: 'Logout successful'
            });

        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during logout'
            });
        }
    }
};
