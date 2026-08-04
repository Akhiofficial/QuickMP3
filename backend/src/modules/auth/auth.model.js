import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ── Basic Info ──────────────────────────────────────────────────────────
    name: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      default: null, // null for Google OAuth users
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },

    // ── Role ────────────────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ── Subscription & Plan ─────────────────────────────────────────────────
    plan: {
      type: String,
      enum: ["free", "starter", "pro_monthly", "pro_yearly"],
      default: "free",
    },
    downloadsRemaining: {
      type: Number,
      default: 3,  // Free plan: 3 lifetime downloads
    },
    downloadsUsed: {
      type: Number,
      default: 0,
    },
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active", "expired", "cancelled"],
      default: "inactive",
    },
    subscriptionStart: {
      type: Date,
      default: null,
    },
    subscriptionEnd: {
      type: Date,
      default: null,
    },

    // ── Auth Tokens ─────────────────────────────────────────────────────────
    refreshToken: {
      type: String,
      default: null,
    },

    // ── Google OAuth ─────────────────────────────────────────────────────────
    googleId: {
      type: String,
      default: null,
      sparse: true,  // allow multiple nulls in index
    },

    // ── Email Verification & Password Reset ──────────────────────────────────
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
