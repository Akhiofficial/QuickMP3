import tokenService from "../../services/token.service.js";

/**
 * Middleware to protect routes with JWT Access Token
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // Fallback to cookie (optional, but keep for compatibility)
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No access token provided",
      });
    }

    // Verify token using token service
    const decoded = tokenService.verifyAccessToken(token);
    
    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }

    // Attach user data to request
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
