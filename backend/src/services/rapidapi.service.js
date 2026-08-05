import config from '../core/config/index.js';

const RAPIDAPI_KEY = config.rapidapi.key;
const RAPIDAPI_HOST = config.rapidapi.host;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Handles: youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID
 * Extracts the YouTube video ID from any common URL format.
 * @param {string} url
 * @returns {string|null} videoId
 */
const extractVideoId = (url) => {
  try {
    const parsed = new URL(url);
    // youtu.be short links
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0];
    }
    // youtube.com/watch?v=
    if (parsed.searchParams.get('v')) {
      return parsed.searchParams.get('v');
    }
    // /shorts/ or /embed/ or /v/
    const match = parsed.pathname.match(/\/(?:shorts|embed|v)\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  } catch {
    // Not a valid URL, try raw regex
    const raw = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (raw) return raw[1];
  }
  return null;
};

/**
 * Sleep helper for polling
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────────────────────────────────────
// Metadata — uses YouTube's free oEmbed API (no key, never banned)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches video metadata from YouTube's oEmbed endpoint.
 * Falls back to a RapidAPI thumbnail pattern for the thumbnail URL.
 * @param {string} url - Full YouTube URL
 * @returns {Promise<{title, thumbnail, duration, author, viewCount}>}
 */
export const getVideoMetadata = async (url) => {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL. Could not extract video ID.');
  }

  try {
    // YouTube oEmbed: free, no API key, returns title + author_name + thumbnail_url
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error('Video not found or is private/unavailable.');
    }

    const data = await response.json();

    return {
      title: data.title,
      // oEmbed gives a low-res thumbnail; use maxresdefault for HD
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: null,       // oEmbed doesn't return duration (shown as null, UI handles it)
      author: data.author_name,
      viewCount: null,      // oEmbed doesn't return views
    };
  } catch (error) {
    console.error('Metadata fetch error:', error.message);
    throw new Error('Failed to fetch video metadata. Please check the URL and try again.');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MP3 Conversion — RapidAPI youtube-mp36
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a YouTube video to MP3 via RapidAPI's youtube-mp36 service.
 * Polls until the link is ready (status === "ok"), with retries and backoff.
 *
 * @param {string} url - Full YouTube URL
 * @returns {Promise<{mp3Url: string, title: string}>}
 */
export const convertToMp3 = async (url) => {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL. Could not extract video ID.');
  }

  if (!RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY is not configured. Add it to your .env file.');
  }

  const endpoint = `https://${RAPIDAPI_HOST}/dl?id=${videoId}`;
  const headers = {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
    'Content-Type': 'application/json',
  };

  const MAX_ATTEMPTS = 5;
  const POLL_DELAY_MS = 4000; // 4 seconds between polls

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(endpoint, { method: 'GET', headers });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`RapidAPI error ${response.status}: ${body}`);
      }

      const data = await response.json();

      // API returns { status: "ok", link: "...", title: "...", duration: "..." }
      // or { status: "processing" } while still working
      if (data.status === 'ok' && data.link) {
        return {
          mp3Url: data.link,
          title: data.title || 'audio',
        };
      }

      if (data.status === 'processing' || data.status === 'pending') {
        console.log(`[RapidAPI] Attempt ${attempt}/${MAX_ATTEMPTS}: still processing...`);
        if (attempt < MAX_ATTEMPTS) {
          await sleep(POLL_DELAY_MS);
          continue;
        }
        throw new Error('Conversion is taking too long. Please try again in a moment.');
      }

      // Unknown status or error
      const errMsg = data.msg || data.message || JSON.stringify(data);
      throw new Error(`RapidAPI returned unexpected status: ${errMsg}`);

    } catch (error) {
      // If this is the last attempt, propagate the error
      if (attempt === MAX_ATTEMPTS) {
        console.error('[RapidAPI] All attempts exhausted:', error.message);
        throw new Error('MP3 conversion failed. Please try again later.');
      }
      // Otherwise, wait and retry
      console.warn(`[RapidAPI] Attempt ${attempt} failed: ${error.message}. Retrying...`);
      await sleep(POLL_DELAY_MS);
    }
  }
};

export default {
  getVideoMetadata,
  convertToMp3,
  extractVideoId,
};
