import express from "express";
import Leaderboard from "../models/Leaderboard.js";

const router = express.Router();

router.get("/:eventId", async (req, res) => {

  const data = await Leaderboard
    .find({ eventId: req.params.eventId })
    .sort({ rank: 1 });

  res.json(data);

});

export default router;