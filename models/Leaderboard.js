import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  score: {
    type: Number,
    default: 0
  },

  rank: {
    type: Number
  }

}, { timestamps: true });

leaderboardSchema.index(
  { eventId: 1, userId: 1 },
  { unique: true }
);

export default mongoose.model(
  "Leaderboard",
  leaderboardSchema
);