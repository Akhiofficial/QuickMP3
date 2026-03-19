import express from "express";
import cors from "cors";
import { connectDB } from "./core/db/mongo.js";
import errorMiddleware from "./core/middlewares/error.middleware.js";

const app = express();

// middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// DB connection
connectDB();

// Root route
app.get('/', (req, res) => {
    res.json({ message: "YtMP3 API is running" });
});

// Error Handling
app.use(errorMiddleware);

export default app;