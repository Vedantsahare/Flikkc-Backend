import mongoose from "mongoose";

const adminNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },

    note: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

adminNoteSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("AdminNote", adminNoteSchema);