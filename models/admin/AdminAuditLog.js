import mongoose from "mongoose";

const adminAuditLogSchema = new mongoose.Schema(
{
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  action: {
    type: String,
    required: true
  },

  targetType: {
    type: String,
    enum: ["USER", "WALLET", "KYC", "WITHDRAWAL", "SYSTEM", "ADMIN"],
    required: true
  },

  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },

  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  ipAddress: String

},
{ timestamps: true }
);

export default mongoose.model("AdminAuditLog", adminAuditLogSchema);