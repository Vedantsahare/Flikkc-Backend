import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  content: {
    type: String,
    required: true,
    trim: true
  }
},
{ timestamps: true }
);

const forumSchema = new mongoose.Schema(
{
  userId: {
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

  content: {
    type: String,
    required: true,
    trim: true
  },

  replies: [replySchema],

  reportCount: {
    type: Number,
    default: 0
  },

  flagged: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

forumSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Forum", forumSchema);