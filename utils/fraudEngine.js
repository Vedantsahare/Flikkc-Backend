import Withdrawal from "../models/Withdrawal.js";
import User from "../models/User.js";

export const evaluateFraudRisk = async (userId) => {
  const withdrawals24h = await Withdrawal.countDocuments({
    userId,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  let risk = "LOW";

  if (withdrawals24h >= 2) risk = "MEDIUM";
  if (withdrawals24h >= 4) risk = "HIGH";

  await User.findByIdAndUpdate(userId, { riskLevel: risk });

  return risk;
};
