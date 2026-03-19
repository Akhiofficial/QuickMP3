import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import config from "../core/config/index.js";

const { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY, bucket: SUPABASE_BUCKET } = config.supabase;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase credentials missing in environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    console.error("Storage Service Error:", error);
    throw error;
  }
};

export default {
  uploadFile,
};
