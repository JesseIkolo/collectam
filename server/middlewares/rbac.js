const User = require('../models/User');

/**
 * Enhanced RBAC middleware based on dashboard requirements
 * Supports hierarchical permissions and organization scoping
 */

// Role hierarchy (higher roles inherit lower role permissions)
const ROLE_HIERARCHY = {
  'admin': 4,
  'org_admin': 3,
  'collector': 2,
  'user': 1
};

// Permission matrix based on dashboard PRD
const ROLE_PERMISSIONS = {
  'admin': [
    // Global access
    'organizations:*',
    'users:*',
    'vehicles:*',
    'analytics:global',
    'system:config',
    'audit:view',
    // Dashboard specific
    'dashboard:admin',
    'kpi:global',
    'reports:all'
  ],
  'org_admin': [
    // Organization scoped
    'collectors:manage',
    'vehicles:manage',
    'zones:manage',
    'missions:manage',
    'users:org',
    'analytics:org',
    // Dashboard specific
    'dashboard:org_admin',
    'kpi:org',
    'reports:org',
    'planning:manage'
  ],
  'collector': [
    // Personal/assigned missions
    'missions:view_assigned',
    'missions:update_status',
    'qr:scan',
    'photos:upload',
    'vehicle:status',
    'location:update',
    // Dashboard specific
    'dashboard:collector',
    'performance:view_own'
  ],
  'user': [
    // Basic user actions
    'waste:report',
    'collections:view_own',
    'profile:manage',
    'notifications:view',
    'rewards:view',
    // Dashboard specific
    'dashboard:user',
    'impact:view_own'
  ]
};

/**
 * Check if user has specific permission
 */
const hasPermission = (userRole, permission, organizationId = null, targetOrgId = null) => {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  
  // Check direct permission match
  if (userPermissions.includes(permission)) {
    return true;
  }
  
  // Check wildcard permissions
  const [resource, action] = permission.split(':');
  const wildcardPermission = `${resource}:*`;
  if (userPermissions.includes(wildcardPermission)) {
    return true;
  }
  
  // For org_admin, check organization scope
  if (userRole === 'org_admin' && organizationId && targetOrgId) {
    return organizationId.toString() === targetOrgId.toString();
  }
  
  return false;
};

/**
 * Check if user role has sufficient level for operation
 */
const hasRoleLevel = (userRole, requiredRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
};

/**
 * Middleware to check specific permissions
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { role, organizationId } = req.user;
    const targetOrgId = req.params.organizationId || req.body.organizationId || req.query.organizationId;

    if (!hasPermission(role, permission, organizationId, targetOrgId)) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${permission}`,
        requiredPermission: permission,
        userRole: role
      });
    }

    next();
  };
};

/**
 * Middleware to check role level
 */
const requireRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!hasRoleLevel(req.user.role, minRole)) {
      return res.status(403).json({
        success: false,
        message: `Insufficient role level. Required: ${minRole}`,
        userRole: req.user.role,
        requiredRole: minRole
      });
    }

    next();
  };
};

/**
 * Organization scoping middleware
 * Ensures org_admin can only access their organization's data
 */
const enforceOrgScope = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { role, organizationId } = req.user;
  
  // Admin has global access
  if (role === 'admin') {
    return next();
  }

  // For org_admin, enforce organization scope
  if (role === 'org_admin') {
    const targetOrgId = req.params.organizationId || req.body.organizationId || req.query.organizationId;
    
    if (targetOrgId && organizationId.toString() !== targetOrgId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Organization scope violation'
      });
    }
    
    // Auto-inject organization filter for queries
    if (!req.query.organizationId && !req.body.organizationId) {
      req.query.organizationId = organizationId;
    }
  }

  // For collectors and users, they can only access their own data
  if (role === 'collector' || role === 'user') {
    const targetUserId = req.params.userId || req.body.userId;
    
    if (targetUserId && req.user._id.toString() !== targetUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Can only access own data'
      });
    }
  }

  next();
};

/**
 * Dashboard-specific middleware
 * Controls access to different dashboard views
 */
const requireDashboardAccess = (dashboardType) => {
  const permissionMap = {
    'admin': 'dashboard:admin',
    'org_admin': 'dashboard:org_admin', 
    'collector': 'dashboard:collector',
    'user': 'dashboard:user'
  };

  return requirePermission(permissionMap[dashboardType]);
};

/**
 * Analytics access control
 */
const requireAnalyticsAccess = (scope = 'org') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { role } = req.user;
    let hasAccess = false;

    switch (scope) {
      case 'global':
        hasAccess = role === 'admin';
        break;
      case 'org':
        hasAccess = ['admin', 'org_admin'].includes(role);
        break;
      case 'personal':
        hasAccess = true; // All roles can view their own analytics
        break;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: `Analytics access denied for scope: ${scope}`
      });
    }

    next();
  };
};

module.exports = {
  hasPermission,
  hasRoleLevel,
  requirePermission,
  requireRole,
  enforceOrgScope,
  requireDashboardAccess,
  requireAnalyticsAccess,
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY
};
