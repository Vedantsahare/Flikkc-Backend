import express from "express";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(notifications);
});

router.post("/read/:id", auth, async (req, res) => {
  await Notification.findOneAndUpdate({
  _id: req.params.id,
  user: req.user.id
})
  res.json({ success: true });
});

export default router;
