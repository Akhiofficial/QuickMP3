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

  let title = '';
  let author = 'Unknown Artist';
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  // 1. Fetch from oEmbed (highly reliable for basic details)
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    if (response.ok) {
      const data = await response.json();
      title = data.title || '';
      author = data.author_name || 'Unknown Artist';
    }
  } catch (err) {
    console.error('oEmbed metadata fetch failed:', err.message);
  }

  // 2. Fetch watch page HTML to extract duration & view count
  let duration = null;
  let viewCount = null;

  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(watchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (response.ok) {
      const html = await response.text();

      // Extract duration (lengthSeconds)
      const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
      if (lengthMatch) {
        const secs = parseInt(lengthMatch[1]);
        if (!isNaN(secs)) {
          const h = Math.floor(secs / 3600);
          const m = Math.floor((secs % 3600) / 60);
          const s = secs % 60;
          if (h > 0) {
            duration = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
          } else {
            duration = `${m}:${s.toString().padStart(2, '0')}`;
          }
        }
      }

      // Extract viewCount
      const viewMatch = html.match(/"viewCount":"(\d+)"/);
      if (viewMatch) {
        const rawViews = parseInt(viewMatch[1]);
        if (!isNaN(rawViews)) {
          viewCount = rawViews.toLocaleString('en-US');
        }
      }

      // Fallback for title if oEmbed failed
      if (!title) {
        const titleMatch = html.match(/"title":"([^"]+)"/);
        if (titleMatch) title = titleMatch[1];
      }
    }
  } catch (err) {
    console.warn('HTML scrape metadata failed (likely rate-limited):', err.message);
  }

  // If both failed to get title, throw
  if (!title) {
    throw new Error('Failed to fetch video metadata. Please check the URL and try again.');
  }

  return {
    title,
    thumbnail,
    duration,
    author,
    viewCount,
  };
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
