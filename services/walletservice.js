import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import redis from "../utils/redisClient.js";
import { convertCurrency } from "./currencyService.js";
import { logActivity } from "./activityLogger.js";
import { v4 as uuidv4 } from "uuid";

export const processWalletTransaction = async ({
  userId,
  type,
  amount,
  description,
  source = "wallet"
}) => {

  if (!userId) throw new Error("User ID required");
  if (!amount || amount <= 0) throw new Error("Invalid amount");
  if (!["credit", "debit"].includes(type)) {
    throw new Error("Invalid transaction type");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let wallet = await Wallet.findOne({ userId }).session(session);

    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0, currency: "INR" });
      await wallet.save({ session });
    }

    if (wallet.isLocked) {
      throw new Error("Wallet temporarily locked");
    }

    // Convert AFTER validation
    if (wallet.currency && wallet.currency !== "INR") {
      amount = await convertCurrency(amount, wallet.currency, "INR");
    }

    let updatedWallet;

    if (type === "debit") {
      updatedWallet = await Wallet.findOneAndUpdate(
        { userId, balance: { $gte: amount }, isLocked: false },
        { $inc: { balance: -amount }, $set: { isLocked: true } },
        { new: true, session }
      );

      if (!updatedWallet) throw new Error("Insufficient balance");

    } else {
      updatedWallet = await Wallet.findOneAndUpdate(
        { userId, isLocked: false },
        { $inc: { balance: amount }, $set: { isLocked: true } },
        { new: true, session }
      );
    }

    const referenceId = uuidv4();

    const [txn] = await Transaction.create([{
      userId,
      type,
      amount,
      description,
      referenceId,
      status: "completed",
      meta: { source }
    }], { session });

    await logActivity(
      userId,
      type === "credit" ? "WALLET_DEPOSIT" : "WALLET_WITHDRAW",
      { amount }
    );

    // Unlock wallet
    await Wallet.updateOne(
      { userId },
      { $set: { isLocked: false, lockedReason: null } },
      { session }
    );

    await session.commitTransaction();

    await redis.del(`wallet:${userId}`);

    return { wallet: updatedWallet, transaction: txn };

  } catch (error) {
    await session.abortTransaction();

    await Wallet.updateOne(
      { userId },
      { $set: { isLocked: false, lockedReason: null } }
    );

    throw error;

  } finally {
    session.endSession();
  }
};