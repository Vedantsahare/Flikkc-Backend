import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema(
  {
    meta: {
     hourBucket: Number,      // 0–23
     velocity: Number,        // txns per hour
     source: String,          // game | prize | wallet
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ faster queries for wallet
    },
    type: {
      type: String,
      enum: ["credit", "debit", "prize"], // ✅ added prize
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed", // ✅ wallet add/withdraw default is completed
    },
    referenceId: {
      type: String,
      default: null, // ✅ useful for Razorpay / UPI transaction IDs
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ Index for faster dashboard queries (latest transactions)
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;

