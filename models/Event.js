// models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    game: { type: String, trim: true }, // e.g., BGMI, COD
    prizePool: { type: Number, default: 0 }, // total prize money
    entryFee: { type: Number, default: 0 }, // ✅ keep only once
    date: { type: Date, required: true },
    maxPlayers: { type: Number, default: 100 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
