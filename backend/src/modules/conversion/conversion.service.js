import rapidapiService from '../../services/rapidapi.service.js';
import jobStore from '../../utils/jobStore.js';
import crypto from 'crypto';

class ConversionService {
  /**
   * Fetches metadata for a video and formats it for the frontend.
   * Uses YouTube oEmbed (free, no key, no ban risk).
   * @param {string} url - YouTube video URL
   * @returns {Promise<object>} - Clean metadata: title, thumbnail, duration, author
   */
  async getMetadata(url) {
    try {
      const metadata = await rapidapiService.getVideoMetadata(url);

      return {
        title: metadata.title,
        thumbnail: metadata.thumbnail,
        duration: metadata.duration || '--:--',
        viewCount: metadata.viewCount || null,
        author: metadata.author || 'Unknown Artist',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initiates a video conversion job in the background.
   * The actual conversion is done by RapidAPI — no local files, no ffmpeg.
   * @param {string} url - YouTube video URL
   * @param {string} userId - User ID for job tracking
   * @param {string} bitrate - "128", "256", or "320" (informational only — RapidAPI returns its own quality)
   * @returns {string} - The generated jobId
   */
  initiateConversion(url, userId = 'anonymous', bitrate = '320') {
    const jobId = crypto.randomUUID();

    // Create initial job in store
    jobStore.createJob(jobId, { status: 'pending', progress: 0, userId });

    // Start background process (don't await)
    this._processConversion(jobId, url, userId, bitrate);

    return jobId;
  }

  /**
   * Internal method: calls RapidAPI, updates job store with progress.
   * No local file I/O — the mp3Url returned is a direct CDN link.
   * @param {string} jobId
   * @param {string} url
   * @param {string} userId
   * @param {string} bitrate
   */
  async _processConversion(jobId, url, userId, bitrate) {
    try {
      jobStore.updateJob(jobId, { status: 'processing', progress: 15 });

      // Step 1: Call RapidAPI to convert — this polls internally until ready
      // Progress jumps from 15 → 85 to show work happening
      jobStore.updateJob(jobId, { progress: 35 });

      const { mp3Url, title } = await rapidapiService.convertToMp3(url);

      jobStore.updateJob(jobId, { progress: 90 });

      // Step 2: Return the direct CDN mp3 URL — no upload needed
      jobStore.updateJob(jobId, {
        status: 'completed',
        progress: 100,
        url: mp3Url,
        title,
      });

      console.log(`[Job ${jobId}] Completed: ${title}`);
    } catch (error) {
      console.error(`[Job ${jobId}] Failed:`, error.message);
      jobStore.updateJob(jobId, {
        status: 'failed',
        error: error.message || 'An unknown error occurred during conversion',
      });
    }
  }

  /**
   * Gets the current status of a job.
   * @param {string} jobId
   * @returns {object} - { status, progress, error }
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
   * @returns {object|null} - Full job data including url and title
   */
  getCompletedJob(jobId) {
    const job = jobStore.getJob(jobId);
    if (!job || job.status !== 'completed') return null;
    return job;
  }

  /**
   * Finalizes the job by removing it from the in-memory store.
   * @param {string} jobId
   */
  finalizeJob(jobId) {
    jobStore.removeJob(jobId);
  }
}

export default new ConversionService();
