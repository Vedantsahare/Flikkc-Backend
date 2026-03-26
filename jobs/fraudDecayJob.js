export const decayFraudScores = async () => {
  try {
    const result = await User.updateMany(
      { fraudScore: { $gt: 0 } },
      [
        {
          $set: {
            fraudScore: {
              $max: [0, { $subtract: ["$fraudScore", 5] }]
            }
          }
        }
      ]
    );

    console.log(`Fraud decay applied to ${result.modifiedCount} users`);

  } catch (error) {
    console.error("Fraud decay job error:", error);
  }
};