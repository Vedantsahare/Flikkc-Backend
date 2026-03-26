import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true
  },

  amount: {
    type: Number,
    required: true,
    min: 1
  },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
    default: "PENDING"
  },

  requestedAt: {
    type: Date,
    default: Date.now
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  reviewedAt: Date,

  rejectionReason: String,

  payoutReference: String

},
{ timestamps: true }
);

withdrawalSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Withdrawal", withdrawalSchema);