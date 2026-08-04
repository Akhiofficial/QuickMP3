import authService from "./auth.service.js";

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

export default {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
