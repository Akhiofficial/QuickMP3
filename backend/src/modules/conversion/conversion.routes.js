import express from "express";
import conversionController from "./conversion.controller.js";
import { conversionLimiter } from "../../core/middlewares/rateLimit.middleware.js";

const router = express.Router();

/**
 * Route: POST /api/conversion/metadata
 * Access: Public (or Protected depending on requirements, usually public for search)
 */
router.post("/metadata", conversionController.getMetadata);
router.post("/convert", conversionLimiter, conversionController.convertVideo);
router.get("/status/:jobId", conversionController.getStatus);
router.get("/download/:jobId", conversionController.downloadFile);

export default router;
