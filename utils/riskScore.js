export default function calculateRisk(flags = []) {
  let score = 0;

  if (flags.includes("duplicate_device")) score += 40;
  if (flags.includes("duplicate_pan")) score += 50;
  if (flags.includes("duplicate_aadhaar")) score += 60;
  if (flags.includes("suspicious_ip")) score += 20;

  return score;
}