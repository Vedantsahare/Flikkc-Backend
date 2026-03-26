import Withdrawal from "../models/Withdrawal.js";

export const payoutThrottle = async (req, res, next) => {
  const user = req.user;

  if (user.riskLevel === "HIGH") {
    return res.status(403).json({
      message: "Withdrawals under review"
    });
  }

  if (user.riskLevel === "MEDIUM") {
    const total = await Withdrawal.aggregate([
      {
        $match: {
          userId: user.id,
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      { $group: { _id: null, sum: { $sum: "$amount" } } }
    ]);

    const limit = 5000; // example
    if (total[0]?.sum >= limit) {
      return res.status(403).json({
        message: "Daily withdrawal limit reached"
      });
    }
  }

  next();
};
