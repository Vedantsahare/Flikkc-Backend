import mongoose from "mongoose";
import Wallet from "../../models/Wallet.js";
import User from "../../models/User.js";
import Withdrawal from "../../models/Withdrawal.js";
import { createLedgerEntry } from "../createLedgerEntry.js";
import { sendAdminAlert } from "./adminAlerts.js";

export const executeAdminAction = async (action) => {
  const session = await mongoose.startSession();

  try {
    const payload = action.payload;

    session.startTransaction();

    switch (action.actionType) {

      case "WALLET_ADJUSTMENT": {
        if (!payload.userId || !payload.amount) {
          throw new Error("Invalid wallet adjustment payload");
        }

        const wallet = await Wallet.findOne({ userId: payload.userId });

        if (!wallet) {
          throw new Error("Wallet not found");
        }

        await createLedgerEntry({
          walletId: wallet._id,
          userId: payload.userId,
          type: payload.amount > 0 ? "CREDIT" : "DEBIT",
          amount: Math.abs(payload.amount),
          source: "ADMIN_ADJUSTMENT",
          performedBy: action.requestedBy,
          note: payload.reason
        });

        break;
      }

      case "FREEZE_USER": {
        if (!payload.userId) {
          throw new Error("UserId required");
        }

        await User.findByIdAndUpdate(payload.userId, {
          accountStatus: "FROZEN",
          frozenAt: new Date()
        });

        break;
      }

      case "APPROVE_WITHDRAWAL": {
        const withdrawal = await Withdrawal.findById(payload.withdrawalId);

        if (!withdrawal) {
          throw new Error("Withdrawal not found");
        }

        if (withdrawal.status !== "PENDING") {
          throw new Error("Already processed");
        }

        withdrawal.status = "APPROVED";
        await withdrawal.save();

        break;
      }

      default:
        throw new Error("Unknown admin action type");
    }

    await session.commitTransaction();

    await sendAdminAlert(`Admin action executed: ${action.actionType}`);

  } catch (error) {

    await session.abortTransaction();

    await sendAdminAlert(`Admin action FAILED: ${error.message}`);

    throw error;

  } finally {
    session.endSession();
  }
};