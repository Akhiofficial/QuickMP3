import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";
import config from "../core/config/index.js";

const execPromise = util.promisify(exec);

class YtDlpService {
  constructor() {
    this.cookiesPath = path.join(process.cwd(), "youtube-cookies.txt");
    this.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  }

  /**
   * Internal method to ensure cookies file exists if provided in config.
   */
  async _prepareCookies() {
    try {
      if (config.youtubeCookies) {
        // Only write if it doesn't exist or content is different (optional optimization)
        fs.writeFileSync(this.cookiesPath, config.youtubeCookies, "utf8");
        return this.cookiesPath;
      }
      return null;
    } catch (error) {
      console.error("Error preparing cookies:", error);
      return null;
    }
  }

  /**
   * Build base command with bypass flags.
   */
  async _getBaseCommand() {
    const cookiesFile = await this._prepareCookies();
    let cmd = `yt-dlp --no-check-certificate --user-agent "${this.userAgent}"`;
    if (cookiesFile && fs.existsSync(cookiesFile)) {
      cmd += ` --cookies "${cookiesFile}"`;
    }
    return cmd;
  }

  /**
   * Fetches the video metadata using yt-dlp.
   * Runs: yt-dlp --dump-json --no-playlist <url>
   * @param {string} url - YouTube video URL
   * @returns {Promise<object>} - Parsed JSON object from yt-dlp
   */
  async getVideoMetadata(url) {
    try {
      const baseCmd = await this._getBaseCommand();
      const { stdout } = await execPromise(`${baseCmd} --dump-json --no-playlist "${url}"`);
      return JSON.parse(stdout);
    } catch (error) {
      console.error("yt-dlp metadata error:", error);
      throw new Error("Failed to fetch video metadata. YouTube might be blocking the server or the URL is invalid. Please try again later.");
    }
  }

  /**
   * Converts a YouTube video to MP3 using yt-dlp.
   * @param {string} url - YouTube video URL
   * @returns {Promise<{filePath: string, title: string}>} - The path and title
   */
  async convertToMp3(url, quality = "192K") {
    try {
      const baseCmd = await this._getBaseCommand();
      const { stdout } = await execPromise(
        `${baseCmd} -x --audio-format mp3 --audio-quality ${quality} --print title --print after_move:filepath -o "downloads/%(id)s.%(ext)s" "${url}"`
      );
      
      const lines = stdout.trim().split('\n');
      const title = lines[0].trim();
      const filePath = lines[lines.length - 1].trim();

      return { filePath, title };
    } catch (error) {
      console.error("yt-dlp conversion error:", error);
      throw new Error("Failed to convert video. YouTube might be blocking the server. Please try again later.");
    }
  }
}

export default new YtDlpService();
