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
      const rawCookies = config.youtubeCookies;

      if (rawCookies && rawCookies.trim()) {
        // Validate it looks like a Netscape cookie file
        const trimmed = rawCookies.trim();
        console.log(`[yt-dlp] YOUTUBE_COOKIES env var found (${trimmed.length} chars). First line: "${trimmed.split('\n')[0]}"`);

        fs.writeFileSync(this.cookiesPath, trimmed, "utf8");
        console.log(`[yt-dlp] Cookies written to: ${this.cookiesPath}`);
        return this.cookiesPath;
      }

      console.warn("[yt-dlp] ⚠️  YOUTUBE_COOKIES env var is NOT set or empty — bot detection likely on server IPs.");

      const explicitCookiesPath = process.env.YOUTUBE_COOKIES_FILE?.trim();
      const candidatePaths = [
        explicitCookiesPath,
        path.join(process.cwd(), "youtube-cookies.txt"),
        path.join(process.cwd(), "cookies.txt"),
        path.join(process.cwd(), "backend", "youtube-cookies.txt"),
        path.join(process.cwd(), "backend", "cookies.txt"),
      ].filter(Boolean);

      for (const candidatePath of candidatePaths) {
        if (candidatePath && fs.existsSync(candidatePath)) {
          console.log(`[yt-dlp] Cookies loaded from file: ${candidatePath}`);
          return candidatePath;
        }
      }

      console.warn("[yt-dlp] No cookies found from any source.");
      return null;
    } catch (error) {
      console.error("[yt-dlp] Error preparing cookies:", error);
      return null;
    }
  }


  /**
   * Build base command with bypass flags.
   * Uses PO token (Proof of Origin) when available — required for server IPs in 2025.
   * Falls back to tv_embedded client without PO token.
   */
  async _getBaseCommand() {
    const cookiesFile = await this._prepareCookies();
    const poToken = config.youtubePOToken?.trim();
    const visitorData = config.youtubeVisitorData?.trim();

    let extractorArgs;
    let useCookies = false;

    if (poToken && visitorData) {
      // Full auth: web client + PO token + visitor data
      extractorArgs = `youtube:player_client=web,tv_embedded;po_token=web+${poToken};visitor_data=${visitorData}`;
      useCookies = true;
      console.log("[yt-dlp] Using web client with PO token + visitor data.");
    } else if (poToken) {
      // Partial auth: web client + PO token
      extractorArgs = `youtube:player_client=web,tv_embedded;po_token=web+${poToken}`;
      useCookies = true;
      console.log("[yt-dlp] Using web client with PO token (no visitor_data).");
    } else if (visitorData) {
      // 🎉 MAGIC BULLET: No PO Token, but we have Visitor Data!
      // The `android` client doesn't need a PO Token, but it DOES need Visitor Data to bypass IP bans.
      // We must NOT use cookies here, because Web Cookies + Android Client = Instant Ban.
      extractorArgs = `youtube:player_client=android,ios;visitor_data=${visitorData}`;
      useCookies = false;
      console.log("[yt-dlp] ⚠️  No PO Token, but found VISITOR_DATA. Using android client bypass (ignoring cookies).");
    } else if (cookiesFile && fs.existsSync(cookiesFile)) {
      // Has Cookies but NO PO Token and NO Visitor Data -> Use web client and hope cookies are enough!
      extractorArgs = `youtube:player_client=web,tv_embedded`;
      useCookies = true;
      console.log("[yt-dlp] ⚠️  No PO token/Visitor Data, but Cookies found. Using web client with cookies as a bypass.");
    } else {
      // No PO token AND No Cookies AND No Visitor Data
      extractorArgs = `youtube:player_client=ios,android,tv_embedded`;
      console.warn("[yt-dlp] ⚠️  No auth data found. Using ios/android fallback clients.");
    }

    let cmd = `yt-dlp --no-check-certificate --no-warnings --ignore-config `
      + `--extractor-args "${extractorArgs}" `
      + `--user-agent "${this.userAgent}" `
      + `--add-headers "Accept-Language:en-US,en;q=0.9"`;

    if (useCookies && cookiesFile && fs.existsSync(cookiesFile)) {
      cmd += ` --cookies "${cookiesFile}"`;
      console.log("[yt-dlp] Attached Web Cookies to request.");
    } else {
      console.warn("[yt-dlp] No cookies used for this request.");
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
        `${baseCmd} -f "bestaudio/best" -x --audio-format mp3 --audio-quality ${quality} --print title --print after_move:filepath -o "downloads/%(id)s.%(ext)s" "${url}"`
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
      } else if (actualErrorLog.includes("Requested format is not available") || actualErrorLog.includes("not available")) {
        message = "This video currently does not expose a compatible audio format. Please try another video or try again later.";
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
