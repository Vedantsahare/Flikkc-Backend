import express from "express";
import auth from "../middlewares/auth.js";
import { trackDevice } from "../controllers/fraudController.js";

const router = express.Router();

router.post("/device", auth, trackDevice);

export default router;