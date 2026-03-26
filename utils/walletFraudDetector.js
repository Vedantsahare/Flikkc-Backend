import WalletLedger from "../models/WalletLedger.js";

export default async function detectWalletFraud(userId) {
  const count = await WalletLedger.countDocuments({
    userId,
    source: "TRANSFER"
  });

  return count > 10;
}