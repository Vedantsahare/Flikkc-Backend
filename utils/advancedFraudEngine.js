import { FRAUD_RULES } from "../config/fraudRules.js";
import User from "../models/User.js";
import Withdrawal from "../models/Withdrawal.js";
import WalletLedger from "../models/WalletLedger.js";

export const runFraudChecks = async (userId) => {
  const user = await User.findById(userId);

  const results = await Promise.all(
    FRAUD_RULES.map(rule =>
      rule.evaluate({
        userId,
        user,
        Withdrawal,
        WalletLedger
      }).then(triggered => ({
        triggered,
        weight: rule.weight,
        code: rule.code
      }))
    )
  );

  let score = 0;
  const triggeredRules = [];

  results.forEach(r => {
    if (r.triggered) {
      score += r.weight;
      triggeredRules.push(r.code);
    }
  });

  let riskLevel = "LOW";
  if (score >= 30) riskLevel = "MEDIUM";
  if (score >= 70) riskLevel = "HIGH";

  await User.findByIdAndUpdate(userId, {
    fraudScore: score,
    riskLevel
  });

  return { score, riskLevel, triggeredRules };
};