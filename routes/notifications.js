import express from "express";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(notifications);
});

router.post("/read/:id", authMiddleware, async (req, res) => {
  await Notification.findOneAndUpdate({
  _id: req.params.id,
  user: req.user.id
})
  res.json({ success: true });
});

export default router;
