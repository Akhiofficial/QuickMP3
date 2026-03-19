import express from "express";
import authController from "./auth.controller.js";
import authMiddleware from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register user
 * @access Public
 */
router.post("/register", authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post("/login", authController.login);

/**
 * @route POST /api/auth/logout
 * @desc Logout user (clear refresh token from DB)
 * @access Private
 */
router.post("/logout", authMiddleware, authController.logout);

/**
 * @route GET /api/auth/get-me
 * @desc Get user profile (example private route)
 * @access Private
 */
router.get("/get-me", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

export default router;
