import mongoose from "mongoose";

const adminPendingActionSchema = new mongoose.Schema(
{
  actionType: {
    type: String,
    enum: [
      "WALLET_ADJUSTMENT",
      "FREEZE_USER",
      "APPROVE_WITHDRAWAL"
    ],
    required: true
  },

  payload: {
    type: Object,
    required: true
  },

  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  approvedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }
  ],

  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  },

  rejectionReason: String,

  status: {
    type: String,
    enum: ["PENDING", "EXECUTING", "EXECUTED", "REJECTED"],
    default: "PENDING"
  },

  executedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },

  executedAt: Date

},
{
  timestamps: true
}
);

export default mongoose.model(
  "AdminPendingAction",
  adminPendingActionSchema
);