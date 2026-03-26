import WalletLedger from "../models/WalletLedger.js";

/**
 * Detect suspicious wallet activity (e.g., laundering / abuse)
 */
export const detectWalletFraud = async (userId) => {
  try {
    // Count suspicious transfer-type transactions
    const count = await WalletLedger.countDocuments({
      userId,
      source: "TRANSFER",
    });

    // Basic threshold logic (can be upgraded later)
    const isFraud = count > 10;

    return isFraud;
  } catch (error) {
    console.error("detectWalletFraud error:", error);
    return false;
  }
};