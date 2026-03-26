import rateLimit from "express-rate-limit";
import { ipKeyGenerator } from "express-rate-limit";

/**
 * Safe key generator (IPv6 compliant)
 */
const generateKey = (req) => {
  if (req.user?.id) {
    return `user:${req.user.id}`;
  }

  return ipKeyGenerator(req); // ✅ REQUIRED FIX
};

/* GLOBAL */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: generateKey,
});

/* PROFILE */
export const profileLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyGenerator: generateKey,
});

/* WALLET */
export const walletLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  keyGenerator: generateKey,
});

/* IP */
export const ipLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: ipKeyGenerator, // ✅ IMPORTANT
});

/* USER */
export const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  keyGenerator: generateKey,
});