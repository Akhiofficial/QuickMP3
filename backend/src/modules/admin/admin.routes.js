import express from 'express';
import adminController from './admin.controller.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';
import adminMiddleware from '../../core/middlewares/admin.middleware.js';

const router = express.Router();

// Apply auth and admin middleware to all routes in this module
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @route  GET /api/admin/stats
 * @desc   Get platform statistics
 * @access Private (Admin only)
 */
router.get('/stats', adminController.getStats);

/**
 * @route  GET /api/admin/users
 * @desc   Get all users paginated
 * @access Private (Admin only)
 */
router.get('/users', adminController.getUsers);

/**
 * @route  GET /api/admin/transactions
 * @desc   Get all transactions paginated
 * @access Private (Admin only)
 */
router.get('/transactions', adminController.getTransactions);

/**
 * @route  GET /api/admin/downloads
 * @desc   Get all downloads paginated
 * @access Private (Admin only)
 */
router.get('/downloads', adminController.getDownloads);

export default router;
