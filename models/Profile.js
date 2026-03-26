import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    fullName: { type: String, trim: true },
    username: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    dob: Date,
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    address: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 300 },
    avatar: String, // Cloudinary URL

    // ✅ New fields
    social: {
      twitter: { type: String, trim: true },
      discord: { type: String, trim: true },
      twitch: { type: String, trim: true },
    },
    gamingTags: {
      bgmi: { type: String, trim: true },
      steam: { type: String, trim: true },
      psn: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
