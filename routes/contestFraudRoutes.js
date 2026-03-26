import express from "express";
import auth from "../middlewares/auth.js";
import {
  trackContestEntry,
  checkContestFraud
} from "../controllers/contestFraudController.js";

const router = express.Router();

router.post("/track-entry", auth, trackContestEntry);
router.post("/check-collusion", auth, checkContestFraud);

export default router;