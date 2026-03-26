import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  fingerprint: {
    type: String,
    required: true
  },

  ip: String,
  userAgent: String

},
{ timestamps: true }
);

deviceSchema.index({ fingerprint: 1 }, { unique: true });

export default mongoose.model("Device", deviceSchema);