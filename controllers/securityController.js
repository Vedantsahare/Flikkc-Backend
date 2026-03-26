import User from "../models/User.js";
import BotLog from "../models/BotLog.js";

import detectBotBehavior from "../utils/botDetector.js";
import detectWalletFraud from "../utils/walletFraudDetector.js";
import calculateRisk from "../utils/riskScore.js";

/**
 * Detect bot activity
 */
export const checkBot = async (req, res) => {
  try {
    const { actions } = req.body;
    const userId = req.user.id;

    const isBot = detectBotBehavior(actions || []);

    let flags = [];

    if (isBot) {
      flags.push("bot_activity");

      const user = await User.findById(userId);

      if (user) {
        user.fraudFlags = [
          ...new Set([...(user.fraudFlags || []), ...flags]),
        ];

        const risk = calculateRisk(user.fraudFlags);

        user.riskScore = risk;

        if (risk > 80) {
          user.withdrawalBlocked = true;
        }

        await user.save();

        await BotLog.create({
          userId: user._id,
          reason: "bot_activity",
          riskScore: risk,
        });
      }
    }

    return res.json({
      success: true,
      botDetected: isBot,
      flags,
    });
  } catch (error) {
    console.error("checkBot error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Detect wallet fraud
 */
export const checkWalletFraud = async (req, res) => {
  try {
    const userId = req.user.id;

    const fraud = await detectWalletFraud(userId);

    let flags = [];

    if (fraud) {
      flags.push("wallet_laundering");

      const user = await User.findById(userId);

      if (user) {
        user.fraudFlags = [
          ...new Set([...(user.fraudFlags || []), ...flags]),
        ];

        const risk = calculateRisk(user.fraudFlags);

        user.riskScore = risk;

        if (risk > 80) {
          user.withdrawalBlocked = true;
        }

        await user.save();
      }
    }

    return res.json({
      success: true,
      walletFraud: fraud,
      flags,
    });
  } catch (error) {
    console.error("checkWalletFraud error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};