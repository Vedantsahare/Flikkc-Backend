import express from "express";
import Profile from "../models/Profile.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import auth from "../middlewares/auth.js";
import legalGuard from "../middlewares/legalGuard.js";
import upload from "../middleware/upload.js";
import { uploadAvatar } from "../controllers/uploadController.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "flickkc_profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});


router.get("/", auth, legalGuard, async (req, res) => {

  const profile = await Profile.findOne({ userId: req.user.id });

  res.json(profile || {});

});

router.post(
  "/avatar",
  auth,
  upload.single("avatar"),
  uploadAvatar
);

router.post(
  "/",
  auth,
  legalGuard,
  upload.single("avatar"),
  async (req, res) => {

    const userId = req.user.id;

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = new Profile({ userId });
    }

    const fields = [
      "fullName",
      "username",
      "email",
      "phone",
      "dob",
      "gender",
      "address",
      "bio"
    ];

    fields.forEach(field => {
      if (req.body[field]) profile[field] = req.body[field];
    });

    if (req.file) {
      profile.avatar = req.file.path;
    }

    await profile.save();

    res.json({ success: true, profile });

  }
);

export default router;