import mongoose from "mongoose";

const userFingerprintSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  ipAddress: String,
  userAgent: String,
  deviceHash: {
    type: String,
    index: true
  },

  firstSeenAt: {
    type: Date,
    default: Date.now
  },

  lastSeenAt: Date

},
{ timestamps: true }
);

userFingerprintSchema.index({ userId: 1, deviceHash: 1 });

export default mongoose.model("UserFingerprint", userFingerprintSchema);