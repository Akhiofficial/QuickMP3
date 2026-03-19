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

      // Extract specific fields
      const { title, thumbnail, duration } = metadata;

      return {
        title,
        thumbnail,
        duration, // Note: duration is in seconds
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initiates a video conversion job in the background.
   * @param {string} url - YouTube video URL
   * @param {string} userId - Optional user ID for naming
   * @returns {string} - The generated jobId
   */
  initiateConversion(url, userId = "anonymous") {
    const jobId = crypto.randomUUID();

    // Create initial job in store
    jobStore.createJob(jobId, { status: "pending", progress: 0, userId });

    // Start background process (don't await)
    this._processConversion(jobId, url, userId);

    return jobId;
  }

  /**
   * Internal method to process the conversion and update the job store.
   * @param {string} jobId 
   * @param {string} url 
   * @param {string} userId
   */
  async _processConversion(jobId, url, userId) {
    try {
      jobStore.updateJob(jobId, { status: "processing", progress: 20 });

      // 1. Convert to MP3
      const { filePath, title } = await ytDlpService.convertToMp3(url);
      
      jobStore.updateJob(jobId, { progress: 60 });

      // 2. Generate unique filename for storage
      // Format: userId_timestamp.mp3
      const fileName = `${userId}_${Date.now()}.mp3`;

      // 3. Upload to Supabase Storage
      const publicUrl = await storageService.uploadFile(filePath, fileName);

      jobStore.updateJob(jobId, { progress: 90 });

      // 4. Delete local file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Update job as completed
      jobStore.updateJob(jobId, {
        status: "completed",
        progress: 100,
        url: publicUrl,
        title,
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

    // Return only relevant info
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
