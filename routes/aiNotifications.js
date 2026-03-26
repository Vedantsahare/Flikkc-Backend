import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateAINotification } from "../controllers/aiNotificationController.js";

const router = express.Router();

router.post("/preview", authMiddleware, generateAINotification);

export default router;
