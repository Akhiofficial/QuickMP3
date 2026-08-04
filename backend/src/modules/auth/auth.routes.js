import express from "express";
import authController from "./auth.controller.js";
import authMiddleware from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route  POST /api/auth/register
 * @desc   Register a new user
 * @access Public
 */
router.post("/register", authController.register);

/**
 * @route  POST /api/auth/login
 * @desc   Login and get tokens
 * @access Public
 */
router.post("/login", authController.login);

/**
 * @route  GET /api/auth/me
 * @desc   Get current user profile (plan, downloads, etc.)
 * @access Private
 */
router.get("/me", authMiddleware, authController.getMe);

/**
 * @route  POST /api/auth/logout
 * @desc   Logout and invalidate refresh token
 * @access Private
 */
router.post("/logout", authMiddleware, authController.logout);

/**
 * @route  POST /api/auth/forgot-password
 * @desc   Send password reset email
 * @access Public
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @route  POST /api/auth/reset-password
 * @desc   Reset password using email token
 * @access Public
 */
router.post("/reset-password", authController.resetPassword);

// Legacy route (keep for backwards compat)
router.get("/get-me", authMiddleware, authController.getMe);

export default router;
