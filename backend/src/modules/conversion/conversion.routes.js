import express from "express";
import conversionController from "./conversion.controller.js";
import { conversionLimiter } from "../../core/middlewares/rateLimit.middleware.js";

import authMiddleware from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication to all conversion routes
router.use(authMiddleware);

/**
 * Route: POST /api/conversion/metadata
 * Access: Private
 */
router.post("/metadata", conversionController.getMetadata);
router.post("/convert", conversionLimiter, conversionController.convertVideo);
router.get("/status/:jobId", conversionController.getStatus);
router.get("/download/:jobId", conversionController.downloadFile);

export default router;
