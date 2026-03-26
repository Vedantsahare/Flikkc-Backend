import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  action: {
    type: String,
    required: true
  },

  metadata: mongoose.Schema.Types.Mixed

},
{ timestamps: true }
);

userActivitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("UserActivity", userActivitySchema);