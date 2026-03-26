import Device from "../models/Device.js";
import User from "../models/User.js";
import FraudLog from "../models/FraudLog.js";
import calculateRisk from "../utils/riskScore.js";

/**
 * Track user device & detect fraud patterns
 */
export const trackDevice = async (req, res) => {
  try {
    const { fingerprint } = req.body;
    const userId = req.user.id;
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];

    if (!fingerprint) {
      return res.status(400).json({ message: "Fingerprint required" });
    }

    // Check existing devices
    const existingDevices = await Device.find({ fingerprint });

    let flags = [];

    if (existingDevices.length >= 3) {
      flags.push("duplicate_device");

      const user = await User.findById(userId);

      if (user) {
        user.fraudFlags = [...new Set([...(user.fraudFlags || []), ...flags])];

        const risk = calculateRisk(user.fraudFlags);

        user.riskScore = risk;

        if (risk > 80) {
          user.withdrawalBlocked = true;
        }

        await user.save();

        await FraudLog.create({
          userId: user._id,
          reason: "duplicate_device",
          riskScore: risk,
        });
      }
    }

    // Save/update device
    await Device.updateOne(
      { fingerprint, userId },
      {
        ip,
        userAgent,
        lastSeen: new Date(),
      },
      { upsert: true }
    );

    return res.json({
      success: true,
      flags,
    });
  } catch (error) {
    console.error("trackDevice error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};