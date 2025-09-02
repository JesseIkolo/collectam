const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const { requireDashboardAccess, enforceOrgScope, requireAnalyticsAccess } = require('../middlewares/rbac');
const { getDashboardData } = require('../controllers/DashboardController');

/**
 * Dashboard Routes - Role-based access control
 * Based on PROMPT_DASHBOARD_COLLECTAM_RBAC.md
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard data based on user role
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 role:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
router.get('/', 
  authenticateToken,
  enforceOrgScope,
  getDashboardData
);

/**
 * @swagger
 * /api/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard (global overview)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data
 *       403:
 *         description: Insufficient permissions
 */
router.get('/admin',
  authenticateToken,
  requireDashboardAccess('admin'),
  getDashboardData
);

/**
 * @swagger
 * /api/dashboard/org-admin:
 *   get:
 *     summary: Get organization admin dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organization admin dashboard data
 */
router.get('/org-admin',
  authenticateToken,
  requireDashboardAccess('org_admin'),
  enforceOrgScope,
  getDashboardData
);

/**
 * @swagger
 * /api/dashboard/collector:
 *   get:
 *     summary: Get collector dashboard (missions and performance)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Collector dashboard data
 */
router.get('/collector',
  authenticateToken,
  requireDashboardAccess('collector'),
  getDashboardData
);

/**
 * @swagger
 * /api/dashboard/user:
 *   get:
 *     summary: Get user dashboard (personal waste management)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User dashboard data
 */
router.get('/user',
  authenticateToken,
  requireDashboardAccess('user'),
  getDashboardData
);

/**
 * Analytics endpoints with role-based access
 */

/**
 * @swagger
 * /api/dashboard/analytics/global:
 *   get:
 *     summary: Get global analytics (admin only)
 *     tags: [Dashboard, Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/analytics/global',
  authenticateToken,
  requireAnalyticsAccess('global'),
  async (req, res) => {
    // Global analytics implementation
    res.json({ success: true, message: 'Global analytics endpoint' });
  }
);

/**
 * @swagger
 * /api/dashboard/analytics/org:
 *   get:
 *     summary: Get organization analytics
 *     tags: [Dashboard, Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/analytics/org',
  authenticateToken,
  requireAnalyticsAccess('org'),
  enforceOrgScope,
  async (req, res) => {
    // Organization analytics implementation
    res.json({ success: true, message: 'Organization analytics endpoint' });
  }
);

/**
 * @swagger
 * /api/dashboard/analytics/personal:
 *   get:
 *     summary: Get personal analytics
 *     tags: [Dashboard, Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/analytics/personal',
  authenticateToken,
  requireAnalyticsAccess('personal'),
  async (req, res) => {
    // Personal analytics implementation
    res.json({ success: true, message: 'Personal analytics endpoint' });
  }
);

module.exports = router;
