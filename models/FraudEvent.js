import mongoose from "mongoose";

const fraudEventSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  triggeredRules: [String],

  fraudScore: Number,

  riskLevel: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"]
  },

  context: mongoose.Schema.Types.Mixed

},
{ timestamps: true }
);

fraudEventSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("FraudEvent", fraudEventSchema);