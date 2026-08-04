import User from '../auth/auth.model.js';
import Download from '../downloads/download.model.js';
import Transaction from '../payments/transaction.model.js';

/**
 * GET /api/admin/stats
 * High-level platform stats
 */
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      premiumUsers,
      totalDownloads,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ plan: { $ne: 'free' } }),
      Download.countDocuments(),
      Transaction.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const totalRevenuePaise = revenueResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        premiumUsers,
        freeUsers: totalUsers - premiumUsers,
        totalDownloads,
        totalRevenue: totalRevenuePaise / 100, // in INR
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 * Paginated user list with plan info
 */
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select('-password -refreshToken -resetPasswordToken -resetPasswordExpiry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/transactions
 * Recent transactions across all users
 */
const getTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find({ status: 'paid' })
        .populate('userId', 'name email plan')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments({ status: 'paid' }),
    ]);

    res.status(200).json({
      success: true,
      transactions,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/downloads
 * Recent downloads across all users
 */
const getDownloads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [downloads, total] = await Promise.all([
      Download.find()
        .populate('userId', 'name email plan')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Download.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      downloads,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getStats,
  getUsers,
  getTransactions,
  getDownloads,
};
