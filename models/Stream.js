import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
{
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  category: {
    type: String,
    default: "general"
  },

  thumbnail: {
    type: String
  },

  isLive: {
    type: Boolean,
    default: false
  },

  viewerCount: {
    type: Number,
    default: 0
  },

  startedAt: Date,
  endedAt: Date

},
{ timestamps: true }
);

streamSchema.index({ isLive: 1 });

export default mongoose.model("Stream", streamSchema);