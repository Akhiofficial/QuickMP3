import { createClient } from "@supabase/supabase-js";
import { Agent, fetch as undiciFetch } from "undici";
import fs from "fs";
import config from "../core/config/index.js";

const { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY, bucket: SUPABASE_BUCKET } = config.supabase;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase credentials missing in environment variables.");
}

// ── DNS bypass ───────────────────────────────────────────────────────────────
// Some ISP/network configurations fail to resolve Supabase project subdomains
// via regular DNS, even when the project is fully active. We use undici's Agent
// to connect directly to the known Cloudflare IP while preserving the correct
// TLS SNI hostname so certificate validation still passes.
//
// On deployed servers (Railway, Render, Vercel, etc.) where DNS works normally,
// this is transparent — the host option just acts as an optional override and
// undici will still use the normal URL resolution.
// ─────────────────────────────────────────────────────────────────────────────

let supabaseHostname = "localhost";
try {
  supabaseHostname = new URL(SUPABASE_URL).hostname;
} catch { /* invalid URL — will fallback to standard fetch */ }

// Resolved via Cloudflare DoH (1.1.1.1) — stable Cloudflare edge IPs for Supabase
const SUPABASE_RESOLVED_IP = "104.18.38.10";

const supabaseAgent = new Agent({
  connect: {
    host: SUPABASE_RESOLVED_IP, // Connect to IP directly, bypassing DNS
    servername: supabaseHostname, // TLS SNI = real hostname (cert validation passes)
  },
});

/**
 * Custom fetch using undici with the DNS-bypass agent.
 * The Supabase JS client accepts a custom fetch via its `global.fetch` option.
 */
const customFetch = (url, options = {}) => {
  return undiciFetch(url, { ...options, dispatcher: supabaseAgent });
};

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { fetch: customFetch },
});

console.log(`[Storage] Supabase client initialized → ${supabaseHostname} (via ${SUPABASE_RESOLVED_IP})`);

/**
 * Uploads a file to Supabase Storage and returns its public URL.
 * @param {string} filePath - Local path of the file to upload
 * @param {string} fileName - Destination name in the bucket
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export const uploadFile = async (filePath, fileName) => {
  try {
    // 1. Ensure file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // 2. Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);

    // 3. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: "audio/mpeg",
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    // 4. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Storage Service Error:", error.message);
    throw error;
  }
};

export default {
  uploadFile,
};
