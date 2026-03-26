import Withdrawal from "../models/Withdrawal.js";
import { createLedgerEntry } from "../utils/createLedgerEntry.js";

export const payoutWebhook = async (req, res) => {
  const {
    providerReference,
    status,
    failureReason
  } = req.body;

  const withdrawal = await Withdrawal.findOne({ providerReference });

  if (!withdrawal) {
    return res.status(200).json({ message: "Unknown reference ignored" });
  }

  // Idempotency guard
  if (withdrawal.status === "COMPLETED") {
    return res.status(200).json({ message: "Already processed" });
  }

  if (status === "SUCCESS") {
    await createLedgerEntry({
      walletId: withdrawal.walletId,
      userId: withdrawal.userId,
      type: "DEBIT",
      amount: withdrawal.amount,
      source: "WITHDRAWAL",
      performedBy: "SYSTEM",
      note: "Payout confirmed via webhook"
    });

    withdrawal.status = "COMPLETED";
  }

  if (status === "FAILED") {
    withdrawal.status = "FAILED";
    withdrawal.failureReason = failureReason;
  }

  await withdrawal.save();
  res.json({ message: "Webhook processed" });
};
