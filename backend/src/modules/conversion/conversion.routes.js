// Conversion Routes
import express from 'express';
// import { startConversion } from './conversion.controller.js';

const router = express.Router();

router.post('/', (req, res) => {
    res.json({ message: "Conversion route is working" });
});

export default router;
