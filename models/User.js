import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },

  phoneNumber: {
    type: String,
    required: true,
    index: true
  },

  country: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user"],
    default: "user"
  },

  /* ================= 🔐 SECURE OTP ================= */

  otpHash: {
    type: String,
    default: null
  },

  otpExpires: {
    type: Date,
    default: null
  },

  otpAttempts: {
    type: Number,
    default: 0
  },

  otpLastSentAt: {
    type: Date,
    default: null
  },

  /* ================= 🔁 PASSWORD RESET ================= */

  resetToken: {
    type: String,
    default: null
  },

  resetTokenExpires: {
    type: Date,
    default: null
  },

  /* ================= 🛡 SECURITY ================= */

  accountStatus: {
    type: String,
    enum: ["ACTIVE", "FROZEN", "SUSPENDED"],
    default: "ACTIVE"
  },

  withdrawalBlocked: {
    type: Boolean,
    default: false
  },

  riskScore: {
    type: Number,
    default: 0
  },

  /* ================= ⚖️ LEGAL ================= */

  legalAcceptedAt: Date,
  legalVersion: String

},
{
  timestamps: true
}
);

/* 🔍 Indexes (important for performance) */
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

export default mongoose.model("User", userSchema);