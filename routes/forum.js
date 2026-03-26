// routes/forum.js
import express from "express";
import Forum from "../models/Forum.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all forum posts
router.get("/", async (req, res) => {
  try {
    const posts = await Forum.find()
      .populate("userId", "email role")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Fetch Forum Posts Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create new forum post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = new Forum({
      userId: req.user.id,
      title,
      content,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Create Forum Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get single post by ID (with replies)
router.get("/:id", async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id)
      .populate("userId", "email role")
      .populate("replies.userId", "email role");

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("Fetch Forum Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add reply to a post
router.post("/:id/reply", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    const post = await Forum.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = {
      userId: req.user.id,
      content,
    };

    post.replies.push(reply);
    await post.save();

    res.json({ success: true, post });
  } catch (err) {
    console.error("Add Reply Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;


// title max 150 characters
// content max 5000 characters