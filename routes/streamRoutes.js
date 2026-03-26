import express from "express";
import { startStream, endStream, getLiveStreams } from "../controllers/streamController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/start", auth, startStream);

router.post("/end/:id", auth, endStream);

router.get("/live", getLiveStreams);

export default router;