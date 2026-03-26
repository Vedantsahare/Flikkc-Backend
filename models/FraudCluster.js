import mongoose from "mongoose";

const fraudClusterSchema = new mongoose.Schema(
{
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  reason: String,

  riskLevel: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"]
  }

},
{ timestamps: true }
);

export default mongoose.model("FraudCluster", fraudClusterSchema);