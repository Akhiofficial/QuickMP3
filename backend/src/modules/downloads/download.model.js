import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    sourceUrl: {
      type: String,  // Original YouTube URL
      required: true,
    },
    fileUrl: {
      type: String,  // RapidAPI CDN URL or Supabase URL
      required: true,
    },
    duration: {
      type: String,
      default: null,
    },
    bitrate: {
      type: String,
      default: "320",
    },
  },
  {
    timestamps: true,
  }
);

const Download = mongoose.model("Download", downloadSchema);

export default Download;
