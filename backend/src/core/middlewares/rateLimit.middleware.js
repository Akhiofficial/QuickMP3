import rateLimit from "express-rate-limit";

/**
 * Global rate limiter: Applies to all routes.
 * Limit: 100 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for conversion initiation.
 * Limit: 5 requests per 10 minutes per IP.
 */
export const conversionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many conversion requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  globalLimiter,
  conversionLimiter,
};
