/**
 * Admin middleware — restricts access to users with role: "admin"
 * Must be used AFTER authMiddleware (which sets req.user)
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.',
    });
  }
  next();
};

export default adminMiddleware;
