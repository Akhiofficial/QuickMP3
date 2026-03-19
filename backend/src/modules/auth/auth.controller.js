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
    const tokens = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      ...tokens
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
