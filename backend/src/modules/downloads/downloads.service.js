import Download from "./download.model.js";
import User from "../auth/auth.model.js";

/**
 * Get a user's download history (paginated)
 * @param {string} userId
 * @param {number} page
 * @param {number} limit
 */
const getUserDownloads = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [downloads, total] = await Promise.all([
    Download.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Download.countDocuments({ userId }),
  ]);

  return {
    downloads,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Save a download record and decrement the user's remaining downloads
 * @param {object} data - { userId, title, thumbnail, sourceUrl, fileUrl, duration, bitrate }
 * @returns {Promise<object>} - The saved download document
 */
const saveDownload = async ({ userId, title, thumbnail, sourceUrl, fileUrl, duration, bitrate }) => {
  // Save the download record
  const download = new Download({
    userId,
    title,
    thumbnail: thumbnail || null,
    sourceUrl,
    fileUrl,
    duration: duration || null,
    bitrate: bitrate || "320",
  });

  await download.save();

  // Decrement remaining downloads and increment used
  await User.findByIdAndUpdate(userId, {
    $inc: { downloadsRemaining: -1, downloadsUsed: 1 },
  });

  return download;
};

/**
 * Check if a user can download (has remaining downloads)
 * @param {string} userId
 * @returns {Promise<{ canDownload: boolean, remaining: number, plan: string }>}
 */
const checkQuota = async (userId) => {
  const user = await User.findById(userId).select("downloadsRemaining plan subscriptionStatus subscriptionEnd");

  if (!user) {
    throw new Error("User not found");
  }

  // Pro monthly/yearly users have no hard limit (fair use: 300/month)
  const isUnlimited = user.plan === "pro_monthly" || user.plan === "pro_yearly";

  // Check if subscription has expired
  if (!isUnlimited && user.subscriptionEnd && user.subscriptionEnd < new Date()) {
    // Subscription expired — revert to free plan with 0 remaining
    await User.findByIdAndUpdate(userId, {
      plan: "free",
      downloadsRemaining: 0,
      subscriptionStatus: "expired",
    });
    return { canDownload: false, remaining: 0, plan: "free" };
  }

  return {
    canDownload: isUnlimited || user.downloadsRemaining > 0,
    remaining: isUnlimited ? Infinity : user.downloadsRemaining,
    plan: user.plan,
  };
};

export default {
  getUserDownloads,
  saveDownload,
  checkQuota,
};
