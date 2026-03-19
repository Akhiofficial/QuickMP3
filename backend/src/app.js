import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./core/db/mongo.js";
import config from "./core/config/index.js";
import authRoutes from "./modules/auth/auth.routes.js";
import conversionRoutes from "./modules/conversion/conversion.routes.js";
import errorMiddleware from "./core/middlewares/error.middleware.js";
import authMiddleware from "./core/middlewares/auth.middleware.js";
import { globalLimiter } from "./core/middlewares/rateLimit.middleware.js";

const app = express();

// middlewares 
app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true, // Allow cookies to be sent
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/conversion", conversionRoutes);

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Access granted",
    user: req.user,
  });
});

// DB connection
connectDB();

// Root route
app.get('/', (req, res) => {
    res.json({ message: "YtMP3 API is running" });
});

// Error Handling
app.use(errorMiddleware);

export default app;