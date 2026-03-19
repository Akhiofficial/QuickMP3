import bcrypt from "bcrypt";
import User from "./auth.model.js";
import tokenService from "../../services/token.service.js";

const saltRounds = 10;

/**
 * Register a new user
 * @param {Object} userData 
 * @returns {Promise<Object>}
 */
const registerUser = async ({ email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const newUser = new User({
    email,
    password: hashedPassword,
  });

  await newUser.save();

  // Return user without password or secret fields
  const userResponse = newUser.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  return userResponse;
};

/**
 * Login user and generate access and refresh tokens
 * @param {Object} credentials
 * @returns {Promise<Object>} tokens
 */
const loginUser = async ({ email, password }) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // Generate tokens
  const accessToken = tokenService.generateAccessToken(user._id);
  const refreshToken = tokenService.generateRefreshToken(user._id);

  // Save refresh token to user in DB
  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken
  };
};

/**
 * Refresh Access Token using Refresh Token
 * @param {string} refreshToken 
 * @returns {Promise<string>} accessToken
 */
const refreshUserToken = async (refreshToken) => {
    // 1. Verify Refresh Token
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
        const error = new Error("Invalid or expired refresh token");
        error.statusCode = 403;
        throw error;
    }

    // 2. Find user and match token in DB
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
        const error = new Error("Invalid refresh token");
        error.statusCode = 403;
        throw error;
    }

    // 3. Generate new Access Token
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

export default {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser
};
