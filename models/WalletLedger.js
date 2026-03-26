import mongoose from "mongoose";

const walletLedgerSchema = new mongoose.Schema(
{
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    required: true
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  source: {
    type: String,
    enum: [
      "DEPOSIT",
      "GAME_WIN",
      "GAME_ENTRY",
      "WITHDRAWAL",
      "ADMIN_ADJUSTMENT",
      "REFUND"
    ],
    required: true
  },

  referenceId: {
    type: String
  },

  balanceSnapshot: {
    type: Number,
    required: true
  },

  performedBy: {
    type: String,
    enum: ["USER", "ADMIN", "SYSTEM"],
    required: true
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  note: {
    type: String,
    trim: true
  }

},
{
  timestamps: true
}
);

// Optimize balance lookup
walletLedgerSchema.index({ walletId: 1, createdAt: -1 });

export default mongoose.model("WalletLedger", walletLedgerSchema);