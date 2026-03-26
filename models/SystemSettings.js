import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
{
  withdrawalsPaused: { type: Boolean, default: false },
  gameplayPaused: { type: Boolean, default: false },
  walletPaused: { type: Boolean, default: false },

  reason: String,

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }

},
{ timestamps: true }
);

// Ensure single document
systemSettingsSchema.index({}, { unique: true });

export default mongoose.model("SystemSettings", systemSettingsSchema);