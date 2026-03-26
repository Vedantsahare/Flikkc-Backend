import mongoose from "mongoose";

const botLogSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  reason: {
    type: String,
    required: true
  },

  ip: String,

  deviceFingerprint: String,

  endpoint: String

},
{
  timestamps: true
}
);

export default mongoose.model("BotLog", botLogSchema);