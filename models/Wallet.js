import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
{
  /* =========================
     Ownership
  ========================= */

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true
  },

  /* ============================
      Financial Information
  ===============================*/
  balance: {
      type: Number,
      default: 0,
      min: 0
  },

  currency: {
    type: String,
    default: "INR",
    enum: [
    "INR",
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD"
   ]
  },

  
  /* ============================
      Daily Spend Tracking
  ===============================*/
  dailySpend: {
    type: Number,
    default: 0
  },

  lastTxnAt: {
    type: Date
  },

  /* =========================
     Safety Controls
  ========================= */

  isLocked: {
    type: Boolean,
    default: false
  },

  lockedReason: {
    type: String,
    trim: true
  },

  lockedAt: {
    type: Date
  },

  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{
  timestamps: true
}
);

walletSchema.index({ userId: 1 });

export default mongoose.model("Wallet", walletSchema);
