import express from "express";
import auth from "../middleware/auth.js";
import { generateAINotification } from "../controllers/aiNotificationController.js";

const router = express.Router();

router.post("/preview", auth, generateAINotification);

export default router;
