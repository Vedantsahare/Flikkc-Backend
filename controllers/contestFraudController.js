import ContestEntry from "../models/ContestEntry.js";
import ContestFraud from "../models/ContestFraud.js";
import detectCollusion from "../utils/collusionDetector.js";

/* =========================
   Track contest entry
========================= */

export const trackContestEntry = async (req, res) => {

  try {

    const { contestId, deviceFingerprint } = req.body;

    if (!contestId) {
      return res.status(400).json({
        message: "contestId required"
      });
    }

    const ip = req.ip;

    await ContestEntry.create({
      userId: req.user.id,
      contestId,
      deviceFingerprint,
      ip
    });

    res.json({
      success: true
    });

  } catch (error) {

    console.error("Contest entry tracking error:", error);

    res.status(500).json({
      message: "Failed to track contest entry"
    });

  }

};


/* =========================
   Detect contest collusion
========================= */

export const checkContestFraud = async (req, res) => {

  try {

    const { contestId } = req.body;

    if (!contestId) {
      return res.status(400).json({
        message: "contestId required"
      });
    }

    const suspiciousUsers = await detectCollusion(contestId);

    if (suspiciousUsers.length > 0) {

      await ContestFraud.create({

        contestId,
        suspiciousUsers,
        reason: "possible_collusion"

      });

    }

    res.json({
      suspiciousUsers
    });

  } catch (error) {

    console.error("Contest fraud detection error:", error);

    res.status(500).json({
      message: "Contest fraud check failed"
    });

  }

};