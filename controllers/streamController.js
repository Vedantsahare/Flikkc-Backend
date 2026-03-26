
import Stream from "../models/Stream.js";
import Event from "../models/Event.js";


/* =========================
   START STREAM
========================= */

export const startStream = async (req, res) => {

  try {

    const { eventId, streamUrl } = req.body;

    if (!eventId || !streamUrl) {

      return res.status(400).json({
        success:false,
        message:"eventId and streamUrl required"
      });

    }

    const event = await Event.findById(eventId);

    if (!event) {

      return res.status(404).json({
        success:false,
        message:"Event not found"
      });

    }

    const existingStream = await Stream.findOne({
      eventId,
      status:"LIVE"
    });

    if (existingStream) {

      return res.status(400).json({
        success:false,
        message:"Stream already running"
      });

    }

    const stream = await Stream.create({

      eventId,
      streamUrl,
      startedBy:req.user.id,
      startedAt:new Date(),
      status:"LIVE"

    });

    res.json({
      success:true,
      message:"Stream started",
      stream
    });

  } catch (error) {

    console.error("Stream start error:", error);

    res.status(500).json({
      success:false,
      message:"Failed to start stream"
    });

  }

};


/* =========================
   END STREAM
========================= */

export const endStream = async (req, res) => {

  try {

    const { streamId } = req.params;

    const stream = await Stream.findById(streamId);

    if (!stream) {

      return res.status(404).json({
        success:false,
        message:"Stream not found"
      });

    }

    stream.status = "ENDED";
    stream.endedAt = new Date();

    await stream.save();

    res.json({
      success:true,
      message:"Stream ended"
    });

  } catch (error) {

    console.error("Stream end error:", error);

    res.status(500).json({
      success:false,
      message:"Failed to end stream"
    });

  }

};


/* =========================
   GET LIVE STREAMS
========================= */

export const getLiveStreams = async (req, res) => {

  try {

    const streams = await Stream.find({
      status:"LIVE"
    })
    .populate("eventId","title")
    .sort({startedAt:-1});

    res.json({
      success:true,
      streams
    });

  } catch (error) {

    console.error("Fetch streams error:", error);

    res.status(500).json({
      success:false,
      message:"Failed to fetch streams"
    });

  }

};

