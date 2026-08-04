import paymentService from './payment.service.js';

/**
 * POST /api/payments/create-order
 * Creates a Razorpay order for the chosen plan
 */
const createOrder = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    if (!plan) {
      return res.status(400).json({ success: false, message: 'Plan is required' });
    }

    const orderData = await paymentService.createOrder(userId, plan);

    res.status(200).json({ success: true, ...orderData });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/verify
 * Verifies Razorpay signature and activates the user's plan
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing Razorpay payment fields',
      });
    }

    const result = await paymentService.verifyPayment(userId, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified! Your plan has been activated.',
      user: result.user,
      invoiceNumber: result.transaction.invoiceNumber,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payments/transactions
 * Get the current user's transaction history
 */
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await paymentService.getUserTransactions(req.user.id);
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payments/plans
 * Get available plan details (public)
 */
const getPlans = async (req, res) => {
  res.status(200).json({
    success: true,
    plans: paymentService.PLANS,
  });
};

export default {
  createOrder,
  verifyPayment,
  getTransactions,
  getPlans,
};
