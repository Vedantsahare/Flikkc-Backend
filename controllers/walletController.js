import mongoose from "mongoose";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { processWalletTransaction } from "../services/walletservice.js";

/* =========================
   Transfer funds (SAFE + SECURE)
========================= */

export const transferFunds = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { recipientId, amount } = req.body;

    // ✅ Basic validation
    if (!recipientId || !amount || amount <= 0) {
      return res.status(400).json({
        message: "Valid recipient and amount required"
      });
    }

    if (recipientId === req.user.id) {
      return res.status(400).json({
        message: "Cannot transfer to yourself"
      });
    }

    // ✅ Fetch sender (latest DB state)
    const sender = await User.findById(req.user.id);

    if (!sender) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 🔴 FRAUD BLOCK CHECK
    if (sender.withdrawalBlocked) {
      return res.status(403).json({
        message: "Account restricted due to suspicious activity"
      });
    }

    session.startTransaction();

    // ✅ Debit sender
    const debit = await processWalletTransaction({
      userId: sender._id,
      type: "debit",
      amount,
      description: `Transfer to ${recipientId}`,
      source: "transfer",
      session
    });

    // ✅ Credit receiver
    await processWalletTransaction({
      userId: recipientId,
      type: "credit",
      amount,
      description: `Transfer from ${sender._id}`,
      source: "transfer",
      session
    });

    // 🔴 FRAUD AUTO-BLOCK
    if (sender.riskScore > 80) {
      sender.withdrawalBlocked = true;
      await sender.save({ session });
    }

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Transfer successful",
      balance: debit.wallet.balance
    });

  } catch (error) {

    await session.abortTransaction();

    console.error("Transfer Error:", error);

    res.status(500).json({
      message: error.message || "Transaction failed"
    });

  } finally {
    session.endSession();
  }
};