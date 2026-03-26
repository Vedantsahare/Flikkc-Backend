import mongoose from "mongoose";

const fraudLogSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  reason: String,

  riskScore: Number

},
{ timestamps: true }
);

fraudLogSchema.index({ userId: 1 });

export default mongoose.model("FraudLog", fraudLogSchema);