const User = require('../models/User');

const requireOrgScope = (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Super-admin can access everything
    if (user.role === 'admin') return next();

    // org_admin and collector must have organizationId
    if (['org_admin', 'collector'].includes(user.role) && !user.organizationId) {
        return res.status(403).json({ success: false, message: 'Organization access required' });
    }

    next();
};

const scopeToOrganization = (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Super-admin can access everything
    if (user.role === 'admin') return next();

    // Add organization filter to query
    if (user.organizationId) {
        req.organizationFilter = { organizationId: user.organizationId };
    }

    next();
};

module.exports = { requireOrgScope, scopeToOrganization };
