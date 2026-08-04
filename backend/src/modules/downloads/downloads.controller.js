import downloadsService from "./downloads.service.js";

/**
 * GET /api/downloads
 * Get current user's download history (paginated)
 */
const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await downloadsService.getUserDownloads(userId, page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/downloads/quota
 * Check if the current user can download
 */
const checkQuota = async (req, res, next) => {
  try {
    const quota = await downloadsService.checkQuota(req.user.id);
    res.status(200).json({ success: true, ...quota });
  } catch (error) {
    next(error);
  }
};

export default {
  getHistory,
  checkQuota,
};
