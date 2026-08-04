import ytDlpService from "../../services/yt-dlp.service.js";
import storageService from "../../services/storage.service.js";
import jobStore from "../../utils/jobStore.js";
import fs from "fs";
import crypto from "crypto";

class ConversionService {
  /**
   * Fetches metadata for a video and formats it for the frontend.
   * @param {string} url - YouTube video URL
   * @returns {Promise<object>} - Clean metadata: title, thumbnail, duration
   */
   async getMetadata(url) {
    try {
      const metadata = await ytDlpService.getVideoMetadata(url);

      // Extract and format fields
      const { title, thumbnail, duration, view_count, uploader, channel } = metadata;

      // Format duration from seconds to MM:SS
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      // Format view count (e.g., 1200000 -> 1.2M)
      let formattedViews = view_count;
      if (view_count >= 1000000) {
        formattedViews = (view_count / 1000000).toFixed(1) + "M Views";
      } else if (view_count >= 1000) {
        formattedViews = (view_count / 1000).toFixed(1) + "K Views";
      } else {
        formattedViews = (view_count || 0) + " Views";
      }

      return {
        title,
        thumbnail,
        duration: formattedDuration,
        viewCount: formattedViews,
        author: uploader || channel,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initiates a video conversion job in the background.
   * @param {string} url - YouTube video URL
   * @param {string} userId - Optional user ID for naming
   * @param {string} bitrate - Bitrate like "128", "256", "320"
   * @returns {string} - The generated jobId
   */
  initiateConversion(url, userId = "anonymous", bitrate = "320") {
    const jobId = crypto.randomUUID();

    // Create initial job in store
    jobStore.createJob(jobId, { status: "pending", progress: 0, userId });

    // Start background process (don't await)
    this._processConversion(jobId, url, userId, bitrate);

    return jobId;
  }

  /**
   * Internal method to process the conversion and update the job store.
   * @param {string} jobId 
   * @param {string} url 
   * @param {string} userId
   * @param {string} bitrate
   */
  async _processConversion(jobId, url, userId, bitrate) {
    try {
      jobStore.updateJob(jobId, { status: "processing", progress: 20 });

      // 1. Convert to MP3
      const quality = `${bitrate}K`;
      const { filePath, title, directLink } = await ytDlpService.convertToMp3(url, quality);
      
      jobStore.updateJob(jobId, { progress: 60 });

      let publicUrl = directLink;

      if (!publicUrl) {
        // Fallback: Generate unique filename for storage
        const fileName = `${userId}_${Date.now()}.mp3`;

        // Upload to Supabase Storage
        publicUrl = await storageService.uploadFile(filePath, fileName);

        jobStore.updateJob(jobId, { progress: 90 });

        // Delete local file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Update job as completed
      jobStore.updateJob(jobId, {
        status: "completed",
        progress: 100,
        url: publicUrl,
        title
      });
    } catch (error) {
      console.error(`Job ${jobId} failed:`, error);
      jobStore.updateJob(jobId, {
        status: "failed",
        error: error.message || "An unknown error occurred during conversion",
      });
    }
  }

  /**
   * Gets the current status of a job.
   * @param {string} jobId 
   * @returns {object} - The job status data
   */
  getJobStatus(jobId) {
    const job = jobStore.getJob(jobId);
    if (!job) return null;

    const { status, progress, error } = job;
    return { status, progress, error };
  }

  /**
   * Gets the completed job info for download.
   * @param {string} jobId 
   * @returns {object} - Job data including filePath
   */
  getCompletedJob(jobId) {
    const job = jobStore.getJob(jobId);
    if (!job || job.status !== "completed") return null;
    return job;
  }

  /**
   * Finalizes the job by removing it from the store.
   * @param {string} jobId 
   */
  finalizeJob(jobId) {
    jobStore.removeJob(jobId);
  }
}

export default new ConversionService();
