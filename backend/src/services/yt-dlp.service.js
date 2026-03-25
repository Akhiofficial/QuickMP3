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
        console.log("YouTube cookies loaded from YOUTUBE_COOKIES environment variable.");
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
    // --js-runtimes: explicitly use node for EJS signature solving
    // --remote-components: allow fetching latest EJS scripts if needed
    // --extractor-args: helps bypass bot detection by mimicking different clients
    let cmd = `yt-dlp --no-check-certificate --no-warnings --ignore-config --js-runtimes node --remote-components ejs:github --extractor-args "youtube:player_client=ios,android,web" --user-agent "${this.userAgent}"`;
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
      const stderr = error.stderr || "";
      console.error("yt-dlp metadata error:", stderr || error.message);

      let message = "Failed to fetch video metadata. Please ensure the URL is valid.";

      // Filter out warnings to find the real error
      const actualErrorLog = stderr.split('\n').find(line => line.startsWith('ERROR:') || !line.startsWith('WARNING:')) || stderr;

      if (actualErrorLog.includes("Video unavailable")) {
        message = "This video is unavailable or has been removed.";
      } else if (actualErrorLog.includes("Sign in to confirm you are not a bot")) {
        message = "YouTube is blocking the request. Please update your YOUTUBE_COOKIES.";
      } else if (actualErrorLog.includes("Too Many Requests") || actualErrorLog.includes("429")) {
        message = "YouTube rate limit exceeded. Please try again later.";
      } else if (actualErrorLog.includes("Signature solving failed")) {
        message = "YouTube signature error. This often happens on servers; updated cookies might be required.";
      } else if (actualErrorLog) {
        message = `YouTube Error: ${actualErrorLog.split('\n')[0].replace('ERROR: ', '')}`;
      }

      throw new Error(message);
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
        `${baseCmd} -f "ba/b" -x --audio-format mp3 --audio-quality ${quality} --print title --print after_move:filepath -o "downloads/%(id)s.%(ext)s" "${url}"`
      );

      const lines = stdout.trim().split('\n');
      const title = lines[0].trim();
      const filePath = lines[lines.length - 1].trim();

      return { filePath, title };
    } catch (error) {
      const stderr = error.stderr || "";
      console.error("yt-dlp conversion error:", stderr || error.message);

      let message = "Failed to convert video. Please ensure the URL is valid.";

      // Filter out warnings to find the real error
      const actualErrorLog = stderr.split('\n').find(line => line.startsWith('ERROR:') || !line.startsWith('WARNING:')) || stderr;

      if (actualErrorLog.includes("Video unavailable")) {
        message = "This video is unavailable or has been removed.";
      } else if (actualErrorLog.includes("Sign in to confirm you are not a bot")) {
        message = "YouTube is blocking the request. Please update your YOUTUBE_COOKIES.";
      } else if (actualErrorLog.includes("Signature solving failed")) {
        message = "YouTube signature error. This often happens on servers; updated cookies might be required.";
      } else if (actualErrorLog) {
        message = `YouTube Error: ${actualErrorLog.split('\n')[0].replace('ERROR: ', '')}`;
      }

      throw new Error(message);
    }
  }
}

export default new YtDlpService();
