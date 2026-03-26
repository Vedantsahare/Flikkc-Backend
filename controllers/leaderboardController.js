import Leaderboard from "../models/Leaderboard.js";

export const updateScore = async (req, res) => {

  const { eventId, score } = req.body;

  const entry = await Leaderboard.findOneAndUpdate(
    {
      eventId,
      userId: req.user.id
    },
    {
      $inc: { score }
    },
    {
      new: true,
      upsert: true
    }
  );

  res.json({
    success: true,
    entry
  });

};

export const getLeaderboard = async (req, res) => {

  const { eventId } = req.params;

  const leaderboard = await Leaderboard.find({
    eventId
  })
    .populate("userId", "username")
    .sort({ score: -1 })
    .limit(100);

  res.json({
    success: true,
    leaderboard
  });

};