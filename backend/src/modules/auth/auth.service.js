import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "./auth.model.js";
import tokenService from "../../services/token.service.js";
import emailService from "../../services/email.service.js";

const saltRounds = 10;

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>}
 */
const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name: name || null,
    email,
    password: hashedPassword,
    plan: "free",
    downloadsRemaining: 3,
    downloadsUsed: 0,
  });

  await newUser.save();

  const userResponse = newUser.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  return userResponse;
};

/**
 * Login user and generate access and refresh tokens
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} tokens + user
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // Google OAuth users may not have a password
  if (!user.password) {
    const error = new Error("This account uses Google login. Please sign in with Google.");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = tokenService.generateAccessToken(user._id);
  const refreshToken = tokenService.generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  // Return user without sensitive fields
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    plan: user.plan,
    downloadsRemaining: user.downloadsRemaining,
    downloadsUsed: user.downloadsUsed,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionEnd: user.subscriptionEnd,
  };

  return { accessToken, refreshToken, user: safeUser };
};

/**
 * Get logged-in user's full profile
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const getMe = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -refreshToken -resetPasswordToken -resetPasswordExpiry"
  );
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Refresh Access Token using Refresh Token
 * @param {string} refreshToken
 * @returns {Promise<string>} accessToken
 */
const refreshUserToken = async (refreshToken) => {
  const payload = tokenService.verifyRefreshToken(refreshToken);
  if (!payload) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 403;
    throw error;
  }

  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Invalid refresh token");
    error.statusCode = 403;
    throw error;
  }

  const accessToken = tokenService.generateAccessToken(user._id);
  return accessToken;
};

/**
 * Logout User (Removes Refresh Token from DB)
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  return true;
};

/**
 * Initiate forgot password flow — generate reset token and send email
 * @param {string} email
 * @returns {Promise<void>}
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  // Don't reveal if user exists — silently succeed
  if (!user) return;

  // Generate a secure random token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // Send email with the plain token (not the hash)
  await emailService.sendPasswordResetEmail(
    user.email,
    resetToken,
    user.name || user.email.split("@")[0]
  );
};

/**
 * Reset password using the token from the email link
 * @param {string} token - Plain token from the email URL
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (token, newPassword) => {
  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error("Reset token is invalid or has expired");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  user.refreshToken = null; // Invalidate all sessions
  await user.save();
};

export default {
  registerUser,
  loginUser,
  getMe,
  refreshUserToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};
