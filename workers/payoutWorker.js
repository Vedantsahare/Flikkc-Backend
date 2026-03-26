import mongoose from "mongoose";
import Withdrawal from "../models/Withdrawal.js";
import { sendPayout } from "../services/payoutProvider.js";
import { createLedgerEntry } from "../utils/createLedgerEntry.js";
import redis from "../utils/redisClient.js";

const RATE_LIMIT_KEY = "payout_rate_limit";

export const processPayouts = async () => {

  const current = await redis.incr(RATE_LIMIT_KEY);

  if (current === 1) {
    await redis.expire(RATE_LIMIT_KEY, 60); // 60 sec window
  }

  if (current > 20) {
    console.warn("Payout rate limit exceeded");
    return;
  }

  const withdrawals = await Withdrawal.find({
    status: "APPROVED"
  }).limit(10);

  for (const w of withdrawals) {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

      const locked = await Withdrawal.findOneAndUpdate(
        { _id: w._id, status: "APPROVED" },
        { status: "PROCESSING" },
        { new: true, session }
      );

      if (!locked) {
        await session.abortTransaction();
        session.endSession();
        continue;
      }

      const result = await sendPayout({
        amount: w.amount,
        method: w.payoutMethod,
        details: w.payoutDetails
      });

      if (result.success) {

        await createLedgerEntry({
          walletId: w.walletId,
          userId: w.userId,
          type: "DEBIT",
          amount: w.amount,
          source: "WITHDRAWAL",
          performedBy: "SYSTEM",
          note: "Auto payout completed"
        });

        await Withdrawal.updateOne(
          { _id: w._id },
          {
            status: "COMPLETED",
            providerReference: result.providerReference,
            processedAt: new Date()
          },
          { session }
        );

      } else {

        await Withdrawal.updateOne(
          { _id: w._id },
          {
            status: "FAILED",
            failureReason: result.reason
          },
          { session }
        );

      }

      await session.commitTransaction();

    } catch (error) {

      await session.abortTransaction();

      await Withdrawal.updateOne(
        { _id: w._id },
        {
          status: "FAILED",
          failureReason: error.message
        }
      );

    } finally {
      session.endSession();
    }
  }
};