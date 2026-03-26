import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";
import Transaction from "../../models/Transaction.js";
import AdminNote from "../../models/AdminNote.js";

/* =========================
   Fraud investigation
========================= */

export const investigateUser = async (req, res) => {

  try {

    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const [wallet, transactions, notes] = await Promise.all([

      Wallet.findOne({ userId }),

      Transaction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20),

      AdminNote.find({ userId })
        .populate("adminId", "email")
    ]);

    res.json({
      user,
      wallet,
      transactions,
      notes
    });

  } catch (error) {

    console.error("Fraud investigation error:", error);

    res.status(500).json({
      message: "Investigation failed"
    });

  }

};