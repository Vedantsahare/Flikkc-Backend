import mongoose from "mongoose";

const kycOtpSchema = new mongoose.Schema(
{
  phone: {
    type: String,
    required: true,
    index: true
  },

  otp: {
    type: String,
    required: true
  },

  expiresAt: {
    type: Date,
    required: true
  }

},
{ timestamps: true }
);

// Auto-delete expired OTPs
kycOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("KycOtp", kycOtpSchema);