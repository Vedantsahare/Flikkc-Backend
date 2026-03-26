import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true
  },

  /* PAN */

  panNumberHash: String,
  panName: String,
  panImage: String,
  panVerified: {
    type: Boolean,
    default: false
  },

  /* Aadhaar */

  aadhaarNumberHash: String,
  aadhaarFront: String,
  aadhaarBack: String,
  aadhaarVerified: {
    type: Boolean,
    default: false
  },

  /* Face */

  selfie: String,

  /* Withdrawal */

  withdrawalEnabled: {
    type: Boolean,
    default: false
  },

  /* Admin */

  verifiedAt: Date,

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }

},
{
  timestamps: true
}
);

export default mongoose.model("Kyc", kycSchema);