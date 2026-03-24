import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

class YtDlpService {
  /**
   * Fetches the video metadata using yt-dlp.
   * Runs: yt-dlp --dump-json --no-playlist <url>
   * @param {string} url - YouTube video URL
   * @returns {Promise<object>} - Parsed JSON object from yt-dlp
   */
  async getVideoMetadata(url) {
    try {
      // --dump-json prints the JSON of all the information yt-dlp collected
      // --no-playlist ensures single video metadata even if URL is a playlist
      const { stdout } = await execPromise(`yt-dlp --dump-json --no-playlist "${url}"`);
      return JSON.parse(stdout);
    } catch (error) {
      console.error("yt-dlp error:", error);
      throw new Error("Failed to fetch video metadata. Please ensure the URL is valid.");
    }
  }

  /**
   * Converts a YouTube video to MP3 using yt-dlp.
   * @param {string} url - YouTube video URL
   * @returns {Promise<{filePath: string, title: string}>} - The path and title
   */
  async convertToMp3(url, quality = "192K") {
    try {
      // --print title: get original title
      // --print after_move:filepath: get final path
      // -o "downloads/%(id)s.%(ext)s": use ID for absolute name stability
      const { stdout } = await execPromise(
        `yt-dlp -x --audio-format mp3 --audio-quality ${quality} --print title --print after_move:filepath -o "downloads/%(id)s.%(ext)s" "${url}"`
      );
      
      const lines = stdout.trim().split('\n');
      const title = lines[0].trim();
      const filePath = lines[lines.length - 1].trim();

      return { filePath, title };
    } catch (error) {
      console.error("yt-dlp conversion error:", error);
      throw new Error("Failed to convert video. Please ensure the URL is valid.");
    }
  }
}

export default new YtDlpService();
