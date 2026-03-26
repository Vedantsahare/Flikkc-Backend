import mongoose from "mongoose";

const streamChatSchema = new mongoose.Schema(
{
  streamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stream",
    index: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  message: {
    type: String,
    trim: true
  }

},
{ timestamps: true }
);

streamChatSchema.index({ streamId: 1, createdAt: -1 });

export default mongoose.model("StreamChat", streamChatSchema);