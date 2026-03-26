import express from "express";
import { getEvents, joinEvent } from "../controllers/eventController.js";
import { submitEventResults } from "../controllers/eventResultController.js";
import auth from "../middlewares/auth.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { cache } from "../middlewares/cache.js";

const router = express.Router();

router.get("/", getEvents);

router.post("/:eventId/join", auth, joinEvent);

router.post(
  "/results",
  auth,
  roleGuard("SUPER_ADMIN"),
  submitEventResults
);

router.get("/list", cache("events", 120), getEvents);

export default router;