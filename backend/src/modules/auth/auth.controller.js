import authService from "./auth.service.js";
import config from "../../core/config/index.js";

/**
 * Handle user registration
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    await authService.registerUser({ name, email, password });

    res.status(201).json({ success: true, message: "Account created successfully. Please log in." });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const { accessToken, refreshToken, user } = await authService.loginUser({ email, password });

    // Set HTTP-only cookies (for security)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000, // 30 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Also return tokens in body for localStorage fallback
    res.status(200).json({ success: true, message: "Login successful", accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile (protected)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle logout
 */
const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user.id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password — sends reset email
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    await authService.forgotPassword(email);

    // Always respond with success to avoid user enumeration
    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password — validates token and updates password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    await authService.resetPassword(token, password);

    res.status(200).json({ success: true, message: "Password reset successful. Please log in." });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Google login
 */
const googleLogin = async (req, res, next) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Authorization code is required" });
    }

    const clientId = config.google.clientId;
    const clientSecret = config.google.clientSecret;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        success: false,
        message: "Google OAuth credentials are not configured on the server",
      });
    }

    // 1. Exchange authorization code for tokens with Google
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const tokenParams = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenParams).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Google token exchange error:", errorData);
      return res.status(400).json({ success: false, message: "Failed to exchange Google authorization code" });
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // 2. Fetch user profile from Google using the access token
    const profileUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
    const profileResponse = await fetch(profileUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileResponse.ok) {
      return res.status(400).json({ success: false, message: "Failed to fetch Google user profile" });
    }

    const profile = await profileResponse.json();
    const { sub: googleId, email, name, picture: avatar } = profile;

    if (!email) {
      return res.status(400).json({ success: false, message: "Google account does not provide an email address" });
    }

    // 3. Process the login / registration in service
    const { accessToken, refreshToken, user } = await authService.loginWithGoogle({
      googleId,
      email,
      name,
      avatar,
    });

    // Set HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Google login successful", accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  googleLogin,
};
