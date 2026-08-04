import express from 'express';
import paymentController from './payment.controller.js';
import authMiddleware from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route  GET /api/payments/plans
 * @desc   Get all available plans and pricing (public)
 * @access Public
 */
router.get('/plans', paymentController.getPlans);

/**
 * @route  POST /api/payments/create-order
 * @desc   Create a Razorpay order for a chosen plan
 * @access Private
 */
router.post('/create-order', authMiddleware, paymentController.createOrder);

/**
 * @route  POST /api/payments/verify
 * @desc   Verify Razorpay signature and activate user plan
 * @access Private
 */
router.post('/verify', authMiddleware, paymentController.verifyPayment);

/**
 * @route  GET /api/payments/transactions
 * @desc   Get current user's billing/transaction history
 * @access Private
 */
router.get('/transactions', authMiddleware, paymentController.getTransactions);

export default router;
