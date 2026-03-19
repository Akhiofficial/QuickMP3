import conversionService from "./conversion.service.js";
import fs from "fs";

/**
 * Handle video metadata fetching.
 */
const getMetadata = async (req, res, next) => {
  try {
    const { url } = req.body;

    // Validate if URL exists in request
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "YouTube URL is required",
      });
    }

    // Call service to get formatted metadata
    const data = await conversionService.getMetadata(url);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    // Controller will send status 500 if error thrown from service
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while fetching metadata",
    });
  }
};

/**
 * Handle video conversion initiation.
 * POST /api/conversion/convert
 */
const convertVideo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "YouTube URL is required",
      });
    }

    // Initiate job-based conversion
    // req.user?.id from authMiddleware if present, else 'anonymous'
    const jobId = conversionService.initiateConversion(url, req.user?.id || "anonymous");

    res.status(202).json({
      success: true,
      jobId,
      message: "Conversion started. Please use the status endpoint to track progress.",
    });
  } catch (error) {
    console.error("Initiation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to start conversion",
    });
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
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      ...jobStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching job status",
    });
  }
};

/**
 * Get the public URL for the converted file.
 * Replace res.download() with JSON response containing the public URL.
 * GET /api/conversion/download/:jobId
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

    const { url, title } = job;

    // The file is already on Supabase and local file is already deleted in service
    // We just return the URL to the frontend

    // Finalize job (remove from in-memory store)
    conversionService.finalizeJob(jobId);

    // Return JSON with the public URL
    res.status(200).json({
      success: true,
      url,
      title: title || "music.mp3",
    });
  } catch (error) {
    console.error("Download endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving file URL",
    });
  }
};

export default {
  getMetadata,
  convertVideo,
  getStatus,
  downloadFile,
};
