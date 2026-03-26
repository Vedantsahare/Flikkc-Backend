export const distributeEventPrizes = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) throw new Error("Event not found");
  if (event.prizesDistributed) throw new Error("Already distributed");

  const leaderboard = await Leaderboard.find({ eventId }).sort({ score: -1 });

  if (!leaderboard.length) throw new Error("No entries");

  const winners = leaderboard.slice(0, event.maxWinners);
  const prizePerWinner = event.prizePool / winners.length;

  await Promise.all(
    winners.map(winner =>
      processWalletTransaction({
        userId: winner.userId,
        type: "credit",
        amount: prizePerWinner,
        description: "Event prize payout",
        source: "event"
      })
    )
  );

  event.prizesDistributed = true;
  await event.save();

  return { winners, prizePerWinner };
};