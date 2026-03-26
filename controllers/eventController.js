import Event from "../models/Event.js";
import Wallet from "../models/Wallet.js";
import { processWalletTransaction } from "../services/walletservice.js";

/* =========================
   Get all events
========================= */

export const getEvents = async (req, res) => {

  try {

    const events = await Event.find()
      .sort({ date: 1 });

    res.json(events);

  } catch (error) {

    console.error("Fetch events error:", error);

    res.status(500).json({
      message: "Failed to fetch events"
    });

  }

};


/* =========================
   Join event
========================= */

export const joinEvent = async (req, res) => {

  try {

    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (event.participants.includes(userId)) {
      return res.status(400).json({
        message: "You already joined this event"
      });
    }

    /* Deduct entry fee */

    if (event.entryFee > 0) {

      try {

        await processWalletTransaction({

          userId,
          type: "debit",
          amount: event.entryFee,
          description: `Entry fee for event: ${event.title}`,
          source: "game"

        });

      } catch (err) {

        return res.status(400).json({
          message: err.message
        });

      }

    }

    /* Add participant */

    event.participants.push(userId);
    await event.save();

    /* Fetch updated wallet */

    const wallet = await Wallet.findOne({ userId });

    res.json({

      message: "Successfully joined the event",
      walletBalance: wallet?.balance || 0,
      participants: event.participants.length

    });

  } catch (error) {

    console.error("Join event error:", error);

    res.status(500).json({
      message: "Failed to join event"
    });

  }

};