import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

// We keep this class name to avoid breaking imports in other files
class YtDlpService {
  constructor() {
    this.rapidApiKey = process.env.RAPIDAPI_KEY || "8729facb00mshbbbc6ca3dc9d8adp17bca5jsn29d5e3187f6a";
    this.rapidApiHost = process.env.RAPIDAPI_HOST || "youtube-mp36.p.rapidapi.com";
  }

  /**
   * Fetches the video metadata using youtubei.js (Bypasses Datacenter IP bans for metadata)
   * @param {string} url - YouTube video URL
   * @returns {Promise<object>} - Parsed JSON object mimicking yt-dlp format
   */
  async getVideoMetadata(url) {
    try {
      // Lazy load youtubei.js
      const { Innertube } = await import('youtubei.js');
      const yt = await Innertube.create();
      
      // Extract Video ID from URL (handle URI encoded strings)
      const decodedUrl = decodeURIComponent(url);
      const videoIdMatch = decodedUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      if (!videoIdMatch) throw new Error("Invalid YouTube URL");
      const videoId = videoIdMatch[1];

      const info = await yt.getBasicInfo(videoId);
      
      return {
        title: info.basic_info.title,
        thumbnail: info.basic_info.thumbnail?.[0]?.url,
        duration: info.basic_info.duration,
        view_count: info.basic_info.view_count,
        uploader: info.basic_info.channel?.name || info.basic_info.author
      };
    } catch (error) {
      console.error("youtubei metadata error:", error);
      throw new Error("Failed to fetch video metadata. Please ensure the URL is valid.");
    }
  }

  /**
   * Converts a YouTube video to MP3 using RapidAPI.
   * @param {string} url - YouTube video URL
   * @returns {Promise<{filePath: string, title: string}>} - The path and title
   */
  async convertToMp3(url, quality = "320") {
    try {
      const decodedUrl = decodeURIComponent(url);
      const videoIdMatch = decodedUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      if (!videoIdMatch) throw new Error("Invalid YouTube URL");
      const videoId = videoIdMatch[1];

      console.log(`[RapidAPI] Fetching download link for ${videoId}...`);

      const response = await fetch(`https://${this.rapidApiHost}/dl?id=${videoId}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": this.rapidApiHost,
          "x-rapidapi-key": this.rapidApiKey
        }
      });

      const data = await response.json();
      
      if (data.status !== "ok" || !data.link) {
         if (data.status === "processing") {
             throw new Error("Video is processing on the API server. Please try again in a few seconds.");
         }
         throw new Error(data.msg || "API returned an invalid response.");
      }

      console.log(`[RapidAPI] Link acquired! Bypassing backend download and sending direct link to frontend...`);
      return { filePath: "", title: data.title || videoId, directLink: data.link };
    } catch (error) {
      console.error("RapidAPI conversion error:", error);
      throw new Error(`YouTube Error: ${error.message}`);
    }
  }
}

export default new YtDlpService();
