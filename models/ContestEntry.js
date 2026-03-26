import mongoose from "mongoose";

const contestEntrySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  contestId: String,

  joinedAt: {
    type: Date,
    default: Date.now
  },

  ip: String,

  deviceFingerprint: String

});

/* Prevent duplicate joins */

contestEntrySchema.index(
  { userId: 1, contestId: 1 },
  { unique: true }
);

export default mongoose.model("ContestEntry", contestEntrySchema);