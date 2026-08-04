import express from "express";
import downloadsController from "./downloads.controller.js";
import authMiddleware from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route  GET /api/downloads
 * @desc   Get current user's download history
 * @access Private
 */
router.get("/", downloadsController.getHistory);

/**
 * @route  GET /api/downloads/quota
 * @desc   Check if user can download (quota check)
 * @access Private
 */
router.get("/quota", downloadsController.checkQuota);

export default router;
