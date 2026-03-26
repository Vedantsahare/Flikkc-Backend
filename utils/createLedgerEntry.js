import WalletLedger from "../models/WalletLedger.js";
import { getWalletBalance } from "./getWalletBalance.js";

export const createLedgerEntry = async ({
  walletId,
  userId,
  type,
  amount,
  source,
  referenceId = null,
  performedBy,
  adminId = null,
  note = ""
}) => {

  if (!walletId || !userId) {
    throw new Error("Wallet or user missing");
  }

  if (!["CREDIT", "DEBIT"].includes(type)) {
    throw new Error("Invalid ledger type");
  }

  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const currentBalance = await getWalletBalance(walletId);

  const newBalance =
    type === "CREDIT"
      ? currentBalance + amount
      : currentBalance - amount;

  if (newBalance < 0) {
    throw new Error("Insufficient wallet balance");
  }

  return await WalletLedger.create({
    walletId,
    userId,
    type,
    amount,
    source,
    referenceId,
    balanceSnapshot: newBalance,
    performedBy,
    adminId,
    note
  });

};