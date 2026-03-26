import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },

  title: String,

  message: String,

  type: {
    type: String,
    default: "system"
  },

  read: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

notificationSchema.index({ user: 1, read: 1 });

export default mongoose.model("Notification", notificationSchema);