import mongoose from "mongoose";

const payoutProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true
    },

    upiId: {
      type: String,
      trim: true
    },

    bankAccount: {
      type: String
    },

    ifsc: {
      type: String
    },

    accountHolderName: {
      type: String
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    verifiedAt: Date
  },
  { timestamps: true }
);

payoutProfileSchema.index({ userId: 1 });

export default mongoose.model("PayoutProfile", payoutProfileSchema);
