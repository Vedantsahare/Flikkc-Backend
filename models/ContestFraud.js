import mongoose from "mongoose";

const contestFraudSchema = new mongoose.Schema(
{
  contestId: {
    type: String,
    index: true
  },

  suspiciousUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  reason: String

},
{ timestamps: true }
);

contestFraudSchema.index({ contestId: 1 });

export default mongoose.model("ContestFraud", contestFraudSchema);