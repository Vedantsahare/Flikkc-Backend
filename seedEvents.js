import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";

dotenv.config();

const events = [
  {
    title: "Battle Royale Showdown",
    description: "Join the ultimate battle and win cash prizes.",
    game: "BGMI",
    entryFee: 50,
    prizePool: 500,
    date: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    title: "Cricket Trivia Night",
    description: "Answer cricket questions and win rewards.",
    game: "Trivia",
    entryFee: 20,
    prizePool: 200,
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    title: "Arcade Marathon",
    description: "Play arcade games and compete.",
    game: "Arcade",
    entryFee: 100,
    prizePool: 1000,
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  }
];

const seedEvents = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const inserted = await Event.insertMany(events);

    if (inserted.length === 0) {
      console.warn("No events inserted");
    } else {
      console.log(`Seeded ${inserted.length} events`);
    }

    await mongoose.connection.close();
    console.log("Database connection closed");

  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedEvents();