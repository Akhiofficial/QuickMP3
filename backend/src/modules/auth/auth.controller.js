import authService from "./auth.service.js";

/**
 * Handle user registration
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Call registration service
    await authService.registerUser({ email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user login
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Call login service
    const { accessToken, refreshToken } = await authService.loginUser({ email, password });

    // Set HTTP-only cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Enable secure in production
        sameSite: "strict",
        maxAge: 30 * 60 * 1000 // 30 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { email } // You can send more user data here if needed
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Handle logout
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const logout = async (req, res, next) => {
    try {
        // req.user is set by authMiddleware
        const userId = req.user.id;
        
        await authService.logoutUser(userId);

        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        next(error);
    }
};

export default {
  register,
  login,
  logout
};
