import conversionService from "./conversion.service.js";
import downloadsService from "../downloads/downloads.service.js";

/**
 * Handle video metadata fetching.
 * POST /api/conversion/metadata
 */
const getMetadata = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: "YouTube URL is required" });
    }

    const data = await conversionService.getMetadata(url);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while fetching metadata",
    });
  }
};

/**
 * Initiate video conversion.
 * POST /api/conversion/convert
 * Requires auth — enforces download quota.
 */
const convertVideo = async (req, res) => {
  try {
    const { url, bitrate = "320" } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: "YouTube URL is required" });
    }

    // ── Quota check (only for authenticated users) ───────────────────────────
    const userId = req.user?.id;

    if (userId) {
      const quota = await downloadsService.checkQuota(userId);
      if (!quota.canDownload) {
        return res.status(403).json({
          success: false,
          message: "You've used all your downloads. Please upgrade your plan.",
          code: "QUOTA_EXCEEDED",
          plan: quota.plan,
        });
      }
    }

    const jobId = conversionService.initiateConversion(url, userId || "anonymous", bitrate);

    res.status(202).json({
      success: true,
      jobId,
      message: "Conversion started. Poll /status/:jobId to track progress.",
    });
  } catch (error) {
    console.error("Initiation error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to start conversion" });
  }
};

/**
 * Check the status of a conversion job.
 * GET /api/conversion/status/:jobId
 */
const getStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobStatus = conversionService.getJobStatus(jobId);

    if (!jobStatus) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, ...jobStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching job status" });
  }
};

/**
 * Get the public URL for the converted file.
 * GET /api/conversion/download/:jobId
 * Also saves the download to history and decrements quota.
 */
const downloadFile = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = conversionService.getCompletedJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "File not ready or job not found. Please check status first.",
      });
    }

    const { url, title, userId } = job;

    // ── Save to download history (only for authenticated users) ─────────────
    if (userId && userId !== "anonymous") {
      try {
        // We pass the metadata stored in the job (set during conversion)
        await downloadsService.saveDownload({
          userId,
          title: title || "Unknown Track",
          thumbnail: job.thumbnail || null,
          sourceUrl: job.sourceUrl || "",
          fileUrl: url,
          duration: job.duration || null,
          bitrate: job.bitrate || "320",
        });
      } catch (saveError) {
        // Don't fail the download if history save fails — just log it
        console.error("Failed to save download history:", saveError.message);
      }
    }

    // Finalize job (remove from in-memory store)
    conversionService.finalizeJob(jobId);

    res.status(200).json({
      success: true,
      url,
      title: title || "music.mp3",
    });
  } catch (error) {
    console.error("Download endpoint error:", error);
    res.status(500).json({ success: false, message: "Error retrieving file URL" });
  }
};

export default {
  getMetadata,
  convertVideo,
  getStatus,
  downloadFile,
};
