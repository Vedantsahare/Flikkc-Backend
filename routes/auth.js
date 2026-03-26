import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import { processWalletTransaction } from "../services/walletservice.js";
import { acceptLegal } from "../controllers/authController.js";

import auth from "../middlewares/auth.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

/* 🔥 OTP CONTROLLERS */
import {
  sendOtpLogin,
  verifyOtpLogin
} from "../controllers/authController.js";

const router = express.Router();

let resetTokens = {};

/* ================= REGISTER ================= */

router.post("/register", apiLimiter, async (req, res) => {
  try {
    const { email, password, country, phoneNumber } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed,
      country,
      phoneNumber
    });

    await user.save();

    /* 💰 SIGNUP BONUS */
    await processWalletTransaction({
      userId: user._id,
      type: "credit",
      amount: 100,
      description: "Signup bonus",
      source: "system"
    });

    res.status(201).json({ success: true });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */

router.post("/login", apiLimiter, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict"
  });

  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      country: user.country
    }
  });
});

/* ================= OTP LOGIN ================= */

router.post("/send-otp", apiLimiter, sendOtpLogin);

router.post("/verify-otp", apiLimiter, verifyOtpLogin);

/* ================= FORGOT PASSWORD ================= */

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "If email exists, reset link sent" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  resetTokens[token] = {
    userId: user._id,
    expiry: Date.now() + 900000
  };

  res.json({ resetToken: token });
});

/* ================= RESET PASSWORD ================= */

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;

  const record = resetTokens[token];

  if (!record || Date.now() > record.expiry) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const user = await User.findById(record.userId);

  const hashed = await bcrypt.hash(req.body.password, 10);

  user.password = hashed;
  await user.save();

  delete resetTokens[token];

  res.json({ success: true });
});

/* ================= LEGAL ================= */

router.post("/accept-legal", auth, acceptLegal);

export default router;